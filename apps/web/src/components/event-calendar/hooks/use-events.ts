import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as R from "remeda";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import {
  compareTemporal,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
} from "@repo/temporal";

import { useCalendarSettings } from "@/atoms";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useTRPC } from "@/lib/trpc/client";

const TIME_RANGE_DAYS_PAST = 30;
const TIME_RANGE_DAYS_FUTURE = 30;

function insertIntoSorted<T>(
  array: T[],
  item: T,
  predicate: (value: T, index: number, data: readonly T[]) => boolean,
) {
  const index = R.sortedIndexWith(array, predicate);
  return [...array.slice(0, index), item, ...array.slice(index)];
}

export function useEvents() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { currentDate } = useCalendarState();

  const { defaultTimeZone, weekStartsOn } = useCalendarSettings();

  const timeMin = useMemo(() => {
    const base = Temporal.PlainDate.from(
      currentDate.toISOString().split("T")[0]!,
    )
      .subtract({
        days: TIME_RANGE_DAYS_PAST,
      })
      .toZonedDateTime({
        timeZone: defaultTimeZone,
      });

    const start = startOfWeek({
      value: base,
      timeZone: defaultTimeZone,
      weekStartsOn,
    });

    return startOfDay({
      value: start,
      timeZone: defaultTimeZone,
    });
  }, [defaultTimeZone, currentDate, weekStartsOn]);

  const timeMax = useMemo(() => {
    const base = Temporal.PlainDate.from(
      currentDate.toISOString().split("T")[0]!,
    )
      .add({
        days: TIME_RANGE_DAYS_FUTURE,
      })
      .toZonedDateTime({
        timeZone: defaultTimeZone,
      });

    const start = endOfWeek({
      value: base,
      timeZone: defaultTimeZone,
      weekStartsOn,
    });

    return endOfDay({
      value: start,
      timeZone: defaultTimeZone,
    });
  }, [defaultTimeZone, currentDate, weekStartsOn]);

  const eventsQueryKey = useMemo(
    () =>
      trpc.events.list.queryOptions({ timeMin, timeMax, defaultTimeZone })
        .queryKey,
    [trpc.events.list, timeMin, timeMax, defaultTimeZone],
  );

  const query = useQuery(
    trpc.events.list.queryOptions({
      timeMin,
      timeMax,
      defaultTimeZone,
    }),
  );

  const events = useMemo(() => {
    if (!query.data?.events) return [];

    return query.data.events;
  }, [query.data]);

  const createMutation = useMutation(
    trpc.events.create.mutationOptions({
      onMutate: async (newEvent) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (prev) => {
          if (!prev) {
            return undefined;
          }

          const events = insertIntoSorted(
            prev.events || [],
            newEvent,
            (a) => compareTemporal(a.start, newEvent.start) < 0,
          );

          return {
            ...prev,
            events,
          };
        });

        return { previousEvents };
      },
      onError: (err, _, context) => {
        toast.error(err.message);

        if (context?.previousEvents) {
          queryClient.setQueryData(eventsQueryKey, context.previousEvents);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.events.update.mutationOptions({
      onMutate: async (updatedEvent) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (prev) => {
          if (!prev) {
            return prev;
          }

          const withoutEvent = prev.events.filter(
            (e) => e.id !== updatedEvent.id,
          );

          const events = insertIntoSorted(
            withoutEvent,
            updatedEvent,
            (a) => compareTemporal(a.start, updatedEvent.start) < 0,
          );

          return {
            ...prev,
            events,
          };
        });

        return { previousEvents };
      },
      onError: (error, _, context) => {
        toast.error(error.message);

        if (context?.previousEvents) {
          queryClient.setQueryData(eventsQueryKey, context.previousEvents);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.events.delete.mutationOptions({
      onMutate: async ({ eventId }) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            events: prev.events.filter((event) => event.id !== eventId),
          };
        });

        return { previousEvents };
      },
      onError: (error, _, context) => {
        toast.error(error.message);

        if (context?.previousEvents) {
          queryClient.setQueryData(eventsQueryKey, context.previousEvents);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  return {
    events,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
