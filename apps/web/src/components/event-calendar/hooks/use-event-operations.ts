import { useCallback, useMemo, useOptimistic, useTransition } from "react";
import { useAtom } from "jotai";
import * as R from "remeda";

import { compareTemporal } from "@repo/temporal";

import { SelectedEvents, selectedEventsAtom } from "@/atoms";
import { DraftEvent } from "@/lib/interfaces";
import { CalendarEvent } from "../types";
import {
  showEventAddedToast,
  showEventDeletedToast,
  showEventMovedToast,
  showEventUpdatedToast,
} from "../utils";
import { useCalendar } from "./use-calendar-actions";

// Types for optimistic reducer actions
type OptimisticAction =
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
      if (action.type === "delete") {
        return state.filter((e) => e.id !== action.eventId);
      }

      const withoutEvent = state.filter((e) => e.id !== action.event.id);

      // Remove old instance, re-insert respecting sort order
      const insertIdx = R.sortedIndexWith(
        withoutEvent,
        (item) => compareTemporal(item.start, action.event.start) < 0,
      );

      return [
        ...withoutEvent.slice(0, insertIdx),
        { ...action.event },
        ...withoutEvent.slice(insertIdx),
      ];
    },
  );

  const handleEventSave = useCallback(
    (event: CalendarEvent) => {
      const exists = optimisticEvents.find((e) => e.id === event.id);

      if (!exists) {
        startTransition(() => applyOptimistic({ type: "update", event }));

        createEvent(event);
        showEventAddedToast(event);
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
      optimisticEvents,
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
