import { atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CalendarView } from "@/components/event-calendar";

export interface ViewPreferences {
  showWeekends: boolean;
  showPastEvents: boolean;
  showDeclinedEvents: boolean;
  showWeekNumbers: boolean;
}

export const viewPreferencesAtom = atomWithStorage<ViewPreferences>(
  "analog-view-preferences",
  {
    showWeekends: true,
    showPastEvents: true,
    showDeclinedEvents: false,
    showWeekNumbers: false,
  },
);

// Store the calendar view preference persistently
export const calendarViewAtom = atomWithStorage<CalendarView>(
  "analog-calendar-view",
  "week",
);

// Store the current date in memory (non-persistent)
export const currentDateAtom = atom<Date>(new Date());

export function useViewPreferences() {
  return useAtomValue(viewPreferencesAtom);
}
