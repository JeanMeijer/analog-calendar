import * as React from "react";

import { EventGap, EventHeight } from "../constants";
import type { CalendarEvent } from "../types";
import {
  getOverflowEvents,
  organizeEventsWithOverflow,
  type EventCapacityInfo,
} from "../utils/multi-day-layout";

interface UseMultiDayOverflowOptions {
  events: CalendarEvent[];
  timeZone?: string;
  eventHeight?: number;
  eventGap?: number;
  minVisibleLanes?: number;
}

interface UseMultiDayOverflowResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  availableHeight: number;
  capacityInfo: EventCapacityInfo;
  visibleEvents: CalendarEvent[];
  overflowEvents: CalendarEvent[];
  hasOverflow: boolean;
  overflowCount: number;
}

export function useMultiDayOverflow({
  events,
  timeZone = "UTC",
  eventHeight = EventHeight,
  eventGap = EventGap,
  minVisibleLanes,
}: UseMultiDayOverflowOptions): UseMultiDayOverflowResult {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const [availableHeight, setAvailableHeight] = React.useState<number>(0);

  // Measure available height
  const measureHeight = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    setAvailableHeight(rect.height);
  }, []);

  // Set up ResizeObserver to track container height changes
  React.useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    measureHeight();

    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(() => {
        measureHeight();
      });
    }

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [measureHeight]);

  // Calculate capacity and organize events
  const capacityInfo = organizeEventsWithOverflow(
    events,
    minVisibleLanes
      ? Math.max(minVisibleLanes * (eventHeight + eventGap), availableHeight)
      : availableHeight,
    timeZone,
    eventHeight,
    eventGap,
  );

  // Get visible and overflow events
  const visibleEvents = capacityInfo.visibleLanes.flat();
  const overflowEvents = getOverflowEvents(capacityInfo);

  return {
    containerRef,
    availableHeight,
    capacityInfo,
    visibleEvents,
    overflowEvents,
    hasOverflow: capacityInfo.hasOverflow,
    overflowCount: capacityInfo.overflowCount,
  };
}
