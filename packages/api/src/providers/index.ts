import { account } from "@repo/db/schema";

import { GoogleCalendarProvider } from "./calendars/google-calendar";
import { MicrosoftCalendarProvider } from "./calendars/microsoft-calendar";
import { GoogleMeetProvider } from "./conferencing/google-meet";
import { ZoomProvider } from "./conferencing/zoom";
import type {
  CalendarProvider,
  ConferencingProvider,
  TaskProvider,
} from "./interfaces";
import { GoogleTasksProvider } from "./tasks/google-tasks";

const supportedProviders = {
  google: GoogleCalendarProvider,
  microsoft: MicrosoftCalendarProvider,
} as const;

const supportedConferencingProviders = {
  google: GoogleMeetProvider,
  zoom: ZoomProvider,
} as const;

const supportedTaskProviders = {
  google: GoogleTasksProvider,
} as const;

export { supportedTaskProviders };

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

const CALENDAR_PROVIDERS = ["google", "microsoft"];

export function isCalendarProvider(providerId: string) {
  return CALENDAR_PROVIDERS.includes(providerId);
}

export function accountToTasksProvider(
  activeAccount: typeof account.$inferSelect,
): TaskProvider {
  if (!activeAccount.accessToken || !activeAccount.refreshToken) {
    throw new Error("Invalid account");
  }

  const Provider =
    supportedTaskProviders[
      activeAccount.providerId as keyof typeof supportedTaskProviders
    ];

  if (!Provider) {
    throw new Error(
      `Task provider '${activeAccount.providerId}' is not supported`,
    );
  }

  return new Provider({ accessToken: activeAccount.accessToken });
}
