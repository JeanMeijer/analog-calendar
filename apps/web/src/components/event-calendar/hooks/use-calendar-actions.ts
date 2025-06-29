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
import { RouterOutputs } from "@/lib/trpc";
import { useTRPC } from "@/lib/trpc/client";

type Event = RouterOutputs["events"]["list"]["events"][number];

export function useCalendarActions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { currentDate } = useCalendarState();

  const { data: defaultAccountData } = useQuery(
    trpc.accounts.getDefault.queryOptions(),
  );

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
        if (!defaultAccountData) {
          toast.error("No default account available, sign in again.");
          return;
        }

        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (old) => {
          if (!old) return old;

          const tempEvent: Event = {
            id: `temp-${Date.now()}`,
            title: newEvent.title!,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
            allDay: newEvent.allDay ?? false,
            location: newEvent.location,
            color: newEvent.color,
            status: undefined,
            url: undefined,
            calendarId: newEvent.calendarId,
            providerId: defaultAccountData.account.providerId,
            accountId: defaultAccountData.account.id,
          };

          return {
            ...old,
            events: [...(old.events || []), tempEvent].sort(
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
        // TODO: error message

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

        queryClient.setQueryData(eventsQueryKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            events: old.events
              .map((event) =>
                event.id === updatedEvent.id
                  ? {
                      ...event,
                      title: updatedEvent.title ?? event.title,
                      description:
                        updatedEvent.description ?? event.description,
                      start: updatedEvent.start ?? event.start,
                      end: updatedEvent.end ?? event.end,
                      allDay: updatedEvent.allDay ?? event.allDay,
                      location: updatedEvent.location ?? event.location,
                      accountId: event.accountId,
                      providerId: event.providerId,
                      calendarId: event.calendarId,
                    }
                  : event,
              )
              .sort((a, b) => compareTemporal(a.start, b.start)),
          };
        });

        return { previousEvents };
      },
      onError: (error, _, context) => {
        // TODO: error message

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

        queryClient.setQueryData(eventsQueryKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            events: old.events.filter((event) => event.id !== eventId),
          };
        });

        return { previousEvents };
      },
      onError: (error, _, context) => {
        // TODO: error message

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
