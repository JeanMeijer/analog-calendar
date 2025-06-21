import { useCallback, useState } from "react";
import { Temporal } from "temporal-polyfill";

import { authClient } from "@repo/auth/client";

import { CalendarEvent } from "../types";
import { snapTimeToInterval } from "../utils";
import { useCalendarSettings } from "./use-calendar-settings";

interface CreateEventParams {
  startTime: Date;
  defaultTimeZone: string;
  defaultDuration: number;
  calendar: {
    calendarId: string;
    accountId: string;
    providerId: "google" | "microsoft";
    timeZone: string;
  };
}

function createEvent({
  startTime,
  defaultTimeZone,
  defaultDuration,
  calendar,
}: CreateEventParams) {
  const instant = Temporal.Instant.fromEpochMilliseconds(
    snapTimeToInterval(startTime).getTime(),
  );

  const snappedTime = instant.toZonedDateTimeISO(
    calendar.timeZone ?? defaultTimeZone,
  );

  const newEvent: CalendarEvent = {
    id: "",
    title: "",
    start: snappedTime,
    end: snappedTime.add({ minutes: defaultDuration }),
    allDay: false,
    color: undefined,
    ...calendar,
  };

  return newEvent;
}

export function useEventDialog(): {
  isEventDialogOpen: boolean;
  selectedEvent: CalendarEvent | null;
  handleEventSelect: (event: CalendarEvent) => void;
  handleEventCreate: (startTime: Date) => void;
  handleDialogClose: () => void;
} {
  const { data: session } = authClient.useSession();

  const settings = useCalendarSettings();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const handleEventSelect = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  const handleEventCreate = useCallback(
    (startTime: Date) => {
      if (!session) {
        return;
      }

      const newEvent = createEvent({
        startTime,
        defaultTimeZone: settings.defaultTimeZone,
        defaultDuration: settings.defaultEventDuration,
        // Gotta refactor this later
        // My brain is too fried rn
        calendar: {
          accountId: session.user.defaultAccountId ?? "",
          calendarId: session.user.defaultCalendarId ?? "",
          providerId: "google",
          timeZone: settings.defaultTimeZone,
        },
      });

      setSelectedEvent(newEvent);
      setIsEventDialogOpen(true);
    },
    [settings],
  );

  const handleDialogClose = useCallback(() => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  return {
    isEventDialogOpen,
    selectedEvent,
    handleEventSelect,
    handleEventCreate,
    handleDialogClose,
  };
}
