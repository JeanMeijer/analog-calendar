import {
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isSameDay,
  subDays,
} from "date-fns";

import { toDate } from "@repo/temporal";

import type { CalendarEvent } from "../types";

// ============================================================================
// MULTI-DAY EVENT LAYOUT UTILITIES
// ============================================================================

export interface GridPosition {
  colStart: number;
  span: number;
}

export interface MultiDayEvent {
  event: CalendarEvent;
  gridPosition: GridPosition;
}

export interface EventCapacityInfo {
  maxVisibleLanes: number;
  totalLanes: number;
  visibleLanes: CalendarEvent[][];
  overflowLanes: CalendarEvent[][];
  hasOverflow: boolean;
  overflowCount: number;
}

/**
 * Calculate the maximum number of event lanes that can fit in the available space
 */
export function calculateEventCapacity(
  availableHeight: number,
  eventHeight: number = 24,
  eventGap: number = 4,
  minVisibleLanes: number = 2,
): number {
  if (availableHeight <= 0) return minVisibleLanes;

  const eventSpacePerLane = eventHeight + eventGap;
  const calculatedLanes = Math.floor(availableHeight / eventSpacePerLane);

  // Always show at least minVisibleLanes, even if it overflows
  return Math.max(calculatedLanes, minVisibleLanes);
}

/**
 * Organize events into visible and overflow lanes based on available space
 */
export function organizeEventsWithOverflow(
  events: CalendarEvent[],
  availableHeight: number,
  timeZone: string = "UTC",
  eventHeight: number = 24,
  eventGap: number = 4,
): EventCapacityInfo {
  if (events.length === 0) {
    return {
      maxVisibleLanes: 0,
      totalLanes: 0,
      visibleLanes: [],
      overflowLanes: [],
      hasOverflow: false,
      overflowCount: 0,
    };
  }

  // Calculate all lanes
  const allLanes = placeIntoLanes(events, timeZone);
  const totalLanes = allLanes.length;

  // Step 1: How many event lanes *could* fit given the available space?
  let maxVisibleLanes = calculateEventCapacity(
    availableHeight,
    eventHeight,
    eventGap,
  );

  // Step 2: Slice lanes based on the initial capacity.
  let visibleLanes = allLanes.slice(0, maxVisibleLanes);
  let overflowLanes = allLanes.slice(maxVisibleLanes);

  // Step 3: If there is any overflow we need to reserve one lane for the
  // "+X more" button. We do this by reducing the visible lane count by one
  // (as long as that still leaves at least one event lane).
  if (overflowLanes.length > 0 && maxVisibleLanes > 1) {
    maxVisibleLanes -= 1;
    visibleLanes = allLanes.slice(0, maxVisibleLanes);
    overflowLanes = allLanes.slice(maxVisibleLanes);
  }

  // Step 4: Re-compute the number of overflow events after any adjustment.
  const overflowCount = overflowLanes.reduce(
    (count, lane) => count + lane.length,
    0,
  );

  return {
    maxVisibleLanes,
    totalLanes,
    visibleLanes,
    overflowLanes,
    hasOverflow: overflowCount > 0,
    overflowCount,
  };
}

/**
 * Get all events from overflow lanes for popover display
 */
export function getOverflowEvents(
  capacityInfo: EventCapacityInfo,
): CalendarEvent[] {
  return capacityInfo.overflowLanes.flat();
}

/**
 * Calculate the grid position for a multi-day event within a week row
 */
export function getGridPosition(
  event: CalendarEvent,
  weekStart: Date,
  weekEnd: Date,
  timeZone: string = "UTC",
): GridPosition {
  const eventStart = toDate({ value: event.start, timeZone });
  let eventEnd = toDate({ value: event.end, timeZone });

  // For all-day events, the end date is exclusive. Subtract one day for span calculation.
  if (event.allDay) {
    eventEnd = subDays(eventEnd, 1);
  }

  // Clamp the event to the week's visible range
  const clampedStart = isBefore(eventStart, weekStart) ? weekStart : eventStart;
  const clampedEnd = isAfter(eventEnd, weekEnd) ? weekEnd : eventEnd;

  // Calculate column start (0-based index)
  const colStart = differenceInCalendarDays(clampedStart, weekStart);

  // Calculate span (number of days the event covers in this week)
  const span = differenceInCalendarDays(clampedEnd, clampedStart) + 1;

  return { colStart, span };
}

