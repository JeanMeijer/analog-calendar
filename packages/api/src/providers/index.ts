import { account } from "@repo/db/schema";

import { GoogleMeetProvider, ZoomProvider } from "./conferencing";
import { GoogleCalendarProvider } from "./google-calendar";
import type { CalendarProvider, ConferencingProvider } from "./interfaces";
import { MicrosoftCalendarProvider } from "./microsoft-calendar";

const supportedProviders = {
  google: GoogleCalendarProvider,
  microsoft: MicrosoftCalendarProvider,
} as const;

const supportedConferencingProviders = {
  google: GoogleMeetProvider,
  zoom: ZoomProvider,
} as const;

export function accountToProvider(
  activeAccount: typeof account.$inferSelect,
): CalendarProvider {
  if (!activeAccount.accessToken || !activeAccount.refreshToken) {
    throw new Error("Invalid account");
  }

  const Provider =
    supportedProviders[
      activeAccount.providerId as keyof typeof supportedProviders
    ];

  if (!Provider) {
    throw new Error("Provider not supported");
  }

  return new Provider({
    accessToken: activeAccount.accessToken,
    accountId: activeAccount.accountId,
  });
}

export function accountToConferencingProvider(
  activeAccount: typeof account.$inferSelect,
  providerId: "google" | "zoom",
): ConferencingProvider {
  if (!activeAccount.accessToken || !activeAccount.refreshToken) {
    throw new Error("Invalid account");
  }

  const Provider = supportedConferencingProviders[providerId];

  if (!Provider) {
    throw new Error("Conferencing provider not supported");
  }

  return new Provider({
    accessToken: activeAccount.accessToken,
    accountId: activeAccount.accountId,
  });
}
