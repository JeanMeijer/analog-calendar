import { atomWithStorage } from "jotai/utils";

export interface CalendarSettings {
  locale: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  use12Hour: boolean;
  defaultTimeZone: string;
  defaultEventDuration: number;
}

export const calendarSettingsAtom = atomWithStorage<CalendarSettings>(
  "analog-calendar-settings",
  {
    locale: "en-GB",
    weekStartsOn: 1,
    use12Hour: false,
    defaultTimeZone: "Asia/Oral",
    defaultEventDuration: 60,
  },
);
