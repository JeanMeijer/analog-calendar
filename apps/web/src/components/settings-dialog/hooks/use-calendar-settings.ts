import { useAtom } from "jotai";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";

export function useCalendarSettings() {
  return useAtom(calendarSettingsAtom);
}
