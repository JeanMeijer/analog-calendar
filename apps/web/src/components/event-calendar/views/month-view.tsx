"use client";

import * as React from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";

import {
  CalendarSettings,
  useCalendarSettings,
  useViewPreferences,
} from "@/atoms";
import {
  DraggableEvent,
  DroppableCell,
  type CalendarEvent,
} from "@/components/event-calendar";
import { DefaultStartHour } from "@/components/event-calendar/constants";
import {
  useEventCollection,
  useGridLayout,
  type EventCollectionForMonth,
} from "@/components/event-calendar/hooks";
import { useMultiDayOverflow } from "@/components/event-calendar/hooks/use-multi-day-overflow";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { OverflowIndicator } from "@/components/event-calendar/overflow-indicator";
import {
  getGridPosition,
  getWeekDays,
  isWeekend,
  isWeekendIndex,
  placeIntoLanes,
} from "@/components/event-calendar/utils";
import { cn, groupArrayIntoChunks } from "@/lib/utils";
import { createDraftEvent } from "@/lib/utils/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  dispatchAction: (action: Action) => void;
}

export function MonthView({
  currentDate,
  events,
  dispatchAction,
}: MonthViewProps) {
  const settings = useCalendarSettings();
  const { days, weeks } = React.useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const weeksResult = groupArrayIntoChunks(allDays, 7);

    return { days: allDays, weeks: weeksResult };
  }, [currentDate]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleEventClick = React.useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatchAction({ type: "select", event });
    },
    [dispatchAction],
  );

  const gridTemplateColumns = useGridLayout(getWeekDays(new Date()));
  const eventCollection = useEventCollection(events, days, "month");

  const rows = weeks.length;

  return (
    <div data-slot="month-view" className="contents min-w-0">
      <MonthViewHeader style={{ gridTemplateColumns }} />
      <div
        ref={containerRef}
        className="grid h-[calc(100%-37px)] min-w-0 flex-1 auto-rows-fr overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      >
        {weeks.map((week, weekIndex) => {
          return (
            <MonthViewWeek
              key={weekIndex}
              week={week}
              weekIndex={weekIndex}
              rows={rows}
              gridTemplateColumns={gridTemplateColumns}
              eventCollection={eventCollection}
              onEventClick={handleEventClick}
              dispatchAction={dispatchAction}
              settings={settings}
              containerRef={
                containerRef as React.RefObject<HTMLDivElement | null>
              }
              currentDate={currentDate}
            />
          );
        })}
      </div>
    </div>
  );
}

type MonthViewHeaderProps = React.ComponentProps<"div">;

