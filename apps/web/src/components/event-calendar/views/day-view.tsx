"use client";

import * as React from "react";
import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  getHours,
  getMinutes,
  isSameDay,
  startOfDay,
} from "date-fns";
import { motion } from "motion/react";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";

import { useCalendarSettings } from "@/atoms";
import {
  DraggableEvent,
  EventItem,
  WeekCellsHeight,
  type CalendarEvent,
} from "@/components/event-calendar";
import { EndHour, StartHour } from "@/components/event-calendar/constants";
import { useCurrentTimeIndicator } from "@/components/event-calendar/hooks";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { isMultiDayEvent } from "@/components/event-calendar/utils";
import { useDragToCreate } from "../hooks/use-drag-to-create";
import { DragPreview } from "./event/drag-preview";
import { Timeline } from "./timeline";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  dispatchAction: (action: Action) => void;
}

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
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
        view="day"
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

export function DayView({ currentDate, events, dispatchAction }: DayViewProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const hours = React.useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const settings = useCalendarSettings();

  const dayEvents = React.useMemo(() => {
    return events
      .filter((event) => {
        const eventStart = toDate({
          value: event.start,
          timeZone: settings.defaultTimeZone,
        });
        const eventEnd = toDate({
          value: event.end,
          timeZone: settings.defaultTimeZone,
        });
        return (
          isSameDay(currentDate, eventStart) ||
          isSameDay(currentDate, eventEnd) ||
          (currentDate > eventStart && currentDate < eventEnd)
        );
      })
      .sort(
        (a, b) =>
          toDate({
            value: a.start,
            timeZone: settings.defaultTimeZone,
          }).getTime() -
          toDate({
            value: b.start,
            timeZone: settings.defaultTimeZone,
          }).getTime(),
      );
  }, [currentDate, events, settings.defaultTimeZone]);

  // Filter all-day events
  const allDayEvents = React.useMemo(() => {
    return dayEvents.filter((event) => {
      // Include explicitly marked all-day events or multi-day events
      return event.allDay || isMultiDayEvent(event);
    });
  }, [dayEvents]);

  // Get only single-day time-based events
  const timeEvents = React.useMemo(() => {
    return dayEvents.filter((event) => {
      // Exclude all-day events and multi-day events
      return !event.allDay && !isMultiDayEvent(event);
    });
  }, [dayEvents]);

  // Process events to calculate positions
  const positionedEvents = React.useMemo(() => {
    const result: PositionedEvent[] = [];
    const dayStart = startOfDay(currentDate);

    // Sort events by start time and duration
    const sortedEvents = [...timeEvents].sort((a, b) => {
      const aStart = toDate({
        value: a.start,
        timeZone: settings.defaultTimeZone,
      });
      const bStart = toDate({
        value: b.start,
        timeZone: settings.defaultTimeZone,
      });
      const aEnd = toDate({ value: a.end, timeZone: settings.defaultTimeZone });
      const bEnd = toDate({ value: b.end, timeZone: settings.defaultTimeZone });

      // First sort by start time
      if (aStart < bStart) return -1;
      if (aStart > bStart) return 1;

      // If start times are equal, sort by duration (longer events first)
      const aDuration = differenceInMinutes(aEnd, aStart);
      const bDuration = differenceInMinutes(bEnd, bStart);
      return bDuration - aDuration;
    });

    // Track columns for overlapping events
    const columns: { event: CalendarEvent; end: Date }[][] = [];

    sortedEvents.forEach((event) => {
      const eventStart = toDate({
        value: event.start,
        timeZone: settings.defaultTimeZone,
      });
      const eventEnd = toDate({
        value: event.end,
        timeZone: settings.defaultTimeZone,
      });

      // Adjust start and end times if they're outside this day
      const adjustedStart = isSameDay(currentDate, eventStart)
        ? eventStart
        : dayStart;
      const adjustedEnd = isSameDay(currentDate, eventEnd)
        ? eventEnd
        : addHours(dayStart, 24);

      // Calculate top position and height
      const startHour =
        getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
      const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;
      const top = (startHour - StartHour) * WeekCellsHeight;
      const height = (endHour - startHour) * WeekCellsHeight;

      // Find a column for this event
      let columnIndex = 0;
      let placed = false;

      while (!placed) {
        const col = columns[columnIndex] || [];
        if (col.length === 0) {
          columns[columnIndex] = col;
          placed = true;
        } else {
          const overlaps = col.some((c) =>
            areIntervalsOverlapping(
              { start: adjustedStart, end: adjustedEnd },
              {
                start: toDate({
                  value: c.event.start,
                  timeZone: settings.defaultTimeZone,
                }),
                end: toDate({
                  value: c.event.end,
                  timeZone: settings.defaultTimeZone,
                }),
              },
            ),
          );
          if (!overlaps) {
            placed = true;
          } else {
            columnIndex++;
          }
        }
      }

      // Ensure column is initialized before pushing
      const currentColumn = columns[columnIndex] || [];
      columns[columnIndex] = currentColumn;
      currentColumn.push({ event, end: adjustedEnd });

      // First column takes full width, others are indented by 10% and take 90% width
      const width = columnIndex === 0 ? 1 : 0.9;
      const left = columnIndex === 0 ? 0 : columnIndex * 0.1;

      result.push({
        event,
        top,
        height,
        left,
        width,
        zIndex: 10 + columnIndex, // Higher columns get higher z-index
      });
    });

    return result;
  }, [currentDate, timeEvents, settings.defaultTimeZone]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatchAction({ type: "select", event });
  };

  const { currentTimePosition, currentTimeVisible, formattedTime } =
    useCurrentTimeIndicator(currentDate, "day");

  const { use12Hour } = useCalendarSettings();

  return (
    <div data-slot="day-view" className="contents" ref={containerRef}>
      <div className="sticky top-0 z-30 border-t border-border/70 bg-background/80 backdrop-blur-md">
        <div className="grid grid-cols-[5rem_1fr] border-b border-border/70">
          <div className="relative flex min-h-7 flex-col justify-center border-r border-border/70">
            <span className="w-16 max-w-full ps-2 text-right text-[10px] text-muted-foreground/70 sm:ps-4 sm:text-xs">
              All day
            </span>
          </div>
          <div className="relative border-r border-border/70 p-1 last:border-r-0">
            {allDayEvents.map((event) => {
              const eventStart = toDate({
                value: event.start,
                timeZone: settings.defaultTimeZone,
              });
              const eventEnd = toDate({
                value: event.end,
                timeZone: settings.defaultTimeZone,
              });
              const isFirstDay = isSameDay(currentDate, eventStart);
              const isLastDay = isSameDay(currentDate, eventEnd);

              return (
                <EventItem
                  key={`spanning-${event.id}`}
                  onClick={(e) => handleEventClick(event, e)}
                  event={event}
                  view="month"
                  isFirstDay={isFirstDay}
                  isLastDay={isLastDay}
                >
                  {/* Always show the title in day view for better usability */}
                  <div>{event.title}</div>
                </EventItem>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative isolate grid flex-1 grid-cols-[5rem_1fr] overflow-hidden border-border/70">
        {/* Current time indicator spanning both columns */}
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

        <div className="relative">
          {positionedEvents.map((positionedEvent) => (
            <PositionedEvent
              key={positionedEvent.event.id}
              positionedEvent={positionedEvent}
              onEventClick={handleEventClick}
              dispatchAction={dispatchAction}
              containerRef={containerRef}
            />
          ))}

          {/* Current time indicator */}
          {currentTimeVisible && (
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

          <MemoizedDayViewTimeSlots
            currentDate={currentDate}
            hours={hours}
            dispatchAction={dispatchAction}
          />
        </div>
      </div>
    </div>
  );
}

interface DayViewTimeSlotsProps {
  currentDate: Date;
  hours: Date[];
  dispatchAction: (action: Action) => void;
}

function DayViewTimeSlots({
  currentDate,
  hours,
  dispatchAction,
}: DayViewTimeSlotsProps) {
  const settings = useCalendarSettings();

  const columnRef = React.useRef<HTMLDivElement>(null);
  const date = React.useMemo(() => {
    return Temporal.PlainDate.from({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    });
  }, [currentDate]);

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
            className="pointer-events-none h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
          />
        );
      })}
      <DragPreview style={{ top, height, opacity }} />
    </motion.div>
  );
}

const MemoizedDayViewTimeSlots = React.memo(DayViewTimeSlots);
