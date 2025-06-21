"use client";

import { AgendaView } from "@/components/event-calendar/views/agenda-view";
import { DayView } from "@/components/event-calendar/views/day-view";
import { MonthView } from "@/components/event-calendar/views/month-view";
import { WeekView } from "@/components/event-calendar/views/week-view";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { CalendarEvent } from "./types";

interface CalendarContentProps {
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function CalendarContent({
  events,
  onEventSelect,
  onEventCreate,
}: CalendarContentProps) {
  const { currentDate, view } = useCalendarState();

  switch (view) {
    case "month":
      return (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventSelect={onEventSelect}
          onEventCreate={onEventCreate}
        />
      );

    case "week":
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventSelect={onEventSelect}
          onEventCreate={onEventCreate}
        />
      );

    case "day":
      return (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventSelect={onEventSelect}
          onEventCreate={onEventCreate}
        />
      );

    case "agenda":
      return (
        <AgendaView
          currentDate={currentDate}
          events={events}
          onEventSelect={onEventSelect}
        />
      );

    default:
      // Fallback to week view for unknown view types
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventSelect={onEventSelect}
          onEventCreate={onEventCreate}
        />
      );
  }
}
