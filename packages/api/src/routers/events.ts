import { TRPCError } from "@trpc/server";
import { Temporal } from "temporal-polyfill";
import { zZonedDateTimeInstance } from "temporal-zod";
import { z } from "zod";

import { toInstant } from "@repo/temporal";

import { CalendarEvent } from "../providers/interfaces";
import {
  createEventInputSchema,
  updateEventInputSchema,
} from "../schemas/events";
import { calendarProcedure, createTRPCRouter } from "../trpc";

export const eventsRouter = createTRPCRouter({
  list: calendarProcedure
    .input(
      z.object({
        calendarIds: z.array(z.string()).default([]),
        timeMin: zZonedDateTimeInstance,
        timeMax: zZonedDateTimeInstance,
        defaultTimeZone: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allEvents = await Promise.all(
        ctx.providers.map(async ({ client, account }) => {
          const calendars = await client.calendars();

          const requestedCalendars =
            input.calendarIds.length === 0
              ? calendars
              : calendars.filter((cal) => input.calendarIds.includes(cal.id));

          const providerEvents = await Promise.all(
            requestedCalendars.map(async (calendar) => {
              const events = await client.events(
                calendar,
                input.timeMin,
                input.timeMax,
                input.defaultTimeZone,
              );

              return events.map((event) => ({
                ...event,
                calendarId: calendar.id,
                providerId: account.providerId,
                accountId: account.accountId,
                color: calendar.color,
              }));
            }),
          );

          return providerEvents.flat();
        }),
      );

      const events: CalendarEvent[] = allEvents
        .flat()
        .map(
          (v) => [v, toInstant({ value: v.start, timeZone: "UTC" })] as const,
        )
        .sort(([, i1], [, i2]) => Temporal.Instant.compare(i1, i2))
        .map(([v]) => v);

      return { events };
    }),
  create: calendarProcedure
    .input(createEventInputSchema)
    .mutation(async ({ ctx, input }) => {
      const provider = ctx.providers.find(
        ({ account }) => account.accountId === input.accountId,
      );

      if (!provider?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for accountId: ${input.accountId}`,
        });
      }

      const calendars = await provider.client.calendars();

      const calendar = calendars.find((c) => c.id === input.calendarId);

      if (!calendar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar not found for accountId: ${input.calendarId}`,
        });
      }

      const event = await provider.client.createEvent(calendar, input);

      return { event };
    }),
  update: calendarProcedure
    .input(updateEventInputSchema)
    .mutation(async ({ ctx, input }) => {
      const provider = ctx.providers.find(
        ({ account }) => account.accountId === input.accountId,
      );

      if (!provider?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for accountId: ${input.accountId}`,
        });
      }

      const calendars = await provider.client.calendars();

      const calendar = calendars.find((c) => c.id === input.calendarId);

      if (!calendar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar not found for accountId: ${input.accountId}`,
        });
      }

      const event = await provider.client.updateEvent(
        calendar,
        input.id,
        input,
      );

      return { event };
    }),
  delete: calendarProcedure
    .input(
      z.object({
        accountId: z.string(),
        calendarId: z.string(),
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const provider = ctx.providers.find(
        ({ account }) => account.accountId === input.accountId,
      );

      if (!provider?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for accountId: ${input.accountId}`,
        });
      }

      await provider.client.deleteEvent(input.calendarId, input.eventId);

      return { success: true };
    }),
  respondToInvite: calendarProcedure
    .input(
      z.object({
        accountId: z.string(),
        calendarId: z.string(),
        eventId: z.string(),
        response: z.object({
          status: z.enum(["accepted", "tentative", "declined"]),
          comment: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const provider = ctx.providers.find(
        ({ account }) => account.accountId === input.accountId,
      );

      if (!provider?.client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Calendar client not found for accountId: ${input.accountId}`,
        });
      }

      await provider.client.responseToEvent(
        input.calendarId,
        input.eventId,
        input.response,
      );

      return { success: true };
    }),
});
