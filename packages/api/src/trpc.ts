import "server-only";

import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import { auth } from "@repo/auth/server";
import { db } from "@repo/db";

import { accountToProvider, isCalendarProvider } from "./providers";
import { getAccounts } from "./utils/accounts";
import { superjson } from "./utils/superjson";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session: session?.session,
    user: session?.user,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  });
});

export const calendarProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    try {
      const accounts = await getAccounts(ctx.user, ctx.headers);

      const providers = accounts
        .filter((provider) => isCalendarProvider(provider.providerId))
        .map((account) => ({
          account: {
            ...account,
            providerId: account.providerId as "google" | "microsoft",
          },
          client: accountToProvider(account),
        }));

      return next({
        ctx: {
          ...ctx,
          providers,
          accounts,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);
