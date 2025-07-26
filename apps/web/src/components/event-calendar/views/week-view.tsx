"use client";

import * as React from "react";
import { format } from "date-fns/format";
import { motion } from "motion/react";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";
import { isToday, isWeekend } from "@repo/temporal/v2";

import { useCalendarSettings, useViewPreferences } from "@/atoms";
import { DraggableEvent } from "@/components/event-calendar";
import {
  useEventCollection,
  useGridLayout,
  type EventCollectionForWeek,
} from "@/components/event-calendar/hooks";
import { useMultiDayOverflow } from "@/components/event-calendar/hooks/use-multi-day-overflow";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { OverflowIndicator } from "@/components/event-calendar/overflow-indicator";
import {
  getEventsStartingOnPlainDate,
  getGridPosition,
  getWeek,
  type PositionedEvent,
} from "@/components/event-calendar/utils";
import { cn } from "@/lib/utils";
import { createDraftEvent } from "@/lib/utils/calendar";
import { EventCollectionItem } from "../hooks/event-collection";
import { useDoubleClickToCreate } from "../hooks/use-double-click-to-create";
import { useDragToCreate } from "../hooks/use-drag-to-create";
import { HOURS } from "./constants";
import { DragPreview } from "./event/drag-preview";
import { TimeIndicator, TimeIndicatorBackground } from "./time-indicator";
import { Timeline } from "./timeline";

interface WeekViewProps extends React.ComponentProps<"div"> {
  currentDate: Temporal.PlainDate;
  events: EventCollectionItem[];
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

  const settings = useCalendarSettings();
  const { week, visibleDays } = React.useMemo(() => {
    const week = getWeek(currentDate, settings.weekStartsOn);

    if (!viewPreferences.showWeekends) {
      return {
        week,
        visibleDays: week.days.filter((day) => !isWeekend(day)),
      };
    }

    return {
      week,
      visibleDays: week.days,
    };
  }, [currentDate, settings.weekStartsOn, viewPreferences.showWeekends]);

  const gridTemplateColumns = useGridLayout(week.days, {
    includeTimeColumn: true,
  });
  const eventCollection = useEventCollection(events, visibleDays, "week");

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div data-slot="week-view" className="isolate flex flex-col" {...props}>
      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-md"
      >
        <WeekViewHeader
          allDays={week.days}
          gridTemplateColumns={gridTemplateColumns}
        />
        <WeekViewAllDaySection
          allDays={week.days}
          visibleDays={visibleDays}
          eventCollection={eventCollection}
          gridTemplateColumns={gridTemplateColumns}
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
        <TimeIndicatorBackground date={currentDate} />
        <Timeline />
        <WeekViewDayColumns
          allDays={week.days}
          visibleDays={visibleDays}
          eventCollection={eventCollection}
          currentDate={currentDate}
          dispatchAction={dispatchAction}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}

interface WeekViewHeaderProps {
  allDays: Temporal.PlainDate[];
  gridTemplateColumns: string;
}

