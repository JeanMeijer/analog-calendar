import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@repo/auth/server";
import { user } from "@repo/db/schema";

import {
  calendarProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";
import { getAccounts, getDefaultAccount } from "../utils/accounts";

export const accountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await getAccounts(ctx.user, ctx.headers);

    return {
      accounts: accounts.map((account) => ({
        id: account.id,
        accountId: account.accountId,
        providerId: account.providerId,
        name: account.name,
        email: account.email,
        image: account.image,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
    };
  }),
  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const account = await getDefaultAccount(ctx.user, ctx.headers);

    if (!account) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Account not found",
      });
    }

    return {
      account: {
        id: account.id,
        accountId: account.accountId,
        providerId: account.providerId,
        name: account.name,
        email: account.email,
        image: account.image,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    };
  }),
  unlink: calendarProcedure
    .input(
      z.object({
        id: z.string(),
        providerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const defaultAccount = await getDefaultAccount(ctx.user, ctx.headers);

      await auth.api.unlinkAccount({
        body: {
          accountId: input.id,
          providerId: input.providerId,
        },
        headers: ctx.headers,
      });

      if (defaultAccount.id !== input.id) {
        return;
      }

      const newDefaultAccount = await ctx.db.query.account.findFirst({
        where: (table, { eq }) => eq(table.userId, ctx.user.id),
      });

      const account = ctx.providers.find(
        (provider) => provider.account.id === newDefaultAccount?.id,
      );
      const calendars = await account?.client.calendars();
      const primaryCalendar = calendars?.find((calendar) => calendar.primary);

      await ctx.db
        .update(user)
        .set({
          defaultAccountId: newDefaultAccount?.id,
          defaultCalendarId: primaryCalendar?.id,
        })
        .where(eq(user.id, ctx.user.id));
    }),
});
