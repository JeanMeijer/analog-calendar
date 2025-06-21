import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface CalendarSettings {
  locale: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  use12Hour: boolean;
  defaultTimeZone: string;
  defaultCalendar: {
    calendarId: string;
    accountId: string;
    providerId: "google" | "microsoft";
    timeZone: string;
  };
  defaultEventDuration: number;
}

export const calendarSettingsAtom = atomWithStorage<CalendarSettings>(
  "analog-calendar-settings",
  {
    locale: "en-GB",
    weekStartsOn: 1,
    use12Hour: false,
    defaultTimeZone: "Europe/Amsterdam",
    defaultCalendar: {
      calendarId: "primary",
      accountId: "",
      providerId: "google",
      timeZone: "Europe/Amsterdam",
    },
    defaultEventDuration: 60,
  },
);

export function useCalendarSettings() {
  return useAtomValue(calendarSettingsAtom);
}
