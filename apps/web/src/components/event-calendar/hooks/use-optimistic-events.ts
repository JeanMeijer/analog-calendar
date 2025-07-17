import { useCallback, useMemo, useOptimistic, useTransition } from "react";
import { useAtom } from "jotai";
import * as R from "remeda";

import { compareTemporal } from "@repo/temporal";

import { SelectedEvents, selectedEventsAtom } from "@/atoms/selected-events";
import type { CalendarEvent, DraftEvent } from "@/lib/interfaces";
import { useEvents } from "./use-events";

export type Action =
  | { type: "draft"; event: DraftEvent }
  | { type: "update"; event: CalendarEvent }
  | { type: "select"; event: CalendarEvent }
  | { type: "unselect"; eventId?: string }
  | { type: "delete"; eventId: string };

export type OptimisticAction =
  | { type: "update"; event: CalendarEvent }
  | { type: "delete"; eventId: string };

export function useOptimisticEvents() {
  const { events, createMutation, updateMutation, deleteMutation } =
    useEvents();
  const [selectedEvents, setSelectedEvents] = useAtom(selectedEventsAtom);

  const [isPending, startTransition] = useTransition();

  const [optimisticEvents, applyOptimistic] = useOptimistic(
    events,
    (state: CalendarEvent[], action: OptimisticAction) => {
      if (action.type === "delete") {
        return state.filter((e) => e.id !== action.eventId);
      }

      const withoutEvent = state.filter((e) => e.id !== action.event.id);

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
      startTransition(() => applyOptimistic({ type: "update", event }));

      const exists = optimisticEvents.find((e) => e.id === event.id);

      if (!exists) {
        createMutation.mutate(event);
        return;
      }

      updateMutation.mutate(event);
    },
    [applyOptimistic, createMutation, optimisticEvents, updateMutation],
  );

  const asyncUpdateEvent = useCallback(
    async (event: CalendarEvent) => {
      startTransition(() => applyOptimistic({ type: "update", event }));

      const exists = optimisticEvents.find((e) => e.id === event.id);

      if (!exists) {
        await createMutation.mutateAsync(event);
        return;
      }

      await updateMutation.mutateAsync(event);
    },
    [applyOptimistic, createMutation, optimisticEvents, updateMutation],
  );

  const handleEventDelete = useCallback(
    (eventId: string) => {
      startTransition(() => applyOptimistic({ type: "delete", eventId }));

      const deletedEvent = optimisticEvents.find((e) => e.id === eventId);

      if (!deletedEvent) {
        console.error(`Event with id ${eventId} not found`);
        return;
      }

      // Remove from selected events first if it's selected
      setSelectedEvents((prev) => prev.filter((e) => e.id !== eventId));

      deleteMutation.mutate({
        accountId: deletedEvent.accountId,
        calendarId: deletedEvent.calendarId,
        eventId,
      });
    },
    [
      applyOptimistic,
      optimisticEvents,
      deleteMutation,
      startTransition,
      setSelectedEvents,
    ],
  );

  const dispatchAction = useCallback(
    (action: Action) => {
      if (action.type === "draft" || action.type === "select") {
        setSelectedEvents([action.event]);
      } else if (action.type === "unselect") {
        setSelectedEvents([]);
      } else if (action.type === "update") {
        handleEventSave(action.event);
      } else if (action.type === "delete") {
        handleEventDelete(action.eventId);
      }
    },
    [handleEventSave, handleEventDelete, setSelectedEvents],
  );

  const dispatchAsyncAction = useCallback(
    async (action: Action) => {
      if (action.type === "update") {
        await asyncUpdateEvent(action.event);
      }
    },
    [asyncUpdateEvent],
  );

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
    dispatchAction,
    dispatchAsyncAction,
  };
}