function WeekViewHeader({ allDays, gridTemplateColumns }: WeekViewHeaderProps) {
  const viewPreferences = useViewPreferences();
  const settings = useCalendarSettings();

  const timeZone = React.useMemo(() => {
    const value = toDate({
      value: allDays[0]!,
      timeZone: settings.defaultTimeZone,
    });

    const parts = new Intl.DateTimeFormat(settings.locale, {
      timeZoneName: "short",
      timeZone: settings.defaultTimeZone,
    }).formatToParts(value);

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

        const value = toDate({
          value: day,
          timeZone: settings.defaultTimeZone,
        });
        return (
          <div
            key={day.toString()}
            className={cn(
              "overflow-hidden py-2 text-center text-base font-medium text-muted-foreground/70 data-today:text-foreground",
              !isDayVisible && "w-0",
            )}
            data-today={
              isToday(day, { timeZone: settings.defaultTimeZone }) || undefined
            }
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            <span className="truncate sm:hidden" aria-hidden="true">
              {format(value, "E")[0]} {format(value, "d")}
            </span>
            <span className="truncate max-sm:hidden">
              {format(value, "EEE d")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface WeekViewAllDaySectionProps {
  allDays: Temporal.PlainDate[];
  visibleDays: Temporal.PlainDate[];
  eventCollection: EventCollectionForWeek;
  gridTemplateColumns: string;
  currentDate: Temporal.PlainDate;
  containerRef: React.RefObject<HTMLDivElement | null>;
  dispatchAction: (action: Action) => void;
}

function WeekViewAllDaySection({
  allDays,
  visibleDays,
  eventCollection,
  gridTemplateColumns,
  containerRef,
  dispatchAction,
}: WeekViewAllDaySectionProps) {
  const viewPreferences = useViewPreferences();
  const settings = useCalendarSettings();

  // Use overflow hook for all-day events
  const overflow = useMultiDayOverflow({
    events: eventCollection.allDayEvents,
    timeZone: settings.defaultTimeZone,
    minVisibleLanes: 10,
  });

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
            (d) => Temporal.PlainDate.compare(d, day) === 0,
          );
          const isLastVisibleDay =
            isDayVisible && visibleDayIndex === visibleDays.length - 1;

          // Filter overflow events to only show those that start on this day
          const dayOverflowEvents = getEventsStartingOnPlainDate(
            overflow.overflowEvents,
            day,
            settings.defaultTimeZone,
          );

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative border-r border-border/70",
                isLastVisibleDay && "border-r-0",
                isDayVisible ? "" : "w-0",
              )}
              data-today={
                isToday(day, { timeZone: settings.defaultTimeZone }) ||
                undefined
              }
              style={{ visibility: isDayVisible ? "visible" : "hidden" }}
              onClick={() => {
                const start = day;

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
                  paddingTop: `${overflow.capacityInfo.totalLanes * 28}px`, // 24px event height + 4px gap
                }}
                ref={overflow.containerRef}
              />

              {/* Show overflow indicator for this day if there are overflow events that start on this day */}
              {dayOverflowEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 z-20 -translate-x-1/2 transform">
                  <OverflowIndicator
                    count={dayOverflowEvents.length}
                    items={dayOverflowEvents}
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
          <div />

          {/* Render only visible events */}
          {overflow.capacityInfo.visibleLanes.map((lane, y) =>
            lane.map((evt) => {
              return (
                <WeekViewPositionedEvent
                  key={evt.event.id}
                  y={y}
                  item={evt}
                  weekStart={allDays[0]!}
                  weekEnd={allDays[allDays.length - 1]!}
                  settings={settings}
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
  item: EventCollectionItem;
  weekStart: Temporal.PlainDate;
  weekEnd: Temporal.PlainDate;
  settings: ReturnType<typeof useCalendarSettings>;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function WeekViewPositionedEvent({
  y,
  item,
  weekStart,
  weekEnd,
  settings,
  dispatchAction,
  containerRef,
}: WeekViewPositionedEventProps) {
  const { colStart, span } = getGridPosition(
    item,
    weekStart,
    weekEnd,
    settings.defaultTimeZone,
  );

  const { isFirstDay, isLastDay } = React.useMemo(() => {
    // For single-day events, ensure they are properly marked as first and last day
    const isFirstDay = Temporal.PlainDate.compare(item.start, weekStart) >= 0;
    const isLastDay = Temporal.PlainDate.compare(item.end, weekEnd) <= 0;

    return { isFirstDay, isLastDay };
  }, [item.start, item.end, weekStart, weekEnd]);

  const [isDragging, setIsDragging] = React.useState(false);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatchAction({ type: "select", event: item.event });
    },
    [dispatchAction, item],
  );

  return (
    <div
      key={item.event.id}
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
        event={item.event}
        view="month"
        containerRef={containerRef}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
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
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function PositionedEvent({
  positionedEvent,
  dispatchAction,
  containerRef,
}: PositionedEventProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatchAction({ type: "select", event: positionedEvent.item.event });
    },
    [dispatchAction, positionedEvent.item.event],
  );

  return (
    <div
      key={positionedEvent.item.event.id}
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
        event={positionedEvent.item.event}
        view="week"
        onClick={onClick}
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
  allDays: Temporal.PlainDate[];
  visibleDays: Temporal.PlainDate[];
  eventCollection: EventCollectionForWeek;
  currentDate: Temporal.PlainDate;
  dispatchAction: (action: Action) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function WeekViewDayColumns({
  allDays,
  visibleDays,
  eventCollection,
  dispatchAction,
  containerRef,
}: WeekViewDayColumnsProps) {
  const viewPreferences = useViewPreferences();
  const { defaultTimeZone } = useCalendarSettings();

  return (
    <>
      {allDays.map((date) => {
        const isDayVisible = viewPreferences.showWeekends || !isWeekend(date);
        const visibleDayIndex = visibleDays.findIndex(
          (d) => Temporal.PlainDate.compare(d, date) === 0,
        );
        const isLastVisibleDay =
          isDayVisible && visibleDayIndex === visibleDays.length - 1;

        const positionedEvents =
          eventCollection.type === "week" && visibleDayIndex >= 0
            ? (eventCollection.positionedEvents[visibleDayIndex] ?? [])
            : [];

        return (
          <div
            key={date.toString()}
            className={cn(
              "relative grid auto-cols-fr border-r border-border/70",
              isLastVisibleDay && "border-r-0",
              !isDayVisible && "w-0 overflow-hidden",
            )}
            data-today={
              isToday(date, { timeZone: defaultTimeZone }) || undefined
            }
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            {positionedEvents.map((positionedEvent: PositionedEvent) => (
              <PositionedEvent
                key={positionedEvent.item.event.id}
                positionedEvent={positionedEvent}
                dispatchAction={dispatchAction}
                containerRef={containerRef}
              />
            ))}

            <TimeIndicator date={date} />
            <MemoizedWeekViewDayTimeSlots
              date={date}
              dispatchAction={dispatchAction}
            />
          </div>
        );
      })}
    </>
  );
}

interface WeekViewDayTimeSlotsProps {
  date: Temporal.PlainDate;
  dispatchAction: (action: Action) => void;
}

function WeekViewDayTimeSlots({
  date,
  dispatchAction,
}: WeekViewDayTimeSlotsProps) {
  const { defaultTimeZone } = useCalendarSettings();

  const columnRef = React.useRef<HTMLDivElement>(null);

  const { onDragStart, onDrag, onDragEnd, top, height, opacity, isPreviewPersistent } =
    useDragToCreate({
      dispatchAction,
      date,
      timeZone: defaultTimeZone,
      columnRef,
    });

  const { onDoubleClick } = useDoubleClickToCreate({
    dispatchAction,
    date,
    columnRef,
  });

  return (
    <motion.div
      className="touch-pan-y"
      ref={columnRef}
      onPanStart={onDragStart}
      onPan={onDrag}
      onPanEnd={onDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {HOURS.map((hour) => {
        return (
          <div
            key={hour.toString()}
            className="pointer-events-none min-h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
          />
        );
      })}
      <DragPreview 
        style={{ top, height, opacity }} 
        isPersistent={isPreviewPersistent}
      />
    </motion.div>
  );
}

const MemoizedWeekViewDayTimeSlots = React.memo(WeekViewDayTimeSlots);
