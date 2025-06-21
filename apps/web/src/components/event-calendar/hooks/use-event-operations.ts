import { useCallback } from "react";

import { CALENDAR_CONFIG } from "../constants";
import { CalendarEvent } from "../types";
import {
  generateEventId,
  showEventAddedToast,
  showEventDeletedToast,
  showEventMovedToast,
  showEventUpdatedToast,
} from "../utils";
import { useCalendarActions } from "./use-calendar-actions";

export function useEventOperations(onOperationComplete?: () => void) {
  const { events, createEvent, updateEvent, deleteEvent } =
    useCalendarActions();

  const handleEventSave = useCallback(
    (event: CalendarEvent) => {
      if (event.id) {
        updateEvent(event);
        showEventUpdatedToast(event);
      } else {
        const eventWithId = { ...event, id: generateEventId() };
        createEvent({
          ...eventWithId,
          calendarId: CALENDAR_CONFIG.DEFAULT_CALENDAR_ID,
        });
        showEventAddedToast(eventWithId);
      }
      onOperationComplete?.();
    },
    [createEvent, onOperationComplete, updateEvent],
  );

  const handleEventDelete = useCallback(
    (eventId: string) => {
      const deletedEvent = events.find((e) => e.id === eventId);

      if (!deletedEvent) {
        console.error(`Event with id ${eventId} not found`);
        return;
      }

      deleteEvent({
        accountId: deletedEvent.accountId,
        calendarId: deletedEvent.calendarId,
        eventId,
      });
      showEventDeletedToast(deletedEvent);
      onOperationComplete?.();
    },
    [events, deleteEvent, onOperationComplete],
  );

  const handleEventMove = useCallback(
    (updatedEvent: CalendarEvent) => {
      updateEvent(updatedEvent);
      showEventMovedToast(updatedEvent);
    },
    [updateEvent],
  );

  return {
    events,
    handleEventSave,
    handleEventDelete,
    handleEventMove,
  };
}
