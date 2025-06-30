import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { and, eq } from "drizzle-orm";

import { db } from "@repo/db";
import { account, user } from "@repo/db/schema";
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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      trustedProviders: ["google", "microsoft"],
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

          await db.transaction(async (tx) => {
            const existing = await tx.query.account.findFirst({
              where: (table, { and, eq }) =>
                and(
                  eq(table.userId, _account.userId),
                  eq(table.signInEnabled, true),
                ),
            });

            await tx
              .update(account)
              .set({
                name: info.user.name,
                email: info.user.email ?? undefined,
                image: info.user.image,
                signInEnabled: existing ? false : true,
              })
              .where(eq(account.id, _account.id));

            await tx
              .update(user)
              .set({
                defaultAccountId: _account.id,
              })
              .where(eq(user.id, _account.userId));
          });
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
  },
});

export type Session = typeof auth.$Infer.Session;
