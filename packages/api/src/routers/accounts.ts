import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@repo/auth/server";
import { account as accountTable, user } from "@repo/db/schema";

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
        signInEnabled: account.signInEnabled,
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
        signInEnabled: account.signInEnabled,
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
      const signInAccounts = await ctx.db.query.account.findMany({
        where: (table, { and, eq }) =>
          and(eq(table.userId, ctx.user.id), eq(table.signInEnabled, true)),
      });

      if (signInAccounts.length === 1 && signInAccounts[0]?.id === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "At least one account must allow sign in",
        });
      }

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
  enableSignIn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const found = await ctx.db.query.account.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.id, input.id), eq(table.userId, ctx.user.id)),
      });

      if (!found) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      }

      if (!["google", "microsoft"].includes(found.providerId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provider not supported for sign in",
        });
      }

      await ctx.db
        .update(accountTable)
        .set({ signInEnabled: true })
        .where(eq(accountTable.id, input.id));

      return { success: true };
    }),
  disableSignIn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.query.account.findFirst({
        where: (table, { and, eq }) =>
          and(eq(table.id, input.id), eq(table.userId, ctx.user.id)),
      });

      if (!account) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      }

      const signInAccounts = await ctx.db.query.account.findMany({
        where: (table, { and, eq }) =>
          and(eq(table.userId, ctx.user.id), eq(table.signInEnabled, true)),
      });

      if (signInAccounts.length === 1 && signInAccounts[0].id === account.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "At least one account must allow sign in",
        });
      }

      await ctx.db
        .update(accountTable)
        .set({ signInEnabled: false })
        .where(eq(accountTable.id, input.id));

      return { success: true };
    }),
});
