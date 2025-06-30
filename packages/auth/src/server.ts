import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@repo/db";
import type { account } from "@repo/db/schema";
import { env } from "@repo/env/server";

import { createProviderHandler } from "./utils/account-linking";

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
        after: createProviderHandler,
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
export type User = Session["user"];
export type Account = typeof account.$inferSelect;