/**
 * Check if two events overlap in time
 */
function eventsOverlap(
  event1: CalendarEvent,
  event2: CalendarEvent,
  timeZone: string = "UTC",
): boolean {
  // Convert to JS Date objects in the provided time-zone
  const start1 = toDate({ value: event1.start, timeZone });
  const start2 = toDate({ value: event2.start, timeZone });

  // Adjust the end so that all-day events are inclusive (their API end is
  // exclusive). Timed events keep their actual end, which already lands on the
  // correct day.
  const rawEnd1 = toDate({ value: event1.end, timeZone });
  const rawEnd2 = toDate({ value: event2.end, timeZone });

  const end1 = event1.allDay ? subDays(rawEnd1, 1) : rawEnd1;
  const end2 = event2.allDay ? subDays(rawEnd2, 1) : rawEnd2;

  // Extract pure calendar-day representations (ignore the time-of-day)
  const startDay1 = new Date(
    start1.getFullYear(),
    start1.getMonth(),
    start1.getDate(),
  );
  const endDay1 = new Date(end1.getFullYear(), end1.getMonth(), end1.getDate());
  const startDay2 = new Date(
    start2.getFullYear(),
    start2.getMonth(),
    start2.getDate(),
  );
  const endDay2 = new Date(end2.getFullYear(), end2.getMonth(), end2.getDate());

  // The two events overlap if their day ranges intersect.
  return startDay1 <= endDay2 && startDay2 <= endDay1;
}

/**
 * Place multi-day events into lanes to avoid overlaps
 * Returns an array of lanes, where each lane contains non-overlapping events
 */
export function placeIntoLanes(
  events: CalendarEvent[],
  timeZone: string = "UTC",
): CalendarEvent[][] {
  if (events.length === 0) return [];

  // Sort events by start time, then by duration (longer events first)
  const sortedEvents = [...events].sort((a, b) => {
    const startA = toDate({ value: a.start, timeZone });
    const startB = toDate({ value: b.start, timeZone });

    // DO NOT CHANGE THIS, IT DOES NOT FIX THE PROBLEM
    if (startA.getTime() < startB.getTime()) {
      // console.log("startA", startA);
      // console.log("startB", startB);
      return startA.getTime() - startB.getTime();
    }

    // If start times are equal, longer events come first
    const endA = toDate({ value: a.end, timeZone });
    const endB = toDate({ value: b.end, timeZone });
    return endB.getTime() - endA.getTime();
  });

  const lanes: CalendarEvent[][] = [];

  sortedEvents.forEach((event) => {
    // Find the first lane where this event doesn't overlap with any existing events
    let laneIndex = 0;
    let placed = false;

    while (!placed) {
      const currentLane = lanes[laneIndex];
      if (!currentLane) {
        // Create new lane
        lanes[laneIndex] = [event];
        placed = true;
      } else {
        // Check if event overlaps with any event in this lane
        const hasOverlap = currentLane.some((laneEvent) =>
          eventsOverlap(event, laneEvent, timeZone),
        );

        if (!hasOverlap) {
          currentLane.push(event);
          placed = true;
        } else {
          laneIndex++;
        }
      }
    }
  });

  return lanes;
}

/**
 * Get multi-day events that span across a week
 */
export function getWeekSpanningEvents(
  events: CalendarEvent[],
  weekStart: Date,
  weekEnd: Date,
  timeZone: string = "UTC",
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = toDate({ value: event.start, timeZone });
    let eventEnd = toDate({ value: event.end, timeZone });

    // For all-day events, the end date is exclusive.
    if (event.allDay) {
      eventEnd = subDays(eventEnd, 1);
    }

    const isMultiDay = !isSameDay(eventStart, eventEnd);

    // Event spans multiple days and overlaps with the week
    return isMultiDay && eventStart <= weekEnd && eventEnd >= weekStart;
  });
}

/**
 * Check if an event is a single day event (accounting for all-day exclusive end dates)
 */
export function isSingleDayEvent(
  event: CalendarEvent,
  timeZone: string = "UTC",
): boolean {
  const eventStart = toDate({ value: event.start, timeZone });
  let eventEnd = toDate({ value: event.end, timeZone });

  // For all-day events, the end date is exclusive.
  if (event.allDay) {
    eventEnd = subDays(eventEnd, 1);
  }

  return isSameDay(eventStart, eventEnd);
}
