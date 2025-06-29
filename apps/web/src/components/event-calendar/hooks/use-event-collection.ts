import { useMemo } from "react";

import {
  calculateWeekViewEventPositions,
  getEventCollectionsForDays,
  type PositionedEvent,
} from "@/components/event-calendar/utils";
import { StartHour, WeekCellsHeight } from "../constants";
import type { CalendarEvent } from "../types";
import { getDayKey } from "../utils/date-time";

export type EventCollectionForMonth = {
  type: "month";
  eventsByDay: Map<
    string,
    {
      allDayEvents: CalendarEvent[];
      allEvents: CalendarEvent[];
      dayEvents: CalendarEvent[];
      spanningEvents: CalendarEvent[];
    }
  >;
};

export type EventCollectionForWeek = {
  type: "week";
  allDayEvents: CalendarEvent[];
  positionedEvents: PositionedEvent[][];
};

export function useEventCollection(
  events: CalendarEvent[],
  days: Date[],
  viewType: "month",
): EventCollectionForMonth;

export function useEventCollection(
  events: CalendarEvent[],
  days: Date[],
  viewType: "week",
): EventCollectionForWeek;

/**
 * Hook for processing and organizing events based on calendar view type
 *
 * @param events - Array of calendar events to process
 * @param days - Array of Date objects representing the visible days
 * @param viewType - Type of calendar view ("month" or "week")
 * @returns Processed event collections optimized for the specific view
 */
export function useEventCollection(
  events: CalendarEvent[],
  days: Date[],
  viewType: "month" | "week",
): EventCollectionForMonth | EventCollectionForWeek {
  return useMemo(() => {
    if (viewType === "month") {
      const eventsByDay = new Map<
        string,
        {
          allDayEvents: CalendarEvent[];
          allEvents: CalendarEvent[];
          dayEvents: CalendarEvent[];
          spanningEvents: CalendarEvent[];
        }
      >();

      for (const day of days) {
        const dayKey = getDayKey(day);
        const dayEvents = getEventCollectionsForDays(events, [day]);
        eventsByDay.set(dayKey, dayEvents);
      }

      return {
        type: "month" as const,
        eventsByDay,
      };
    } else {
      const allDayEvents = getEventCollectionsForDays(events, days);
      const positionedEvents = calculateWeekViewEventPositions(
        events,
        days,
        StartHour,
        WeekCellsHeight,
      );

      return {
        type: "week" as const,
        allDayEvents,
        positionedEvents,
      };
    }
  }, [events, days, viewType]);
}
