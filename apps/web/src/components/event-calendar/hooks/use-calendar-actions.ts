import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import {
  compareTemporal,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  toInstant,
} from "@repo/temporal";

import { useCalendarSettings } from "@/atoms";
import {
  CALENDAR_CONFIG,
  type CalendarEvent,
} from "@/components/event-calendar";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useTRPC } from "@/lib/trpc/client";

export function useCalendar() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { currentDate } = useCalendarState();

  const { defaultTimeZone, weekStartsOn } = useCalendarSettings();

  const timeMin = useMemo(() => {
    const base = Temporal.PlainDate.from(
      currentDate.toISOString().split("T")[0]!,
    )
      .subtract({
        days: CALENDAR_CONFIG.TIME_RANGE_DAYS_PAST,
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
        days: CALENDAR_CONFIG.TIME_RANGE_DAYS_FUTURE,
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
    () => trpc.events.list.queryOptions({ timeMin, timeMax }).queryKey,
    [trpc.events.list, timeMin, timeMax],
  );

  const { data } = useQuery(
    trpc.events.list.queryOptions({
      timeMin,
      timeMax,
    }),
  );

  const transformedEvents = useMemo(() => {
    if (!data?.events) return [];

    // if (selectedEvents.length === 0) {
    //   return events;
    // }
    //
    // setSelectedEvents(selectedEvents.reduce<CalendarEvent[]>((acc, event) => {
    //   const found = events.find((e) => e.id === event.id);
    //   if (found) {
    //     acc.push(found);
    //   }
    //   return acc;
    // }, []));

    return data.events.map((event): CalendarEvent => {
      return {
        ...event,
        start: event.start,
        end: event.end,
        color: event.color,
      };
    });
  }, [data]);

  const { mutate: createEvent, isPending: isCreating } = useMutation(
    trpc.events.create.mutationOptions({
      onMutate: async (newEvent) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (prev) => {
          if (!prev) {
            return undefined;
          }

          return {
            ...prev,
            events: [...(prev.events || []), newEvent].sort(
              (a, b) =>
                toInstant({ value: a.start, timeZone: "UTC" })
                  .epochMilliseconds -
                toInstant({ value: b.start, timeZone: "UTC" })
                  .epochMilliseconds,
            ),
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
      onSuccess: () => {},
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  const { mutate: updateEvent, isPending: isUpdating } = useMutation(
    trpc.events.update.mutationOptions({
      onMutate: async (updatedEvent) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            events: prev.events
              .map((event) =>
                event.id === updatedEvent.id
                  ? {
                      ...event,
                      ...updatedEvent,
                    }
                  : event,
              )
              .sort((a, b) => compareTemporal(a.start, b.start)),
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
      onSuccess: () => {},
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation(
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
      onSuccess: () => {},
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      },
    }),
  );

  return {
    events: transformedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
