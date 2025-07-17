"use client";

import * as React from "react";
import {
  PanInfo,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { Temporal } from "temporal-polyfill";

import { CalendarEvent, EventItem } from "@/components/event-calendar";
import { EventContextMenu } from "@/components/event-calendar/event-context-menu";
import { ContextMenuTrigger } from "@/components/ui/context-menu";
import type { Action } from "./hooks/use-optimistic-events";

interface DraggableEventProps {
  event: CalendarEvent;
  view: "month" | "week" | "day";
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  dispatchAction: (action: Action) => void;
  setIsDragging?: (isDragging: boolean) => void;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
  containerRef: React.RefObject<HTMLDivElement | null>;
  rows?: number;
  zIndex?: number;
}

interface IsMultiDayEventOptions {
  event: Pick<CalendarEvent, "start" | "end" | "allDay">;
  defaultTimeZone: string;
}

function isMultiDayEvent({ event, defaultTimeZone }: IsMultiDayEventOptions) {
  if (event.allDay) {
    return true;
  }

  const eventStart = event.start as Temporal.ZonedDateTime;
  const eventEnd = event.end as Temporal.ZonedDateTime;

  return (
    Temporal.PlainDate.compare(
      eventStart.withTimeZone(defaultTimeZone).toPlainDate(),
      eventEnd.withTimeZone(defaultTimeZone).toPlainDate(),
    ) !== 0
  );
}

export function DraggableEvent({
  event,
  view,
  showTime,
  onClick,
  height: initialHeight,
  dispatchAction,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
  containerRef,
  rows,
  setIsDragging,
  zIndex,
}: DraggableEventProps) {
  const dragRef = React.useRef<HTMLDivElement>(null);

  const eventRef = React.useRef(event);
  const heightRef = React.useRef(initialHeight);

  React.useEffect(() => {
    eventRef.current = event;
    heightRef.current = initialHeight;
  }, [event, initialHeight]);

  const top = useMotionValue(0);
  const left = useMotionValue(0);
  const height = useMotionValue(initialHeight ?? "100%");
  const transform = useMotionTemplate`translate(${left}px,${top}px)`;

  React.useEffect(() => {
    height.set(initialHeight ?? "100%");
  }, [initialHeight, height]);

  const onDragStart = () => {
    setIsDragging?.(true);
  };

  const onDrag = (event: PointerEvent, info: PanInfo) => {
    top.set(info.offset.y);
    left.set(info.offset.x);
  };

  const onDragEnd = (_e: PointerEvent, info: PanInfo) => {
    setIsDragging?.(false);
    top.set(0);
    left.set(0);

    const current = eventRef.current;
    // @ts-expect-error -- should both be of the same type
    const duration = current.start.until(current.end);

    const columnDelta = Math.round(
      (info.offset.x /
        (containerRef.current?.getBoundingClientRect().width || 0)) *
        7,
    );

    if (view === "month") {
      if (!rows) {
        return;
      }

      const rowDelta = Math.round(
        (info.offset.y /
          (containerRef.current?.getBoundingClientRect().height || 0)) *
          rows,
      );

      const start = current.start.add({ days: columnDelta + rowDelta * 7 });
      const end = start.add(duration);

      dispatchAction({ type: "update", event: { ...current, start, end } });

      return;
    }

    if (view === "day") {
      if (current.start instanceof Temporal.PlainDate) {
        return;
      }

      const minutes = Math.round((info.offset.y / 64) * 60);
      const start = current.start.add({ minutes }).round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand",
      });

      const end = start.add(duration);

      dispatchAction({ type: "update", event: { ...current, start, end } });

      return;
    }

    if (current.start instanceof Temporal.PlainDate) {
      const start = current.start.add({ days: columnDelta });
      const end = start.add(duration);

      dispatchAction({ type: "update", event: { ...current, start, end } });

      return;
    }

    const minutes = Math.round((info.offset.y / 64) * 60);
    const start = current.start
      .add({ days: columnDelta })
      .add({ minutes })
      .round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand",
      });

    const end = start.add(duration);

    dispatchAction({ type: "update", event: { ...current, start, end } });
  };

  const startHeight = React.useRef(0);

  const onResizeTopStart = (_e: PointerEvent, info: PanInfo) => {
    startHeight.current = heightRef.current ?? 0;
    height.set(startHeight.current - info.offset.y);
    top.set(info.offset.y);
  };
  const onResizeBottomStart = (_e: PointerEvent, info: PanInfo) => {
    startHeight.current = heightRef.current ?? 0;
    height.set(startHeight.current + info.offset.y);
  };

  const onResizeTop = (_e: PointerEvent, info: PanInfo) => {
    height.set(startHeight.current - info.offset.y);
    top.set(info.offset.y);
  };

  const onResizeBottom = (_e: PointerEvent, info: PanInfo) => {
    height.set(startHeight.current + info.offset.y);
  };

  const updateStartTime = React.useCallback(
    (offsetY: number) => {
      const start = eventRef.current.start as
        | Temporal.ZonedDateTime
        | Temporal.Instant;
      const minutes = Math.round((offsetY / 64) * 60);
      const rounded = start.add({ minutes }).round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand",
      });

      dispatchAction({
        type: "update",
        event: { ...eventRef.current, start: rounded },
      });
    },
    [dispatchAction],
  );

  const updateEndTime = React.useCallback(
    (offsetY: number) => {
      const end = eventRef.current.end as
        | Temporal.ZonedDateTime
        | Temporal.Instant;
      const minutes = Math.round((offsetY / 64) * 60);
      const rounded = end.add({ minutes }).round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand",
      });

      dispatchAction({
        type: "update",
        event: { ...eventRef.current, end: rounded },
      });
    },
    [dispatchAction],
  );

  const onResizeTopEnd = (_: PointerEvent, info: PanInfo) => {
    top.set(0);
    updateStartTime(info.offset.y);
  };
  const onResizeBottomEnd = (_: PointerEvent, info: PanInfo) => {
    top.set(0);
    updateEndTime(info.offset.y);
  };

  if (event.allDay || view === "month") {
    return (
      <motion.div
        ref={dragRef}
        className="@container/event size-full touch-none"
        style={{ transform, height, top, zIndex }}
      >
        <EventContextMenu event={event} dispatchAction={dispatchAction}>
          <ContextMenuTrigger>
            <EventItem
              event={event}
              view={view}
              showTime={showTime}
              isFirstDay={isFirstDay}
              isLastDay={isLastDay}
              onClick={onClick}
              onMouseDown={onClick}
              // onTouchStart={handleTouchStart}
              aria-hidden={ariaHidden}
            >
              {!event.readOnly ? (
                <>
                  <motion.div
                    className="absolute inset-x-0 inset-y-2 touch-pan-x touch-pan-y"
                    onPanStart={onDragStart}
                    onPan={onDrag}
                    onPanEnd={onDragEnd}
                  />
                </>
              ) : null}
            </EventItem>
          </ContextMenuTrigger>
        </EventContextMenu>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={dragRef}
      className="@container/event size-full touch-none"
      style={{ transform, height: height, zIndex }}
    >
      <EventContextMenu event={event} dispatchAction={dispatchAction}>
        <ContextMenuTrigger>
          <EventItem
            event={event}
            view={view}
            showTime={showTime}
            isFirstDay={isFirstDay}
            isLastDay={isLastDay}
            onClick={onClick}
            onMouseDown={onClick}
            // onTouchStart={handleTouchStart}
            aria-hidden={ariaHidden}
          >
            {!event.readOnly ? (
              <>
                <motion.div
                  className="absolute inset-0 touch-pan-x touch-pan-y"
                  onPanStart={onDragStart}
                  onPan={onDrag}
                  onPanEnd={onDragEnd}
                />
                <motion.div
                  className="absolute inset-x-0 top-0 h-[min(15%,_0.25rem)] cursor-row-resize touch-pan-y"
                  onPanStart={onResizeTopStart}
                  onPan={onResizeTop}
                  onPanEnd={onResizeTopEnd}
                />
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-[min(15%,_0.25rem)] cursor-row-resize touch-pan-y"
                  onPanStart={onResizeBottomStart}
                  onPan={onResizeBottom}
                  onPanEnd={onResizeBottomEnd}
                />
              </>
            ) : null}
          </EventItem>
        </ContextMenuTrigger>
      </EventContextMenu>
    </motion.div>
  );
}
