"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { toast } from "sonner";

import {
  EventCalendar,
  type CalendarEvent,
  type EventColor,
} from "@/components/event-calendar";
import { dateHelpers } from "@/lib/date-helpers";
import { RouterOutputs } from "@/lib/trpc";
import { useTRPC } from "@/lib/trpc/client";

interface CalendarViewProps {
  className?: string;
}

const colorMap: Record<string, EventColor> = {
  "1": "sky",
  "2": "emerald",
  "3": "violet",
  "4": "rose",
  "5": "amber",
  "6": "orange",
  "7": "sky",
  "8": "violet",
  "9": "sky",
  "10": "emerald",
  "11": "rose",
};

const CALENDAR_CONFIG = {
  TIME_RANGE_DAYS_PAST: 30,
  TIME_RANGE_DAYS_FUTURE: 60,
  DEFAULT_CALENDAR_ID: "primary",
};

type Event = RouterOutputs["events"]["list"]["events"][number];

function useCalendarActions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: defaultConnectionData } = useQuery(
    trpc.connections.getDefault.queryOptions(),
  );

  const timeMin = useMemo(
    () =>
      subDays(new Date(), CALENDAR_CONFIG.TIME_RANGE_DAYS_PAST).toISOString(),
    [],
  );
  const timeMax = useMemo(
    () =>
      addDays(new Date(), CALENDAR_CONFIG.TIME_RANGE_DAYS_FUTURE).toISOString(),
    [],
  );

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
      const startDate = new Date(event.start.dateTime);
      const endDate = dateHelpers.adjustEndDateForDisplay(
        startDate,
        new Date(event.end.dateTime),
        event.allDay ?? false,
      );

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: "UTC",
        },
        allDay: event.allDay,
        color: event.color ? colorMap[event.color] || "sky" : "sky",
        location: event.location,
        calendarId: event.calendarId,
        connectionId: event.connectionId,
        accountId: event.accountId,
        accountName: event.accountName,
        providerId: event.providerId,
      };
    });
  }, [data]);

  const { mutate: createEvent, isPending: isCreating } = useMutation(
    trpc.events.create.mutationOptions({
      onMutate: async (newEvent) => {
        if (!defaultConnectionData) {
          toast.error("No default connection available, sign in again.");
          return;
        }

        await queryClient.cancelQueries({ queryKey: eventsQueryKey });

        const previousEvents = queryClient.getQueryData(eventsQueryKey);

        queryClient.setQueryData(eventsQueryKey, (old) => {
          if (!old) return old;

          const tempEvent: Event = {
            id: `temp-${Date.now()}`,
            title: newEvent.title,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
            allDay: newEvent.allDay || false,
            location: newEvent.location,
            color: newEvent.color,
            status: undefined,
            htmlLink: undefined,
            calendarId: newEvent.calendarId,
            connectionId: newEvent.connectionId,
            providerId: defaultConnectionData.connection.providerId,
            accountId: defaultConnectionData.connection.accountId,
            accountName: defaultConnectionData.connection.email,
          };

          return {
            ...old,
            events: [...(old.events || []), tempEvent].sort(
              (a, b) =>
                new Date(a.start.dateTime).getTime() -
                new Date(b.start.dateTime).getTime(),
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
                event.id === updatedEvent.eventId
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
                      accountName: event.accountName,
                      providerId: event.providerId,
                      calendarId: event.calendarId,
                      connectionId: event.connectionId,
                    }
                  : event,
              )
              .sort(
                (a, b) =>
                  new Date(a.start.dateTime).getTime() -
                  new Date(b.start.dateTime).getTime(),
              ),
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

function useDefaultConnection() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.connections.getDefault.queryOptions());

  return data?.connection;
}

export function CalendarView({ className }: CalendarViewProps) {
  const defaultConnection = useDefaultConnection();

  const { events, createEvent, updateEvent, deleteEvent } =
    useCalendarActions();

  const handleEventAdd = (event: CalendarEvent) => {
    if (!defaultConnection) {
      toast.error("No default connection available, sign in again.");
      return;
    }

    createEvent({
      connectionId: defaultConnection?.id,
      calendarId: CALENDAR_CONFIG.DEFAULT_CALENDAR_ID,
      title: event.title,
      start: {
        dateTime: dateHelpers.formatDateForAPI(
          event.start.dateTime,
          event.allDay || false,
        ),
        timeZone: "UTC",
      },
      end: {
        dateTime: dateHelpers.formatDateForAPI(
          event.end.dateTime,
          event.allDay || false,
        ),
        timeZone: "UTC",
      },
      allDay: event.allDay,
      description: event.description,
      location: event.location,
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    updateEvent({
      connectionId: updatedEvent.connectionId,
      calendarId: updatedEvent.calendarId,
      eventId: updatedEvent.id,
      title: updatedEvent.title,
      start: {
        dateTime: dateHelpers.formatDateForAPI(
          updatedEvent.start.dateTime,
          updatedEvent.allDay || false,
        ),
        timeZone: "UTC",
      },
      end: {
        dateTime: dateHelpers.formatDateForAPI(
          updatedEvent.end.dateTime,
          updatedEvent.allDay || false,
        ),
        timeZone: "UTC",
      },
      allDay: updatedEvent.allDay,
      description: updatedEvent.description,
      location: updatedEvent.location,
    });
  };

  const handleEventDelete = (eventId: string) => {
    // Find the event to get its connectionId
    const eventToDelete = events.find((event) => event.id === eventId);
    if (!eventToDelete) {
      console.error(`Event with id ${eventId} not found`);
      return;
    }

    deleteEvent({
      connectionId: eventToDelete.connectionId,
      calendarId: eventToDelete.calendarId,
      eventId: eventId,
    });
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      className={className}
    />
  );
}
