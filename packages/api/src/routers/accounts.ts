import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@repo/auth/server";
import { user } from "@repo/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAccounts, getActiveAccount } from "../utils/accounts";

export const accountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await getAccounts(ctx.user, ctx.headers);

    return {
      accounts: accounts.map((account) => ({
        id: account.id,
        providerId: account.providerId,
        name: account.name,
        email: account.email,
        image: account.image,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
    };
  }),
  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundAccount = await ctx.db.query.account.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });

      if (!foundAccount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      }

      await ctx.db
        .update(user)
        .set({ defaultAccountId: input.id })
        .where(eq(user.id, ctx.user.id));
    }),
  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const account = await getActiveAccount(ctx.user, ctx.headers);

    return {
      account: {
        id: account.id,
        providerId: account.providerId,
        name: account.name,
        email: account.email,
        image: account.image,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    };
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        providerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await auth.api.unlinkAccount({
        body: {
          accountId: input.id,
          providerId: input.providerId,
        },
        headers: ctx.headers,
      });

      const activeAccount = await getActiveAccount(ctx.user, ctx.headers);

      if (activeAccount.id === input.id) {
        await ctx.db
          .update(user)
          .set({ defaultAccountId: null })
          .where(eq(user.id, ctx.user.id));
      }
    }),
});
