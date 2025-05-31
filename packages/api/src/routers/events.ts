import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { dateInputSchema } from "../providers/validations";
import { calendarProcedure, createTRPCRouter } from "../trpc";

export const eventsRouter = createTRPCRouter({
  list: calendarProcedure
    .input(
      z.object({
        calendarIds: z.array(z.string()).default([]),
        timeMin: z.string().optional(),
        timeMax: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allEvents = await Promise.all(
        ctx.allCalendarClients.map(async ({ client, connection }) => {
          let calendarIds = input.calendarIds;

          if (calendarIds.length === 0) {
            try {
              const calendars = await client.calendars();
              calendarIds = calendars
                // .filter(
                //   (cal) =>
                //     cal.primary || cal.id?.includes("@group.calendar.google.com"),
                // )
                .map((cal) => cal.id)
                .filter(Boolean);
            } catch (error) {
              console.error(
                `Failed to fetch calendars for provider ${connection.providerId}:`,
                error,
              );
              return [];
            }
          }

          const providerEvents = await Promise.all(
            calendarIds.map(async (calendarId) => {
              try {
                const events = await client.events(
                  calendarId,
                  input.timeMin,
                  input.timeMax,
                );

                return events.map((event) => ({
                  ...event,
                  calendarId,
                  providerId: connection.providerId,
                  accountId: connection.id,
                  accountName: connection.email,
                  connectionId: connection.id,
                }));
              } catch (error) {
                console.error(
                  `Failed to fetch events for calendar ${calendarId} from ${connection.providerId}:`,
                  error,
                );
                return [];
              }
            }),
          );

          return providerEvents.flat();
        }),
      );

      const events = allEvents
        .flat()
        .sort(
          (a, b) =>
            new Date(a.start.dateTime).getTime() -
            new Date(b.start.dateTime).getTime(),
        );

      return { events };
    }),

  create: calendarProcedure
    .input(
      z.object({
        connectionId: z.string(),
        calendarId: z.string(),
        title: z.string(),
        start: dateInputSchema,
        end: dateInputSchema,
        allDay: z.boolean().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const calendarClient = ctx.allCalendarClients.find(
        ({ connection }) => connection.id === input.connectionId,
      );

      if (!calendarClient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for connectionId: ${input.connectionId}`,
        });
      }

      const { connectionId, ...eventData } = input;

      const event = await calendarClient.client.createEvent(
        eventData.calendarId,
        eventData,
      );

      return { event };
    }),

  update: calendarProcedure
    .input(
      z.object({
        connectionId: z.string(),
        calendarId: z.string(),
        eventId: z.string(),
        title: z.string().optional(),
        start: dateInputSchema.optional(),
        end: dateInputSchema.optional(),
        allDay: z.boolean().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const calendarClient = ctx.allCalendarClients.find(
        ({ connection }) => connection.id === input.connectionId,
      );

      if (!calendarClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for connectionId: ${input.connectionId}`,
        });
      }

      const { connectionId, calendarId, eventId, ...updateData } = input;

      const event = await calendarClient.client.updateEvent(
        calendarId,
        eventId,
        updateData,
      );

      return { event };
    }),

  delete: calendarProcedure
    .input(
      z.object({
        connectionId: z.string(),
        calendarId: z.string(),
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const calendarClient = ctx.allCalendarClients.find(
        ({ connection }) => connection.id === input.connectionId,
      );

      if (!calendarClient?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for connectionId: ${input.connectionId}`,
        });
      }

      await calendarClient.client.deleteEvent(input.calendarId, input.eventId);
      return { success: true };
    }),
});
