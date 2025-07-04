import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useTransition,
} from "react";
import { useAtom } from "jotai";
import * as R from "remeda";

import { compareTemporal } from "@repo/temporal";

import { SelectedEvents, selectedEventsAtom } from "@/atoms";
import { DraftEvent } from "@/lib/interfaces";
import { CalendarEvent } from "../types";
import {
  generateEventId,
  showEventAddedToast,
  showEventDeletedToast,
  showEventMovedToast,
  showEventUpdatedToast,
} from "../utils";
import { useCalendar } from "./use-calendar-actions";

// Types for optimistic reducer actions
type OptimisticAction =
  | { type: "add"; event: CalendarEvent }
  | { type: "update"; event: CalendarEvent }
  | { type: "delete"; eventId: string };

export function useEventOperations(onOperationComplete?: () => void) {
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();
  const [selectedEvents, setSelectedEvents] = useAtom(selectedEventsAtom);

  // Transition state for concurrent UI feedback
  const [isPending, startTransition] = useTransition();

  // Optimistic state handling to reflect changes instantly in the UI
  const [optimisticEvents, applyOptimistic] = useOptimistic(
    events,
    (state: CalendarEvent[], action: OptimisticAction) => {
      switch (action.type) {
        case "add": {
          // Find correct insertion point (binary-search) to keep list sorted chronologically
          const insertIdx = R.sortedIndexWith(
            state,
            (item) => compareTemporal(item.start, action.event.start) < 0,
          );

          return [
            ...state.slice(0, insertIdx),
            action.event,
            ...state.slice(insertIdx),
          ];
        }
        case "update": {
          // Remove old instance, re-insert respecting sort order
          const withoutOld = state.filter((evt) => evt.id !== action.event.id);
          const insertIdx = R.sortedIndexWith(
            withoutOld,
            (item) => compareTemporal(item.start, action.event.start) < 0,
          );
          return [
            ...withoutOld.slice(0, insertIdx),
            { ...action.event },
            ...withoutOld.slice(insertIdx),
          ];
        }
        case "delete": {
          return state.filter((evt) => evt.id !== action.eventId);
        }
        default:
          return state;
      }
    },
  );

  const handleEventSave = useCallback(
    (event: CalendarEvent) => {
      if (event.id.startsWith("draft-")) {
        const eventWithId = { ...event, id: generateEventId() };

        // Optimistically add event to UI
        startTransition(() =>
          applyOptimistic({ type: "add", event: eventWithId }),
        );

        createEvent({
          ...eventWithId,
        });
        showEventAddedToast(eventWithId);
        onOperationComplete?.();
        return;
      }

      // Optimistically update UI
      startTransition(() => applyOptimistic({ type: "update", event }));

      updateEvent(event);
      showEventUpdatedToast(event);

      onOperationComplete?.();
    },
    [
      applyOptimistic,
      createEvent,
      onOperationComplete,
      startTransition,
      updateEvent,
    ],
  );

  const handleEventDelete = useCallback(
    (eventId: string) => {
      const deletedEvent = optimisticEvents.find((e) => e.id === eventId);

      if (!deletedEvent) {
        console.error(`Event with id ${eventId} not found`);
        return;
      }

      // Remove from selected events first if it's selected
      setSelectedEvents((prev) => prev.filter((e) => e.id !== eventId));

      // Optimistically remove event from UI
      startTransition(() => applyOptimistic({ type: "delete", eventId }));

      deleteEvent({
        accountId: deletedEvent.accountId,
        calendarId: deletedEvent.calendarId,
        eventId,
      });
      showEventDeletedToast(deletedEvent);
      onOperationComplete?.();
    },
    [
      applyOptimistic,
      optimisticEvents,
      deleteEvent,
      onOperationComplete,
      startTransition,
      setSelectedEvents,
    ],
  );

  const handleEventMove = useCallback(
    (updatedEvent: CalendarEvent) => {
      // Optimistically move event in UI
      startTransition(() =>
        applyOptimistic({ type: "update", event: updatedEvent }),
      );

      updateEvent(updatedEvent);
      showEventMovedToast(updatedEvent);
    },
    [applyOptimistic, startTransition, updateEvent],
  );

  const handleEventSelect = useCallback(
    (event: CalendarEvent) => {
      setSelectedEvents([]);
      setSelectedEvents((prev) => {
        const filtered = prev.filter((e) => e.id !== event.id);
        return [event, ...filtered];
      });
    },
    [setSelectedEvents],
  );

  const handleEventCreate = useCallback(
    (draft: DraftEvent) => {
      setSelectedEvents([]);
      setSelectedEvents((prev) => [draft, ...prev]);
    },
    [setSelectedEvents],
  );

  const handleDialogClose = useCallback(() => {
    setSelectedEvents([]);
  }, [setSelectedEvents]);

  // Derive optimistic selected events from optimistic events - this ensures perfect sync
  const optimisticSelectedEvents = useMemo(() => {
    return selectedEvents.reduce<SelectedEvents>((acc, selectedEvent) => {
      const updatedEvent = optimisticEvents.find(
        (e) => e.id === selectedEvent.id,
      );

      acc.push(updatedEvent ?? selectedEvent);

      return acc;
    }, []);
  }, [optimisticEvents, selectedEvents]);

  return {
    events: optimisticEvents,
    selectedEvents: optimisticSelectedEvents,
    isPending,
    handleEventSave,
    handleEventDelete,
    handleEventMove,
    handleEventSelect,
    handleDialogClose,
    handleEventCreate,
  };
}