function MonthViewHeader(props: MonthViewHeaderProps) {
  const viewPreferences = useViewPreferences();

  return (
    <div
      className="grid justify-items-stretch border-b border-border/70 transition-[grid-template-columns] duration-200 ease-linear"
      {...props}
    >
      {WEEKDAYS.map((day, index) => {
        const isDayVisible =
          viewPreferences.showWeekends || !isWeekendIndex(index);

        return (
          <div
            key={day}
            className={cn(
              "relative py-2 text-center text-sm text-muted-foreground/70",
              !isDayVisible && "w-0",
            )}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

interface MonthViewWeekItemProps {
  week: Date[];
  weekIndex: number;
  rows: number;
  gridTemplateColumns: string;
  eventCollection: EventCollectionForMonth;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  settings: CalendarSettings;
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentDate: Date;
}

function MonthViewWeek({
  week,
  weekIndex,
  rows,
  gridTemplateColumns,
  eventCollection,
  onEventClick,
  dispatchAction,
  settings,
  containerRef,
  currentDate,
}: MonthViewWeekItemProps) {
  const weekRef = React.useRef<HTMLDivElement>(null);
  const viewPreferences = useViewPreferences();
  const weekStart = week[0]!;
  const weekEnd = week[6]!;

  // Collect all events from the event collection - treat ALL events as multi-day
  const allEvents: CalendarEvent[] = [];
  eventCollection.eventsByDay.forEach((dayEvents) => {
    allEvents.push(...dayEvents.allEvents);
  });
  const uniqueEvents = allEvents.filter(
    (event, index, self) => index === self.findIndex((e) => e.id === event.id),
  );

  // Include ALL events in the multi-day lane, not just spanning events
  const weekEvents = uniqueEvents.filter((event) => {
    const eventStart = toDate({
      value: event.start,
      timeZone: settings.defaultTimeZone,
    });
    let eventEnd = toDate({
      value: event.end,
      timeZone: settings.defaultTimeZone,
    });

    // All-day events have an exclusive end; subtract one day so the final day is included
    if (event.allDay) {
      eventEnd = subDays(eventEnd, 1);
    }

    // Check if event is within the week range
    const isInWeek =
      (eventStart >= weekStart && eventStart <= weekEnd) ||
      (eventEnd >= weekStart && eventEnd <= weekEnd) ||
      (eventStart < weekStart && eventEnd > weekEnd);

    if (!isInWeek) {
      return false;
    }

    // If weekends are hidden, exclude events that only occur on weekends
    if (!viewPreferences.showWeekends) {
      // Get all days that this event spans within the week
      const eventDays = eachDayOfInterval({
        start: eventStart < weekStart ? weekStart : eventStart,
        end: eventEnd > weekEnd ? weekEnd : eventEnd,
      });

      // Check if event has at least one day that's not a weekend
      const hasNonWeekendDay = eventDays.some((day) => !isWeekend(day));

      if (!hasNonWeekendDay) {
        return false;
      }
    }

    return true;
  });

  // Use overflow hook to manage event display
  const overflow = useMultiDayOverflow({
    events: weekEvents,
    timeZone: settings.defaultTimeZone,
  });

  // Calculate how many lanes multi-day events occupy for this week
  const multiDayLaneCount = React.useMemo(() => {
    if (weekEvents.length === 0) return 0;
    const lanes = placeIntoLanes(weekEvents, settings.defaultTimeZone);
    return lanes.length;
  }, [weekEvents, settings.defaultTimeZone]);

  return (
    <div
      key={`week-${weekIndex}`}
      ref={weekRef}
      className="relative grid min-w-0 transition-[grid-template-columns] duration-200 ease-linear [&:last-child>*]:border-b-0"
      style={{ gridTemplateColumns }}
    >
      {/* 1. Day cells */}
      {week.map((day, dayIndex) => (
        <MonthViewDay
          key={day.toString()}
          day={day}
          rows={rows}
          weekIndex={weekIndex}
          dayIndex={dayIndex}
          multiDayLaneCount={multiDayLaneCount}
          overflow={overflow}
          dispatchAction={dispatchAction}
          currentDate={currentDate}
        />
      ))}

      {/* 2. Multi-day event overlay */}
      <div
        // ref={overflow.containerRef}
        className="pointer-events-none absolute inset-x-0 top-7.5 bottom-0 grid min-w-0 auto-rows-max"
        style={{ gridTemplateColumns }}
      >
        {/* Render only visible events */}
        {overflow.capacityInfo.visibleLanes.map((lane, y) =>
          lane.map((evt) => {
            return (
              <PositionedEvent
                rows={rows}
                key={evt.id}
                y={y}
                evt={evt}
                weekStart={weekStart}
                weekEnd={weekEnd}
                settings={settings}
                onEventClick={onEventClick}
                dispatchAction={dispatchAction}
                containerRef={containerRef}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

interface MonthViewDayProps {
  day: Date;
  rows: number;
  weekIndex: number;
  dayIndex: number;
  multiDayLaneCount: number;
  overflow: ReturnType<typeof useMultiDayOverflow>;
  dispatchAction: (action: Action) => void;
  currentDate: Date;
}

function MonthViewDay({
  day,
  overflow,
  dispatchAction,
  currentDate,
}: MonthViewDayProps) {
  const viewPreferences = useViewPreferences();
  const settings = useCalendarSettings();

  const handleDayClick = React.useCallback(() => {
    const start = Temporal.ZonedDateTime.from({
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      day: day.getDate(),
      hour: DefaultStartHour,
      minute: 0,
      timeZone: settings.defaultTimeZone,
    });

    const end = start.add({ days: 1 });

    dispatchAction({ type: "draft", event: createDraftEvent({ start, end }) });
  }, [day, dispatchAction, settings.defaultTimeZone]);

  if (!day) return null;

  const isCurrentMonth = isSameMonth(day, currentDate);
  const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
  // const isReferenceCell = weekIndex === 0 && dayIndex === 0;
  const cellId = `month-cell-${day.toISOString()}`;

  // Filter overflow events to only show those that start on this day
  const dayOverflowEvents = overflow.overflowEvents.filter((event) => {
    const eventStart = toDate({
      value: event.start,
      timeZone: settings.defaultTimeZone,
    });
    return isSameDay(eventStart, day);
  });

  const hasOverflowForDay = dayOverflowEvents.length > 0;

  return (
    <div
      className={cn(
        "group relative min-w-0 border-r border-b border-border/70 last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70",
        !isDayVisible && "w-0",
      )}
      data-today={isToday(day) || undefined}
      data-outside-cell={!isCurrentMonth || undefined}
      style={{
        visibility: isDayVisible ? "visible" : "hidden",
      }}
    >
      <DroppableCell
        id={cellId}
        date={day}
        onClick={handleDayClick}
        className="flex justify-between"
      >
        <div className="relative mt-1 ml-0.5 inline-flex size-6 items-center justify-center rounded-full text-sm group-data-today:bg-primary group-data-today:text-primary-foreground">
          {format(day, "d")}
        </div>

        <div
          className="flex grow flex-col justify-end place-self-stretch"
          ref={overflow.containerRef}
        ></div>

        {/* Show overflow indicator for this day if there are overflow events that start on this day */}
        {hasOverflowForDay && (
          <div className="pointer-events-auto z-10 flex flex-col items-center place-self-stretch pb-1">
            <OverflowIndicator
              count={dayOverflowEvents.length}
              events={dayOverflowEvents}
              date={day}
              dispatchAction={dispatchAction}
              className=""
            />
          </div>
        )}
      </DroppableCell>
    </div>
  );
}

interface PositionedEventProps {
  y: number;
  evt: CalendarEvent;
  weekStart: Date;
  weekEnd: Date;
  settings: CalendarSettings;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  rows: number;
}
function PositionedEvent({
  y,
  evt,
  weekStart,
  weekEnd,
  settings,
  onEventClick,
  dispatchAction,
  containerRef,
  rows,
}: PositionedEventProps) {
  const { colStart, span } = getGridPosition(
    evt,
    weekStart,
    weekEnd,
    settings.defaultTimeZone,
  );

  // Calculate actual first/last day based on event dates
  const eventStart = toDate({
    value: evt.start,
    timeZone: settings.defaultTimeZone,
  });
  let eventEnd = toDate({ value: evt.end, timeZone: settings.defaultTimeZone });
  if (evt.allDay) {
    eventEnd = subDays(eventEnd, 1);
  }

  // For single-day events, ensure they are properly marked as first and last day
  const isFirstDay = eventStart >= weekStart;
  const isLastDay = eventEnd <= weekEnd;

  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div
      key={evt.id}
      className="pointer-events-auto my-[1px] min-w-0"
      style={{
        gridColumn: `${colStart + 1} / span ${span}`,
        gridRow: y + 1,
        position: isDragging ? "relative" : "static",
        zIndex: isDragging ? 99999 : "auto",
      }}
    >
      <DraggableEvent
        event={evt}
        view="month"
        containerRef={containerRef}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={(e) => onEventClick(evt, e)}
        dispatchAction={dispatchAction}
        setIsDragging={setIsDragging}
        zIndex={isDragging ? 99999 : undefined}
        rows={rows}
      />
    </div>
  );
}
