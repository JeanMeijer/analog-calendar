"use client";

import * as React from "react";
import {
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  format,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { motion } from "motion/react";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";

import { useCalendarSettings, useViewPreferences } from "@/atoms";
import {
  DraggableEvent,
  type CalendarEvent,
} from "@/components/event-calendar";
import { EndHour, StartHour } from "@/components/event-calendar/constants";
import {
  useCurrentTimeIndicator,
  useEventCollection,
  useGridLayout,
  type EventCollectionForWeek,
} from "@/components/event-calendar/hooks";
import { useMultiDayOverflow } from "@/components/event-calendar/hooks/use-multi-day-overflow";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { OverflowIndicator } from "@/components/event-calendar/overflow-indicator";
import {
  filterDaysByWeekendPreference,
  getGridPosition,
  getWeekDays,
  isWeekend,
  placeIntoLanes,
  type PositionedEvent,
} from "@/components/event-calendar/utils";
import { cn } from "@/lib/utils";
import { createDraftEvent } from "@/lib/utils/calendar";
import { useDragToCreate } from "../hooks/use-drag-to-create";
import { DragPreview } from "./event/drag-preview";
import { Timeline } from "./timeline";

interface WeekViewProps extends React.ComponentProps<"div"> {
  currentDate: Date;
  events: CalendarEvent[];
  dispatchAction: (action: Action) => void;
  headerRef: React.RefObject<HTMLDivElement | null>;
}

export function WeekView({
  currentDate,
  events,
  dispatchAction,
  headerRef,
  ...props
}: WeekViewProps) {
  const viewPreferences = useViewPreferences();

  const allDays = React.useMemo(() => getWeekDays(currentDate), [currentDate]);

  const visibleDays = React.useMemo(
    () => filterDaysByWeekendPreference(allDays, viewPreferences.showWeekends),
    [allDays, viewPreferences.showWeekends],
  );

  const hours = React.useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatchAction({ type: "select", event });
  };

  const gridTemplateColumns = useGridLayout(allDays, {
    includeTimeColumn: true,
  });
  const eventCollection = useEventCollection(events, visibleDays, "week");

  const containerRef = React.useRef<HTMLDivElement>(null);

  const { currentTimePosition, formattedTime } = useCurrentTimeIndicator(
    currentDate,
    "week",
  );

  return (
    <div data-slot="week-view" className="isolate flex flex-col" {...props}>
      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-md"
      >
        <WeekViewHeader
          allDays={allDays}
          gridTemplateColumns={gridTemplateColumns}
        />
        <WeekViewAllDaySection
          allDays={allDays}
          visibleDays={visibleDays}
          eventCollection={eventCollection}
          gridTemplateColumns={gridTemplateColumns}
          onEventClick={handleEventClick}
          currentDate={currentDate}
          containerRef={containerRef}
          dispatchAction={dispatchAction}
        />
      </div>

      <div
        ref={containerRef}
        className="relative isolate grid flex-1 overflow-hidden transition-[grid-template-columns] duration-200 ease-linear"
        style={{ gridTemplateColumns }}
      >
        <div
          className="pointer-events-none absolute right-0 left-0"
          style={{ top: `${currentTimePosition}%` }}
        >
          <div className="relative flex items-center">
            <div className="absolute flex h-4 w-20 items-center justify-end border-r border-transparent">
              <p className="z-[1000] pe-2 text-[10px] font-medium text-red-500/80 tabular-nums sm:pe-4 sm:text-xs">
                {formattedTime}
              </p>
            </div>
            <div className="h-0.5 w-20"></div>
            <div className="h-0.5 grow bg-red-500/10"></div>
          </div>
        </div>
        <Timeline hours={hours} />
        <WeekViewDayColumns
          allDays={allDays}
          visibleDays={visibleDays}
          eventCollection={eventCollection}
          currentDate={currentDate}
          onEventClick={handleEventClick}
          dispatchAction={dispatchAction}
          containerRef={containerRef}
          hours={hours}
        />
      </div>
    </div>
  );
}

interface WeekViewHeaderProps {
  allDays: Date[];
  gridTemplateColumns: string;
}

