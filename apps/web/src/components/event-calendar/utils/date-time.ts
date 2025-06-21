/**
 * Date and Time Utilities
 *
 * This file contains utility functions for:
 * - Date navigation (previous/next periods based on calendar view)
 * - Date/time manipulation
 * - Weekend detection and filtering
 * - Miscellaneous helpers
 */

import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

import {
  AgendaDaysToShow,
  CALENDAR_CONFIG,
  TIME_INTERVALS,
} from "../constants";
import { CalendarView } from "../types";

/**
 * Generate a simple date key for Map lookups
 * Uses the day's timestamp at start of day for uniqueness
 */
export function getDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export function snapTimeToInterval(time: Date): Date {
  const snappedTime = new Date(time);
  const minutes = snappedTime.getMinutes();
  const remainder = minutes % TIME_INTERVALS.SNAP_TO_MINUTES;

  if (remainder !== 0) {
    if (remainder < TIME_INTERVALS.SNAP_THRESHOLD) {
      snappedTime.setMinutes(minutes - remainder);
    } else {
      snappedTime.setMinutes(
        minutes + (TIME_INTERVALS.SNAP_TO_MINUTES - remainder),
      );
    }
    snappedTime.setSeconds(0);
    snappedTime.setMilliseconds(0);
  }

  return snappedTime;
}

export function navigateToPrevious(
  currentDate: Date,
  view: CalendarView,
): Date {
  switch (view) {
    case "month":
      return subMonths(currentDate, 1);
    case "week":
      return subWeeks(currentDate, 1);
    case "day":
      return addDays(currentDate, -1);
    case "agenda":
      return addDays(currentDate, -AgendaDaysToShow);
    default:
      return currentDate;
  }
}

export function navigateToNext(currentDate: Date, view: CalendarView): Date {
  switch (view) {
    case "month":
      return addMonths(currentDate, 1);
    case "week":
      return addWeeks(currentDate, 1);
    case "day":
      return addDays(currentDate, 1);
    case "agenda":
      return addDays(currentDate, AgendaDaysToShow);
    default:
      return currentDate;
  }
}

export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function getMonthTitle(date: Date) {
  return {
    full: format(date, "MMMM yyyy"),
    medium: "",
    short: format(date, "MMM yyyy"),
  };
}

export function getWeekTitle(date: Date) {
  const start = startOfWeek(date, {
    weekStartsOn: CALENDAR_CONFIG.WEEK_STARTS_ON,
  });
  const end = endOfWeek(date, { weekStartsOn: CALENDAR_CONFIG.WEEK_STARTS_ON });

  if (isSameMonth(start, end)) {
    return getMonthTitle(start);
  }

  return {
    full: `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`,
    medium: "",
    short: `${format(start, "MMM")} - ${format(end, "MMM")}`,
  };
}

export function getDayTitle(date: Date) {
  return {
    full: format(date, "EEE MMMM d, yyyy"),
    medium: format(date, "MMMM d, yyyy"),
    short: format(date, "MMM d, yyyy"),
  };
}

export function getAgendaTitle(date: Date) {
  const start = date;
  const end = addDays(date, AgendaDaysToShow - 1);

  if (isSameMonth(start, end)) {
    return getMonthTitle(start);
  }

  return {
    full: `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`,
    medium: "",
    short: `${format(start, "MMM")} - ${format(end, "MMM")}`,
  };
}

export function getViewTitleData(currentDate: Date, view: CalendarView) {
  switch (view) {
    case "month":
      return getMonthTitle(currentDate);
    case "week":
      return getWeekTitle(currentDate);
    case "day":
      return getDayTitle(currentDate);
    case "agenda":
      return getAgendaTitle(currentDate);
    default:
      return getMonthTitle(currentDate);
  }
}

export function isWeekend(date: Date): boolean {
  const day = getDay(date);
  return day === 0 || day === 6;
}

export function filterWeekdays(dates: Date[]): Date[] {
  return dates.filter((date) => !isWeekend(date));
}

export function isWeekendIndex(dayIndex: number): boolean {
  return dayIndex === 0 || dayIndex === 6;
}

export function getWeekDays(currentDate: Date): Date[] {
  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: CALENDAR_CONFIG.WEEK_STARTS_ON,
  });
  const weekEnd = endOfWeek(currentDate, {
    weekStartsOn: CALENDAR_CONFIG.WEEK_STARTS_ON,
  });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

export function filterDaysByWeekendPreference(
  days: Date[],
  showWeekends: boolean,
): Date[] {
  return showWeekends ? days : days.filter((day) => !isWeekend(day));
}
