import { TRPCError } from "@trpc/server";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

import { accountToConferencingProvider } from "../providers";
import { Conference } from "../providers/interfaces";
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
        ({ account }) => account.accountId === input.calendarAccountId,
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
        (a) => a.providerId === input.providerId,
      );

      if (!conferencingAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conferencing account not found",
        });
      }

      let conference: Conference | undefined = undefined;

      if (input.providerId !== "none" && conferencingAccount) {
        const conferencingProvider = accountToConferencingProvider(
          conferencingAccount,
          input.providerId as "google" | "zoom",
        );

        conference = await conferencingProvider.createConference(
          input.agenda,
          input.startTime,
          input.endTime,
          input.timeZone,
          input.calendarId,
          input.eventId,
        );
      }

      const startInstant = Temporal.Instant.from(input.startTime);
      const endInstant = Temporal.Instant.from(input.endTime);
      const tz = input.timeZone ?? calendar.timeZone ?? "UTC";

      const start = startInstant.toZonedDateTimeISO(tz);
      const end = endInstant.toZonedDateTimeISO(tz);

      const event = await client.updateEvent(calendar, input.eventId, {
        id: input.eventId,
        title: input.agenda,
        accountId: input.calendarAccountId,
        calendarId: input.calendarId,
        providerId: provider.account.providerId,
        readOnly: calendar.readOnly,
        start,
        end,
        conference,
      });

      return { conference: event.conference };
    }),
});
