import { TRPCError } from "@trpc/server";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

import { accountToConferencingProvider } from "../providers";
import { calendarProcedure, createTRPCRouter } from "../trpc";

export const conferencingRouter = createTRPCRouter({
  create: calendarProcedure
    .input(
      z.object({
        calendarId: z.string(),
        eventId: z.string(),
        conferencingAccountId: z.string(),
        calendarAccountId: z.string(),
        providerId: z.enum(["google", "zoom", "none"]).default("none"),
        agenda: z.string().default("Meeting"),
        startTime: z.string(),
        endTime: z.string(),
        timeZone: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const provider = ctx.providers.find(
        ({ account }) => account.id === input.calendarAccountId,
      );

      if (!provider) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Provider not found",
        });
      }

      const { client } = provider;

      const calendar = (await client.calendars()).find(
        (c) => c.id === input.calendarId,
      );

      if (!calendar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Calendar not found",
        });
      }

      const conferencingAccount = ctx.accounts.find(
        (a) => a.providerId === "zoom",
      );

      if (!conferencingAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conferencing account not found",
        });
      }

      const conferencingProvider = accountToConferencingProvider(
        conferencingAccount,
        conferencingAccount.providerId as "google" | "zoom",
      );

      const conferenceData =
        input.providerId !== "none"
          ? await conferencingProvider.createConferencing(
              input.agenda,
              input.startTime,
              input.endTime,
              input.timeZone,
              input.calendarId,
              input.eventId,
            )
          : undefined;

      const startInstant = Temporal.Instant.from(input.startTime);
      const endInstant = Temporal.Instant.from(input.endTime);
      const tz = input.timeZone ?? calendar.timeZone ?? "UTC";

      const start = startInstant.toZonedDateTimeISO(tz);
      const end = endInstant.toZonedDateTimeISO(tz);

      const event = await client.updateEvent(calendar, input.eventId, {
        id: input.eventId,
        accountId: input.calendarAccountId,
        calendarId: input.calendarId,
        start,
        end,
        conferenceData,
      });

      return { conferenceData: event.conferenceData };
    }),
});