function WeekViewHeader({ allDays, gridTemplateColumns }: WeekViewHeaderProps) {
  const viewPreferences = useViewPreferences();
  const settings = useCalendarSettings();

  const timeZone = React.useMemo(() => {
    const parts = new Intl.DateTimeFormat(settings.locale, {
      timeZoneName: "short",
      timeZone: settings.defaultTimeZone,
    }).formatToParts(allDays[0]!);

    return parts.find((part) => part.type === "timeZoneName")?.value ?? " ";
  }, [allDays, settings.defaultTimeZone, settings.locale]);

  return (
    <div
      className="grid border-b border-border/70 transition-[grid-template-columns] duration-200 ease-linear"
      style={{ gridTemplateColumns }}
    >
      <div className="flex flex-col items-end justify-end py-2 pe-2 pb-2.5 text-center text-sm text-[10px] font-medium text-muted-foreground/70 sm:pe-4 sm:text-xs">
        <span className="max-[479px]:sr-only">{timeZone}</span>
      </div>
      {allDays.map((day) => {
        const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);

        return (
          <div
            key={day.toString()}
            className={cn(
              "overflow-hidden py-2 text-center text-base font-medium text-muted-foreground/70 data-today:text-foreground",
              !isDayVisible && "w-0",
            )}
            data-today={isToday(day) || undefined}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            <span className="truncate sm:hidden" aria-hidden="true">
              {format(day, "E")[0]} {format(day, "d")}
            </span>
            <span className="truncate max-sm:hidden">
              {format(day, "EEE d")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface WeekViewAllDaySectionProps {
  allDays: Date[];
  visibleDays: Date[];
  eventCollection: EventCollectionForWeek;
  gridTemplateColumns: string;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  currentDate: Date;
  containerRef: React.RefObject<HTMLDivElement | null>;
  dispatchAction: (action: Action) => void;
}

function WeekViewAllDaySection({
  allDays,
  visibleDays,
  eventCollection,
  gridTemplateColumns,
  onEventClick,
  currentDate,
  containerRef,
  dispatchAction,
}: WeekViewAllDaySectionProps) {
  const viewPreferences = useViewPreferences();
  const settings = useCalendarSettings();

  const weekStart = React.useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate],
  );
  const weekEnd = React.useMemo(() => allDays[allDays.length - 1]!, [allDays]);
  const allDayEvents = React.useMemo(() => {
    const events =
      eventCollection.type === "week" ? eventCollection.allDayEvents : [];

    // If weekends are hidden, filter out events that only occur on weekends
    if (!viewPreferences.showWeekends) {
      return events.filter((event) => {
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

        // Get all days that this event spans within the week
        const eventDays = eachDayOfInterval({
          start: eventStart < weekStart ? weekStart : eventStart,
          end: eventEnd > weekEnd ? weekEnd : eventEnd,
        });

        // Check if event has at least one day that's not a weekend
        const hasNonWeekendDay = eventDays.some((day: Date) => !isWeekend(day));

        return hasNonWeekendDay;
      });
    }

    return events.filter((event) => {
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

      return (
        isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(eventEnd, { start: weekStart, end: weekEnd })
      );
    });
  }, [
    eventCollection,
    viewPreferences.showWeekends,
    settings.defaultTimeZone,
    weekStart,
    weekEnd,
  ]);

  // Use overflow hook for all-day events
  const overflow = useMultiDayOverflow({
    events: allDayEvents,
    timeZone: settings.defaultTimeZone,
    minVisibleLanes: 10,
  });

  // Calculate how many lanes multi-day events occupy for this week
  const multiDayLaneCount = React.useMemo(() => {
    if (allDayEvents.length === 0) return 0;
    const lanes = placeIntoLanes(allDayEvents, settings.defaultTimeZone);
    return lanes.length;
  }, [allDayEvents, settings.defaultTimeZone]);

  return (
    <div className="border-b border-border/70 [--calendar-height:100%]">
      <div
        className="relative grid transition-[grid-template-columns] duration-200 ease-linear"
        style={{ gridTemplateColumns }}
      >
        {/* Time column */}
        <div className="relative flex min-h-7 flex-col justify-center border-r border-border/70">
          <span className="w-16 max-w-full ps-2 text-right text-[10px] text-muted-foreground/70 sm:ps-4 sm:text-xs">
            All day
          </span>
        </div>

        {/* Day cells */}
        {allDays.map((day) => {
          const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
          const visibleDayIndex = visibleDays.findIndex(
            (d) => d.getTime() === day.getTime(),
          );
          const isLastVisibleDay =
            isDayVisible && visibleDayIndex === visibleDays.length - 1;

          // Filter overflow events to only show those that start on this day
          const dayOverflowEvents = overflow.overflowEvents.filter((event) => {
            const eventStart = toDate({
              value: event.start,
              timeZone: settings.defaultTimeZone,
            });
            return isSameDay(eventStart, day);
          });

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative border-r border-border/70",
                isLastVisibleDay && "border-r-0",
                isDayVisible ? "" : "w-0",
              )}
              data-today={isToday(day) || undefined}
              style={{ visibility: isDayVisible ? "visible" : "hidden" }}
              onClick={() => {
                const start = Temporal.PlainDate.from({
                  year: day.getFullYear(),
                  month: day.getMonth() + 1,
                  day: day.getDate(),
                });

                const end = start.add({ days: 1 });

                dispatchAction({
                  type: "draft",
                  event: createDraftEvent({ start, end }),
                });
              }}
            >
              {/* Reserve space for multi-day events */}
              <div
                className="min-h-7"
                style={{
                  paddingTop: `${multiDayLaneCount * 28}px`, // 24px event height + 4px gap
                }}
                ref={overflow.containerRef}
              />

              {/* Show overflow indicator for this day if there are overflow events that start on this day */}
              {dayOverflowEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 z-20 -translate-x-1/2 transform">
                  <OverflowIndicator
                    count={dayOverflowEvents.length}
                    events={dayOverflowEvents}
                    date={day}
                    dispatchAction={dispatchAction}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-muted/80"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Multi-day event overlay */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bottom-0 grid min-w-0 auto-rows-max"
          style={{ gridTemplateColumns }}
        >
          {/* Skip the time column */}
          <div />

          {/* Render only visible events */}
          {overflow.capacityInfo.visibleLanes.map((lane, y) =>
            lane.map((evt) => {
              return (
                <WeekViewPositionedEvent
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
    </div>
  );
}

interface WeekViewPositionedEventProps {
  y: number;
  evt: CalendarEvent;
  weekStart: Date;
  weekEnd: Date;
  settings: ReturnType<typeof useCalendarSettings>;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function WeekViewPositionedEvent({
  y,
  evt,
  weekStart,
  weekEnd,
  settings,
  onEventClick,
  dispatchAction,
  containerRef,
}: WeekViewPositionedEventProps) {
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
        // Add 1 to colStart to account for the time column
        gridColumn: `${colStart + 2} / span ${span}`,
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
        rows={1}
      />
    </div>
  );
}

interface PositionedEventProps {
  positionedEvent: PositionedEvent;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function PositionedEvent({
  positionedEvent,
  onEventClick,
  dispatchAction,
  containerRef,
}: PositionedEventProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div
      key={positionedEvent.event.id}
      className="absolute z-10"
      style={{
        top: `${positionedEvent.top}px`,
        height: `${positionedEvent.height}px`,
        left: `${positionedEvent.left * 100}%`,
        width: `${positionedEvent.width * 100}%`,
        zIndex: isDragging ? 9999 : positionedEvent.zIndex,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <DraggableEvent
        event={positionedEvent.event}
        view="week"
        onClick={(e) => onEventClick(positionedEvent.event, e)}
        dispatchAction={dispatchAction}
        showTime
        height={positionedEvent.height}
        containerRef={containerRef}
        setIsDragging={setIsDragging}
      />
    </div>
  );
}

interface WeekViewDayColumnsProps {
  allDays: Date[];
  visibleDays: Date[];
  eventCollection: EventCollectionForWeek;
  currentDate: Date;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hours: Date[];
}

function WeekViewDayColumns({
  allDays,
  visibleDays,
  eventCollection,
  currentDate,
  onEventClick,
  dispatchAction,
  containerRef,
  hours,
}: WeekViewDayColumnsProps) {
  const viewPreferences = useViewPreferences();

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week",
  );

  return (
    <>
      {allDays.map((day) => {
        const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
        const visibleDayIndex = visibleDays.findIndex(
          (d) => d.getTime() === day.getTime(),
        );
        const isLastVisibleDay =
          isDayVisible && visibleDayIndex === visibleDays.length - 1;

        const positionedEvents =
          eventCollection.type === "week" && visibleDayIndex >= 0
            ? (eventCollection.positionedEvents[visibleDayIndex] ?? [])
            : [];

        return (
          <div
            key={day.toString()}
            className={cn(
              "relative grid auto-cols-fr border-r border-border/70",
              isLastVisibleDay && "border-r-0",
              !isDayVisible && "w-0 overflow-hidden",
            )}
            data-today={isToday(day) || undefined}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            {positionedEvents.map((positionedEvent: PositionedEvent) => (
              <PositionedEvent
                key={positionedEvent.event.id}
                positionedEvent={positionedEvent}
                onEventClick={onEventClick}
                dispatchAction={dispatchAction}
                containerRef={containerRef}
              />
            ))}

            {currentTimeVisible && isToday(day) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="relative flex items-center gap-0.5">
                  <div className="absolute left-0.5 h-3.5 w-1 rounded-full bg-red-500/90"></div>
                  <div className="h-0.5 w-1.5"></div>
                  <div className="h-0.5 w-full rounded-r-full bg-red-500/90"></div>
                </div>
              </div>
            )}
            <MemoizedWeekViewDayTimeSlots
              day={day}
              hours={hours}
              dispatchAction={dispatchAction}
            />
          </div>
        );
      })}
    </>
  );
}

interface WeekViewDayTimeSlotsProps {
  day: Date;
  hours: Date[];
  dispatchAction: (action: Action) => void;
}

function WeekViewDayTimeSlots({
  day,
  hours,
  dispatchAction,
}: WeekViewDayTimeSlotsProps) {
  const settings = useCalendarSettings();

  const columnRef = React.useRef<HTMLDivElement>(null);
  const date = React.useMemo(() => {
    return Temporal.PlainDate.from({
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      day: day.getDate(),
    });
  }, [day]);

  const { onDragStart, onDrag, onDragEnd, top, height, opacity } =
    useDragToCreate({
      dispatchAction,
      date,
      timeZone: settings.defaultTimeZone,
      columnRef,
    });

  return (
    <motion.div
      className="touch-pan-y"
      ref={columnRef}
      onPanStart={onDragStart}
      onPan={onDrag}
      onPanEnd={onDragEnd}
    >
      {hours.map((hour) => {
        return (
          <div
            key={hour.toString()}
            className="pointer-events-none min-h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
          />
        );
      })}
      <DragPreview style={{ top, height, opacity }} />
    </motion.div>
  );
}

const MemoizedWeekViewDayTimeSlots = React.memo(WeekViewDayTimeSlots);
