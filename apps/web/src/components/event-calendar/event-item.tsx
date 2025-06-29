"use client";

import { useMemo } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { differenceInMinutes, format, getMinutes, isPast } from "date-fns";

import { toDate } from "@repo/temporal";

import { type CalendarEvent } from "@/components/event-calendar";
import { getBorderRadiusClasses } from "@/components/event-calendar/utils";
import { cn } from "@/lib/utils";

// Using date-fns format with custom formatting:
// 'h' - hours (1-12)
// 'a' - am/pm
// ':mm' - minutes with leading zero (only if the token 'mm' is present)
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase();
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  displayEnd: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

// Shared wrapper component for event styling
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  displayEnd,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  // Always use the currentTime (if provided) to determine if the event is in the past
  const isEventInPast = isPast(displayEnd);

  return (
    <button
      className={cn(
        "hover:text-event-hover flex size-full overflow-hidden border border-event bg-event px-1 text-left font-medium text-event backdrop-blur-md transition outline-none select-none hover:border-event-hover hover:bg-event-hover focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through",
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      style={
        {
          "--calendar-color": event.color ?? "var(--color-muted-foreground)",
        } as React.CSSProperties
      }
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      data-first-day={isFirstDay || undefined}
      data-last-day={isLastDay || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: "month" | "week" | "day" | "agenda";
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date; // For updating time during drag
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || toDate({ value: event.start, timeZone: "UTC" });
  }, [currentTime, event.start]);

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (toDate({ value: event.end, timeZone: "UTC" }).getTime() -
              toDate({ value: event.start, timeZone: "UTC" }).getTime()),
        )
      : toDate({ value: event.end, timeZone: "UTC" });
  }, [currentTime, event.start, event.end]);

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = () => {
    if (event.allDay) return "All day";

    // For short events (less than 45 minutes), only show start time
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }

    // For longer events, show both start and end time
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
  };

  // if (event.allDay && isLastDay) {
  //   return null;
  // }

  if (view === "month") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "flex gap-x-1.5 py-1 ps-1 pe-2",
          "mt-[var(--calendar-color-gap)] h-[var(--calendar-color-height)] items-center text-[10px] sm:text-xs",
          className,
        )}
        displayEnd={displayEnd}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div
          className={cn(
            "w-1 shrink-0 self-stretch rounded-lg bg-[color-mix(in_oklab,var(--background),var(--calendar-color)_90%)] opacity-40",
            !isFirstDay && "hidden",
          )}
        />
        <div className="flex min-w-0 grow items-stretch gap-y-1.5">
          {!isFirstDay ? <div className="h-lh" /> : null}
          {children || (
            <span className="truncate text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)]">
              {!event.allDay && (
                <span className="truncate font-normal text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)] opacity-70 sm:text-[11px]">
                  {formatTimeWithOptionalMinutes(displayStart)}{" "}
                </span>
              )}
              {event.title}
            </span>
          )}
        </div>
      </EventWrapper>
    );
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "flex w-full gap-x-1.5 py-1 ps-1 pe-2",

          view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
          className,
        )}
        displayEnd={displayEnd}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="w-1 shrink-0 rounded-lg bg-[color-mix(in_oklab,var(--background),var(--calendar-color)_90%)] opacity-40" />
        <div
          className={cn(
            durationMinutes < 45 ? "items-center" : "flex-col",
            "flex min-w-0 flex-col items-stretch gap-y-1.5",
          )}
        >
          {durationMinutes < 45 ? (
            <div className="truncate text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)]">
              {event.title ?? "(untitled)"}{" "}
              {showTime && (
                <span className="text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)] opacity-70">
                  {formatTimeWithOptionalMinutes(displayStart)}
                </span>
              )}
            </div>
          ) : (
            <>
              <div className="truncate font-medium text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)]">
                {event.title ?? "(untitled)"}
              </div>
              {showTime && (
                <div className="truncate font-normal text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)] opacity-70 sm:text-[11px]">
                  {getEventTime()}
                </div>
              )}
            </>
          )}
        </div>
      </EventWrapper>
    );
  }

  // Agenda view - kept separate since it's significantly different
  return (
    <button
      className={`${cn(
        "flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90",
        "border-[color-mix(in_oklab,var(--background),var(--calendar-color)_30%)] bg-[color-mix(in_oklab,var(--background),var(--calendar-color)_20%)]",
        className,
      )} text-[color-mix(in_oklab,var(--foreground),var(--calendar-color)_80%)]`}
      style={
        {
          "--calendar-color": event.color ?? "var(--color-muted-foreground)",
        } as React.CSSProperties
      }
      data-past-event={
        isPast(toDate({ value: event.end, timeZone: "UTC" })) || undefined
      }
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <div className="text-sm font-medium">{event.title ?? "(untitled)"}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} -{" "}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </button>
  );
}
