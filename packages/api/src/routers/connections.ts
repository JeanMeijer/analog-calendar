import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { connection, user } from "@repo/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getActiveConnection, getAllConnections } from "../utils/connection";

export const connectionsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const connections = await getAllConnections(ctx.user);

    return {
      connections,
    };
  }),

  setDefault: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundConnection = await ctx.db.query.connection.findFirst({
        where: (table, { eq }) => eq(table.id, input.connectionId),
      });

      if (!foundConnection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Connection not found",
        });
      }

      await ctx.db
        .update(user)
        .set({ defaultConnectionId: input.connectionId })
        .where(eq(user.id, ctx.user.id));
    }),

  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const connection = await getActiveConnection(ctx.user);
    return { connection };
  }),

  delete: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(connection)
        .where(
          and(
            eq(connection.id, input.connectionId),
            eq(connection.userId, ctx.user.id),
          ),
        );

      const activeConnection = await getActiveConnection(ctx.user);
      if (activeConnection.id === input.connectionId) {
        await ctx.db
          .update(user)
          .set({ defaultConnectionId: null })
          .where(eq(user.id, ctx.user.id));
      }
    }),
});
