"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { Temporal } from "temporal-polyfill";

import { compareTemporal, toDate } from "@repo/temporal";

import { useCalendarSettings } from "@/atoms";
import { EventItem, type CalendarEvent } from "@/components/event-calendar";

// Define the context type
type CalendarDndContextType = {
  activeEvent: CalendarEvent | null;
  activeId: UniqueIdentifier | null;
  activeView: "month" | "week" | "day" | null;
  currentTime: Date | null;
  eventHeight: number | null;
  isMultiDay: boolean;
  multiDayWidth: number | null;
  dragHandlePosition: {
    x?: number;
    y?: number;
    data?: {
      isFirstDay?: boolean;
      isLastDay?: boolean;
    };
  } | null;
};

// Create the context
const CalendarDndContext = createContext<CalendarDndContextType>({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
  dragHandlePosition: null,
});

interface CalculateDateTimeOptions {
  displayTimeZone: string;
  original: Temporal.Instant | Temporal.ZonedDateTime;
  date: Temporal.PlainDate;
  time: Temporal.PlainTime;
}

function calculateDateTime({
  original,
  date,
  time,
  displayTimeZone,
}: CalculateDateTimeOptions) {
  if (original instanceof Temporal.Instant) {
    throw new Error("Not implemented");
  }

  return date
    .toZonedDateTime({
      plainTime: time,
      timeZone: displayTimeZone,
    })
    .withTimeZone(original.timeZoneId);
}

// Hook to use the context
export const useCalendarDnd = () => useContext(CalendarDndContext);

// Props for the providerId
interface CalendarDndProviderProps {
  children: ReactNode;
  onEventUpdate: (event: CalendarEvent) => void;
}

