import { TRPCError } from "@trpc/server";
import { auth } from "@repo/auth/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { GoogleCalendarProvider } from "../providers/google-calendar";
import { dateHelpers } from "../utils/date-helpers";
import { z } from "zod";

export const eventsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        calendarIds: z.array(z.string()).optional(),
        timeMin: z.string().optional(),
        timeMax: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "google",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const client = new GoogleCalendarProvider({
        accessToken,
      });

      let calendarIds = input.calendarIds;
      if (!calendarIds || calendarIds.length === 0) {
        const calendars = await client.calendars();
        calendarIds = calendars
          .filter((cal) => cal.primary || cal.id?.includes("@group.calendar.google.com"))
          .map((cal) => cal.id)
          .filter(Boolean);
      }

      const allEvents = await Promise.all(
        calendarIds.map(async (calendarId) => {
          try {
            const events = await client.events(calendarId, input.timeMin, input.timeMax);
            return events;
          } catch (error) {
            console.error(`Failed to fetch events for calendar ${calendarId}:`, error);
            return [];
          }
        })
      );

      const events = allEvents.flat().sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      return { events };
    }),

  create: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        title: z.string(),
        start: z.string(),
        end: z.string(),
        allDay: z.boolean().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "google",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const client = new GoogleCalendarProvider({
        accessToken,
      });

      const googleParams = dateHelpers.prepareGoogleParams(input);
      const event = await client.createEvent(input.calendarId, googleParams);
      return { event };
    }),

  update: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        eventId: z.string(),
        title: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        allDay: z.boolean().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "google",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const client = new GoogleCalendarProvider({
        accessToken,
      });

      const googleParams = dateHelpers.prepareGoogleParams(input);
      const event = await client.updateEvent(input.calendarId, input.eventId, googleParams);

      return { event };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "google",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const client = new GoogleCalendarProvider({
        accessToken,
      });

      await client.deleteEvent(input.calendarId, input.eventId);
      return { success: true };
    }),
});
