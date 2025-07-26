"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Temporal } from "temporal-polyfill";

import { useCalendarSettings } from "@/atoms";
import {
  DraggableEvent,
  EventItem,
  type CalendarEvent,
} from "@/components/event-calendar";
import { useEventCollection } from "@/components/event-calendar/hooks";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { cn } from "@/lib/utils";
import { EventCollectionItem } from "../hooks/event-collection";
import { useDoubleClickToCreate } from "../hooks/use-double-click-to-create";
import { useDragToCreate } from "../hooks/use-drag-to-create";
import { HOURS } from "./constants";
import { DragPreview } from "./event/drag-preview";
import { TimeIndicator, TimeIndicatorBackground } from "./time-indicator";
import { Timeline } from "./timeline";

interface DayViewProps {
  currentDate: Temporal.PlainDate;
  events: EventCollectionItem[];
  dispatchAction: (action: Action) => void;
}

interface PositionedEventProps {
  positionedEvent: {
    item: EventCollectionItem;
    top: number;
    height: number;
    left: number;
    width: number;
    zIndex: number;
  };
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
        view="day"
        onClick={(e) => onEventClick(positionedEvent.item.event, e)}
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

  // Use the new event collection hook
  const eventCollection = useEventCollection(events, currentDate, "day");

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatchAction({ type: "select", event });
  };

  return (
    <div data-slot="day-view" className="contents" ref={containerRef}>
      <AllDayRow>
        {eventCollection.allDayEvents.map((item) => (
          <DayViewPositionedEvent
            key={`spanning-${item.event.id}`}
            item={item}
            currentDate={currentDate}
            dispatchAction={dispatchAction}
          />
        ))}
      </AllDayRow>

      <div className="relative isolate grid flex-1 grid-cols-[5rem_1fr] overflow-hidden border-border/70">
        <TimeIndicatorBackground date={currentDate} />

        <Timeline />

        <div className="relative">
          {eventCollection.positionedEvents.map((positionedEvent) => (
            <PositionedEvent
              key={positionedEvent.item.event.id}
              positionedEvent={positionedEvent}
              onEventClick={handleEventClick}
              dispatchAction={dispatchAction}
              containerRef={containerRef}
            />
          ))}

          <TimeIndicator date={currentDate} />

          <MemoizedDayViewTimeSlots
            currentDate={currentDate}
            hours={HOURS}
            dispatchAction={dispatchAction}
          />
        </div>
      </div>
    </div>
  );
}

type AllDayRowProps = React.ComponentProps<"div">;

function AllDayRow({ children, className, ...props }: AllDayRowProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-t border-border/70 bg-background/80 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="grid grid-cols-[5rem_1fr] border-b border-border/70">
        <div className="relative flex min-h-7 flex-col justify-center border-r border-border/70">
          <span className="w-16 max-w-full ps-2 text-right text-[10px] text-muted-foreground/70 sm:ps-4 sm:text-xs">
            All day
          </span>
        </div>
        <div className="relative border-r border-border/70 py-1 last:border-r-0">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DayViewPositionedEventProps {
  item: EventCollectionItem;
  currentDate: Temporal.PlainDate;
  dispatchAction: (action: Action) => void;
}

function DayViewPositionedEvent({
  item,
  currentDate,
  dispatchAction,
}: DayViewPositionedEventProps) {
  const handleEventClick = React.useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatchAction({ type: "select", event });
    },
    [dispatchAction],
  );

  const { isFirstDay, isLastDay } = React.useMemo(() => {
    // For single-day events, ensure they are properly marked as first and last day
    const isFirstDay = Temporal.PlainDate.compare(item.start, currentDate) >= 0;
    const isLastDay = Temporal.PlainDate.compare(item.end, currentDate) <= 0;

    return { isFirstDay, isLastDay };
  }, [item.start, item.end, currentDate]);

  return (
    <EventItem
      onClick={(e) => handleEventClick(item.event, e)}
      event={item.event}
      view="month"
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

interface DayViewTimeSlotsProps {
  currentDate: Temporal.PlainDate;
  hours: Temporal.PlainTime[];
  dispatchAction: (action: Action) => void;
}

function DayViewTimeSlots({
  currentDate,
  hours,
  dispatchAction,
}: DayViewTimeSlotsProps) {
  const settings = useCalendarSettings();
  const columnRef = React.useRef<HTMLDivElement>(null);

  const { onDragStart, onDrag, onDragEnd, top, height, opacity, isPreviewPersistent } =
    useDragToCreate({
      dispatchAction,
      date: currentDate,
      timeZone: settings.defaultTimeZone,
      columnRef,
    });

  const { onDoubleClick } = useDoubleClickToCreate({
    dispatchAction,
    date: currentDate,
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
      {hours.map((hour) => {
        return (
          <div
            key={hour.toString()}
            className="pointer-events-none h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
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

const MemoizedDayViewTimeSlots = React.memo(DayViewTimeSlots);
