import { eq } from "drizzle-orm";
import { z } from "zod";

import { user } from "@repo/db/schema";

import {
  calendarProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

export const calendarsRouter = createTRPCRouter({
  list: calendarProcedure.query(async ({ ctx }) => {
    const promises = ctx.providers.map(async ({ client, account }) => {
      const calendars = await client.calendars();

      return {
        id: account.id,
        providerId: account.providerId,
        name: account.email,
        calendars,
      };
    });

    const accounts = await Promise.all(promises);

    return {
      accounts,
    };
  }),

  getDefaultId: protectedProcedure.query(async ({ ctx }) => {
    // We would need to remove this later probably
    // Because we can just get the default calendar from the better auth session

    const foundUser = await ctx.db.query.user.findFirst({
      where: (table, { eq }) => eq(table.id, ctx.user.id),
    });

    return {
      defaultCalendarId: foundUser?.defaultCalendarId ?? null,
    };
  }),

  setDefaultId: protectedProcedure
    .input(
      z.object({
        calendarId: z.string(),
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          defaultCalendarId: input.calendarId,
          defaultAccountId: input.accountId,
        })
        .where(eq(user.id, ctx.user.id));
    }),
});
