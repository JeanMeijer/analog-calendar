import "server-only";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@repo/auth/server";
import { db } from "@repo/db";

import { connectionToProvider } from "./providers";
import { getAllConnections } from "./utils/connection";

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
    const allConnections = await getAllConnections(ctx.user);

    const activeConnection = allConnections.find(
      (connection) => connection.id === ctx.user.defaultConnectionId,
    );

    if (!activeConnection) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No active connection set",
      });
    }

    const calendarClient = connectionToProvider(activeConnection);
    const allCalendarClients = allConnections.map((connection) => ({
      connection,
      client: connectionToProvider(connection),
    }));

    return next({
      ctx: {
        // Single provider access (for creating events, etc.)
        calendarClient,
        activeConnection,

        // Multiple provider access (for listing all calendars/events)
        allCalendarClients,
        allConnections,
      },
    });
  },
);