export function CalendarDndProvider({
  children,
  onEventUpdate,
}: CalendarDndProviderProps) {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeView, setActiveView] = useState<"month" | "week" | "day" | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [eventHeight, setEventHeight] = useState<number | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [multiDayWidth, setMultiDayWidth] = useState<number | null>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    x?: number;
    y?: number;
    data?: {
      isFirstDay?: boolean;
      isLastDay?: boolean;
    };
  } | null>(null);

  const settings = useCalendarSettings();

  // Store original event dimensions
  const eventDimensions = useRef<{ height: number }>({ height: 0 });

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      // Require the pointer to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // Generate a stable ID for the DndContext
  const dndContextId = useId();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Add safety check for data.current
    if (!active.data.current) {
      console.error("Missing data in drag start event", event);
      return;
    }

    const {
      event: calendarEvent,
      view,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current as {
      event: CalendarEvent;
      view: "month" | "week" | "day";
      height?: number;
      isMultiDay?: boolean;
      multiDayWidth?: number;
      dragHandlePosition?: {
        x?: number;
        y?: number;
        data?: {
          isFirstDay?: boolean;
          isLastDay?: boolean;
        };
      };
    };

    setActiveEvent(calendarEvent);
    setActiveId(active.id);
    setActiveView(view);
    // TODO: This is probably gonna cause issues when the default timezone changes
    setCurrentTime(
      toDate({
        value: calendarEvent.start,
        timeZone: settings.defaultTimeZone,
      }),
    );
    setIsMultiDay(eventIsMultiDay || false);
    setMultiDayWidth(eventMultiDayWidth || null);
    setDragHandlePosition(eventDragHandlePosition || null);

    // Store event height if provided
    if (height) {
      eventDimensions.current.height = height;
      setEventHeight(height);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (over && activeEvent && over.data.current) {
      const { date, time } = over.data.current as { date: Date; time?: number };

      // Update time for week/day views
      if (time !== undefined && activeView !== "month") {
        const newTime = new Date(date);

        // Calculate hours and minutes with 15-minute precision
        const hours = Math.floor(time);
        const fractionalHour = time - hours;

        // Map to nearest 15 minute interval (0, 0.25, 0.5, 0.75)
        let minutes = 0;
        if (fractionalHour < 0.125) minutes = 0;
        else if (fractionalHour < 0.375) minutes = 15;
        else if (fractionalHour < 0.625) minutes = 30;
        else minutes = 45;

        newTime.setHours(hours, minutes, 0, 0);

        // Only update if time has changed
        if (
          !currentTime ||
          newTime.getHours() !== currentTime.getHours() ||
          newTime.getMinutes() !== currentTime.getMinutes() ||
          newTime.getDate() !== currentTime.getDate() ||
          newTime.getMonth() !== currentTime.getMonth() ||
          newTime.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newTime);
        }
      } else if (activeView === "month") {
        // For month view, just update the date but preserve time
        const newTime = new Date(date);
        if (currentTime) {
          newTime.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds(),
          );
        }

        // Only update if date has changed
        if (
          !currentTime ||
          newTime.getDate() !== currentTime.getDate() ||
          newTime.getMonth() !== currentTime.getMonth() ||
          newTime.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newTime);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Add robust error checking
    if (!over || !activeEvent || !currentTime) {
      // Reset state and exit early
      setActiveEvent(null);
      setActiveId(null);
      setActiveView(null);
      setCurrentTime(null);
      setEventHeight(null);
      setIsMultiDay(false);
      setMultiDayWidth(null);
      setDragHandlePosition(null);
      return;
    }

    try {
      // Safely access data with checks
      if (!active.data.current || !over.data.current) {
        throw new Error("Missing data in drag event");
      }

      const activeData = active.data.current as {
        event?: CalendarEvent;
        view?: string;
      };
      const overData = over.data.current as { date?: Date; time?: number };

      // Verify we have all required data
      if (!activeData.event || !overData.date) {
        throw new Error("Missing required event data");
      }

      const calendarEvent = activeData.event;
      const date = overData.date;
      const time = overData.time;

      // Calculate new start time
      const datePart = Temporal.PlainDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      });

      let timePart: Temporal.PlainTime;

      // If time is provided (for week/day views), set the hours and minutes
      if (time !== undefined) {
        const hours = Math.floor(time);
        const fractionalHour = time - hours;

        // Map to nearest 15 minute interval (0, 0.25, 0.5, 0.75)
        let minutes = 0;
        if (fractionalHour < 0.125) minutes = 0;
        else if (fractionalHour < 0.375) minutes = 15;
        else if (fractionalHour < 0.625) minutes = 30;
        else minutes = 45;

        // newStart.setHours(hours, minutes, 0, 0);
        timePart = Temporal.PlainTime.from({
          hour: hours,
          minute: minutes,
        });
      } else {
        // For month view, preserve the original time from currentTime
        timePart = Temporal.PlainTime.from({
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes(),
          second: currentTime.getSeconds(),
          millisecond: currentTime.getMilliseconds(),
        });
      }

      // Calculate new end time based on the original duration
      const originalStart = calendarEvent.start;
      const originalEnd = calendarEvent.end;

      if (originalStart instanceof Temporal.PlainDate) {
        throw new Error("Original start is a plain date");
      }

      if (originalEnd instanceof Temporal.PlainDate) {
        throw new Error("Original end is a plain date");
      }

      // @ts-expect-error -- Needs a better solution
      const duration = originalEnd.since(originalStart);

      const newStart = calculateDateTime({
        displayTimeZone: settings.defaultTimeZone,
        original: originalStart,
        date: datePart,
        time: timePart,
      });

      const newEnd = newStart.add(duration);

      // Only update if the start time has actually changed
      const hasStartTimeChanged =
        compareTemporal(originalStart, newStart) !== 0;

      if (hasStartTimeChanged) {
        // Update the event only if the time has changed
        onEventUpdate({
          ...calendarEvent,
          start: newStart,
          end: newEnd,
        });
      }
    } catch (error) {
      console.error("Error in drag end handler:", error);
    } finally {
      // Always reset state
      setActiveEvent(null);
      setActiveId(null);
      setActiveView(null);
      setCurrentTime(null);
      setEventHeight(null);
      setIsMultiDay(false);
      setMultiDayWidth(null);
      setDragHandlePosition(null);
    }
  };

  // Handle drag cancel (e.g., when ESC key is pressed)
  const handleDragCancel = () => {
    try {
      /* empty */
    } catch (error) {
      console.error("Error in drag cancel handler:", error);
    } finally {
      // Reset state
      setActiveEvent(null);
      setActiveId(null);
      setActiveView(null);
      setCurrentTime(null);
      setEventHeight(null);
      setIsMultiDay(false);
      setMultiDayWidth(null);
      setDragHandlePosition(null);
    }
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <CalendarDndContext.Provider
        value={{
          activeEvent,
          activeId,
          activeView,
          currentTime,
          eventHeight,
          isMultiDay,
          multiDayWidth,
          dragHandlePosition,
        }}
      >
        {children}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeEvent && activeView && (
            <div
              style={{
                height: eventHeight ? `${eventHeight}px` : "auto",
                width:
                  isMultiDay && multiDayWidth ? `${multiDayWidth}%` : "100%",
                // Remove the transform that was causing the shift
              }}
            >
              <EventItem
                event={activeEvent}
                view={activeView}
                isDragging={true}
                showTime={activeView !== "month"}
                currentTime={currentTime || undefined}
                isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
                isLastDay={dragHandlePosition?.data?.isLastDay !== false}
              />
            </div>
          )}
        </DragOverlay>
      </CalendarDndContext.Provider>
    </DndContext>
  );
}
