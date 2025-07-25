"use client";

import { useEffect, useMemo, useRef } from "react";
import { useHotkeysContext } from "react-hotkeys-hook";

import {
  useCalendarSettings,
  useCalendarsVisibility,
  useViewPreferences,
} from "@/atoms";
import {
  CalendarHeader,
  EventGap,
  EventHeight,
  WeekCellsHeight,
} from "@/components/event-calendar";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { filterPastEvents } from "@/components/event-calendar/utils";
import { AgendaView } from "@/components/event-calendar/views/agenda-view";
import { DayView } from "@/components/event-calendar/views/day-view";
import { MonthView } from "@/components/event-calendar/views/month-view";
import { WeekView } from "@/components/event-calendar/views/week-view";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { cn } from "@/lib/utils";
import { useEdgeAutoScroll } from "./event-calendar/drag-and-drop/use-auto-scroll";
import { type EventCollectionItem } from "./event-calendar/hooks/event-collection";
import { useScrollToCurrentTime } from "./event-calendar/week-view/use-scroll-to-current-time";
import { CreateEventInput } from "./create-event-input";

interface CalendarContentProps {
  events: EventCollectionItem[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  dispatchAction: (action: Action) => void;
  headerRef: React.RefObject<HTMLDivElement | null>;
}

function CalendarContent({
  events,
  dispatchAction,
  scrollContainerRef,
  headerRef,
}: CalendarContentProps) {
  const { currentDate, view } = useCalendarState();

  const scrollToCurrentTime = useScrollToCurrentTime({ scrollContainerRef });

  useEffect(() => {
    scrollToCurrentTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (view) {
    case "month":
      return (
        <MonthView
          currentDate={currentDate}
          events={events}
          dispatchAction={dispatchAction}
        />
      );

    case "week":
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          dispatchAction={dispatchAction}
          headerRef={headerRef}
        />
      );

    case "day":
      return (
        <DayView
          currentDate={currentDate}
          events={events}
          dispatchAction={dispatchAction}
        />
      );

    case "agenda":
      return (
        <AgendaView
          currentDate={currentDate}
          events={events}
          dispatchAction={dispatchAction}
        />
      );

    default:
      // Fallback to week view for unknown view types
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          dispatchAction={dispatchAction}
          headerRef={headerRef}
        />
      );
  }
}

interface CalendarViewProps {
  className?: string;
  events: EventCollectionItem[];
  dispatchAction: (action: Action) => void;
}

export function CalendarView({
  className,
  events,
  dispatchAction,
}: CalendarViewProps) {
  const viewPreferences = useViewPreferences();
  const [calendarVisibility] = useCalendarsVisibility();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Enable edge auto scroll when dragging events
  useEdgeAutoScroll(scrollContainerRef, { active: true, headerRef });

  const { defaultTimeZone } = useCalendarSettings();
  const filteredEvents = useMemo(() => {
    // First filter past events
    const pastFiltered = filterPastEvents(
      events,
      viewPreferences.showPastEvents,
      defaultTimeZone,
    );

    // Then filter by calendar visibility - need to check the event.event.calendarId
    return pastFiltered.filter(
      (eventItem) =>
        !calendarVisibility.hiddenCalendars.includes(
          eventItem.event.calendarId,
        ),
    );
  }, [
    events,
    viewPreferences.showPastEvents,
    calendarVisibility.hiddenCalendars,
    defaultTimeZone,
  ]);

  const { enableScope } = useHotkeysContext();

  useEffect(() => {
    enableScope("calendar");
    enableScope("event");
  }, [enableScope]);

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-auto has-data-[slot=month-view]:flex-1",
        className,
      )}
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarHeader ref={headerRef} />

      <div
        className="scrollbar-hidden grow overflow-x-hidden overflow-y-auto"
        ref={scrollContainerRef}
      >
        <CalendarContent
          events={filteredEvents}
          dispatchAction={dispatchAction}
          scrollContainerRef={scrollContainerRef}
          headerRef={headerRef}
        />
      </div>
      
      <CreateEventInput />
      {/* <SignalView className="absolute bottom-8 left-1/2 -translate-x-1/2" /> */}
    </div>
  );
}
