import "server-only";
import {
  betterAuth,
  type Account,
  type GenericEndpointContext,
} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { db } from "@repo/db";
import { connection, user } from "@repo/db/schema";
import { env } from "@repo/env/server";

import { createdProvider } from "./providers";
import { GOOGLE_OAUTH_SCOPES } from "./providers/google";
import { MICROSOFT_OAUTH_SCOPES } from "./providers/microsoft";

const connectionHandlerHook = async (
  account: Account,
  // ctx?: GenericEndpointContext,
) => {
  if (!account.accessToken || !account.refreshToken) {
    throw new APIError("UNAUTHORIZED", {
      message: "Missing access or refresh token",
    });
  }

  const provider = createdProvider(
    account.providerId as "google" | "microsoft",
    {
      auth: {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        userId: account.userId,
        email: "",
      },
    },
  );

  const userInfo = await provider.getUserInfo().catch((error) => {
    console.error(
      `Failed to get user info for provider ${account.providerId}:`,
      error,
    );
    throw new APIError("UNAUTHORIZED", {
      message: "Failed to get user info - token may be invalid",
    });
  });

  if (!userInfo?.email) {
    throw new APIError("BAD_REQUEST", {
      message: "Missing email in user info",
    });
  }

  const updatingInfo = {
    name: userInfo.name ?? "Unknown",
    image: userInfo.image ?? "",
    accessToken: account.accessToken,
    refreshToken: account.refreshToken,
    scope: provider.getScope(),
    expiresAt: new Date(
      Date.now() + (account.accessTokenExpiresAt?.getTime() ?? 3600000),
    ),
  };

  await db.transaction(async (tx) => {
    const [_connection] = await tx
      .insert(connection)
      .values({
        providerId: account.providerId as "google" | "microsoft",
        email: userInfo.email,
        userId: account.userId,
        accountId: account.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updatingInfo,
      })
      .onConflictDoUpdate({
        target: [connection.email, connection.userId, connection.providerId],
        set: {
          ...updatingInfo,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!_connection) {
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create connection",
      });
    }

    await tx
      .update(user)
      .set({
        defaultConnectionId: _connection.id,
      })
      .where(eq(user.id, account.userId));
  });
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      allowDifferentEmails: true,
      trustedProviders: ["google", "microsoft"],
    },
  },
  user: {
    additionalFields: {
      defaultConnectionId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    account: {
      create: {
        after: connectionHandlerHook,
      },
      update: {
        after: connectionHandlerHook,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      scope: GOOGLE_OAUTH_SCOPES,
      accessType: "offline",
      prompt: "consent",
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
      scope: MICROSOFT_OAUTH_SCOPES,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
