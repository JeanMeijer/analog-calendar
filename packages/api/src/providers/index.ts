import { connection } from "@repo/db/schema";

import { GoogleCalendarProvider } from "./google-calendar";
import { MicrosoftCalendarProvider } from "./microsoft-calendar";
import type { CalendarProvider } from "./types";

const supportedProviders = {
  google: GoogleCalendarProvider,
  microsoft: MicrosoftCalendarProvider,
} as const;

export function connectionToProvider(
  activeConnection: typeof connection.$inferSelect,
): CalendarProvider {
  if (!activeConnection.accessToken || !activeConnection.refreshToken) {
    throw new Error("Invalid connection");
  }

  const Provider = supportedProviders[activeConnection.providerId];

  if (!Provider) {
    throw new Error("Provider not supported");
  }

  return new Provider({ accessToken: activeConnection.accessToken });
}
