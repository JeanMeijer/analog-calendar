"use client";

import { useHotkeys } from "react-hotkeys-hook";

import {
  navigateToNext,
  navigateToPrevious,
} from "@/components/event-calendar/utils/date-time";
import { useCalendarState } from "@/hooks/use-calendar-state";

export const KEYBOARD_SHORTCUTS = {
  MONTH: "m",
  WEEK: "w",
  DAY: "d",
  AGENDA: "a",
  NEXT_PERIOD: "n",
  PREVIOUS_PERIOD: "p",
  TODAY: "t",
} as const;

export function CalendarHotkeys() {
  const { view, setView, setCurrentDate } = useCalendarState();

  useHotkeys(KEYBOARD_SHORTCUTS.MONTH, () => setView("month"), {
    scopes: ["calendar"],
  });
  useHotkeys(KEYBOARD_SHORTCUTS.WEEK, () => setView("week"), {
    scopes: ["calendar"],
  });
  useHotkeys(KEYBOARD_SHORTCUTS.DAY, () => setView("day"), {
    scopes: ["calendar"],
  });
  useHotkeys(KEYBOARD_SHORTCUTS.AGENDA, () => setView("agenda"), {
    scopes: ["calendar"],
  });
  useHotkeys(KEYBOARD_SHORTCUTS.TODAY, () => setCurrentDate(new Date()), {
    scopes: ["calendar"],
  });

  useHotkeys(
    KEYBOARD_SHORTCUTS.NEXT_PERIOD,
    () => setCurrentDate((prevDate: Date) => navigateToNext(prevDate, view)),
    { scopes: ["calendar"] },
  );

  useHotkeys(
    KEYBOARD_SHORTCUTS.PREVIOUS_PERIOD,
    () =>
      setCurrentDate((prevDate: Date) => navigateToPrevious(prevDate, view)),
    { scopes: ["calendar"] },
  );

  return null;
}
