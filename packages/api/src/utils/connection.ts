import "server-only";
import { cache } from "react";

import { auth, type Session } from "@repo/auth/server";
import { db } from "@repo/db";

export const getActiveConnection = cache(async (user: Session["user"]) => {
  if (user?.defaultConnectionId) {
    const activeConnection = await db.query.connection.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.userId, user.id),
          eq(table.id, user.defaultConnectionId as string),
        ),
    });

    if (activeConnection) {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: activeConnection?.providerId,
          accountId: activeConnection?.accountId,
          userId: activeConnection?.userId,
        },
      });

      return {
        ...activeConnection,
        accessToken: accessToken ?? activeConnection.accessToken,
      };
    }
  }

  const firstConnection = await db.query.connection.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  if (!firstConnection) {
    throw new Error("No connection found");
  }

  return firstConnection;
});

export const getAllConnections = cache(async (user: Session["user"]) => {
  const _connections = await db.query.connection.findMany({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  const connections = await Promise.all(
    _connections.map(async (connection) => {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: connection.providerId,
          accountId: connection.accountId,
          userId: connection.userId,
        },
      });

      return {
        ...connection,
        accessToken: accessToken ?? connection.accessToken,
      };
    }),
  );

  return connections.filter(
    (connection) => connection.accessToken && connection.refreshToken,
  );
});
