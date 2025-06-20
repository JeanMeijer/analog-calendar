import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { db } from "@repo/db";
import { account, connectedAccount, user } from "@repo/db/schema";
import { env } from "@repo/env/server";

export const MICROSOFT_OAUTH_SCOPES = [
  "https://graph.microsoft.com/User.Read",
  "https://graph.microsoft.com/Calendars.Read",
  "https://graph.microsoft.com/Calendars.Read.Shared",
  "https://graph.microsoft.com/Calendars.ReadBasic",
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "https://graph.microsoft.com/Calendars.ReadWrite.Shared",
  "offline_access",
];

export const GOOGLE_OAUTH_SCOPES = [
  "email",
  "profile",
  "openid",
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar",
];

export const ZOOM_OAUTH_SCOPES = [
  "user:read:admin",
  "user:read",
  "calendar:read",
  "calendar:write",
  "meeting:read",
  "meeting:write",
  "offline_access",
];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      trustedProviders: ["google", "microsoft", "zoom"],
    },
  },
  user: {
    additionalFields: {
      defaultAccountId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    account: {
      // we are using the after hook because better-auth does not
      // pass additional fields before account creation
      create: {
        after: async (_account, ctx) => {
          if (!_account.accessToken || !_account.refreshToken) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Access token or refresh token is not set",
            });
          }

          const loginProviders = ["google", "microsoft"];
          const connectionProviders = ["zoom"];

          const providerId = _account.providerId;

          const provider = ctx?.context.socialProviders.find(
            (p) => p.id === _account.providerId,
          );

          if (!provider) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: `Provider account provider is ${_account.providerId} but it is not configured`,
            });
          }

          const info = await provider.getUserInfo({
            accessToken: _account.accessToken,
            refreshToken: _account.refreshToken,
            scopes: _account.scope?.split(",") ?? [],
            idToken: _account.idToken ?? undefined,
          });

          if (!info?.user) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "User info is not available",
            });
          }

          if (loginProviders.includes(providerId)) {
            await db.transaction(async (tx) => {
              await tx
                .update(account)
                .set({
                  name: info.user.name,
                  email: info.user.email ?? undefined,
                  image: info.user.image,
                })
                .where(eq(account.id, _account.id));

              await tx
                .update(user)
                .set({
                  defaultAccountId: _account.id,
                })
                .where(eq(user.id, _account.userId));
            });

            return;
          }

          if (connectionProviders.includes(providerId)) {
            await db.transaction(async (tx) => {
              await tx.insert(connectedAccount).values({
                id: _account.id,
                providerId: providerId as "zoom",
                providerAccountId: info.user.id,
                userId: _account.userId,
                accessToken: _account.accessToken,
                refreshToken: _account.refreshToken,
                accessTokenExpiresAt: _account.accessTokenExpiresAt,
                refreshTokenExpiresAt: _account.refreshTokenExpiresAt,
                scope: _account.scope,
                name: info.user.name ?? "",
                email: info.user.email ?? "",
                image: info.user.image,
                createdAt: new Date(),
                updatedAt: new Date(),
              });

              await tx.delete(account).where(eq(account.id, _account.id));
            });
          }
        },
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
      overrideUserInfoOnSignIn: true,
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
      scope: MICROSOFT_OAUTH_SCOPES,
      overrideUserInfoOnSignIn: true,
    },
    zoom: {
      clientId: process.env.ZOOM_CLIENT_ID!,
      clientSecret: process.env.ZOOM_CLIENT_SECRET!,
      scope: ZOOM_OAUTH_SCOPES,
      overrideUserInfoOnSignIn: true,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
