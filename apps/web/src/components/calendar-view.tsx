"use client";

import { useMemo } from "react";
import { addDays, subDays } from "date-fns";
import { EventCalendar, type CalendarEvent, type EventColor } from "@/components/event-calendar";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { dateHelpers } from "@/lib/date-helpers";

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

export function CalendarView({ className }: CalendarViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const timeMin = useMemo(() => subDays(new Date(), CALENDAR_CONFIG.TIME_RANGE_DAYS_PAST).toISOString(), []);
  const timeMax = useMemo(() => addDays(new Date(), CALENDAR_CONFIG.TIME_RANGE_DAYS_FUTURE).toISOString(), []);

  const eventsQueryKey = useMemo(() => trpc.events.list.queryOptions({ timeMin, timeMax }).queryKey, [trpc.events.list, timeMin, timeMax]);

  const { data } = useQuery(
    trpc.events.list.queryOptions({
      timeMin,
      timeMax,
    })
  );

  const transformedEvents = useMemo(() => {
    if (!data?.events) return [];

    return data.events.map((event): CalendarEvent => {
      const startDate = new Date(event.start);
      const endDate = dateHelpers.adjustEndDateForDisplay(startDate, new Date(event.end), event.allDay);

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start: startDate,
        end: endDate,
        allDay: event.allDay,
        color: event.colorId ? colorMap[event.colorId] || "sky" : "sky",
        location: event.location,
      };
    });
  }, [data]);

  const { mutate: createEvent, isPending: isCreating } = useMutation({
    ...trpc.events.create.mutationOptions(),
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousEvents = queryClient.getQueryData(eventsQueryKey);

      queryClient.setQueryData(eventsQueryKey, (old: any) => {
        if (!old) return old;

        const tempEvent = {
          id: `temp-${Date.now()}`,
          title: newEvent.title,
          description: newEvent.description,
          start: newEvent.start,
          end: newEvent.end,
          allDay: newEvent.allDay || false,
          location: newEvent.location,
          colorId: "1",
        };

        return {
          ...old,
          events: [...(old.events || []), tempEvent].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
        };
      });

      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(eventsQueryKey, context.previousEvents);
      }
    },
    onSuccess: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    ...trpc.events.update.mutationOptions(),
    onMutate: async (updatedEvent) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousEvents = queryClient.getQueryData(eventsQueryKey);

      queryClient.setQueryData(eventsQueryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          events: old.events
            .map((event: any) =>
              event.id === updatedEvent.eventId
                ? {
                    ...event,
                    title: updatedEvent.title ?? event.title,
                    description: updatedEvent.description ?? event.description,
                    start: updatedEvent.start ?? event.start,
                    end: updatedEvent.end ?? event.end,
                    allDay: updatedEvent.allDay ?? event.allDay,
                    location: updatedEvent.location ?? event.location,
                  }
                : event
            )
            .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime()),
        };
      });

      return { previousEvents };
    },
    onError: (err, updatedEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(eventsQueryKey, context.previousEvents);
      }
    },
    onSuccess: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    ...trpc.events.delete.mutationOptions(),
    onMutate: async ({ eventId }) => {
      await queryClient.cancelQueries({ queryKey: eventsQueryKey });

      const previousEvents = queryClient.getQueryData(eventsQueryKey);

      queryClient.setQueryData(eventsQueryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          events: old.events.filter((event: any) => event.id !== eventId),
        };
      });

      return { previousEvents };
    },
    onError: (err, deletedEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(eventsQueryKey, context.previousEvents);
      }
    },
    onSuccess: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKey });
    },
  });

  const handleEventAdd = (event: CalendarEvent) => {
    createEvent({
      calendarId: CALENDAR_CONFIG.DEFAULT_CALENDAR_ID,
      title: event.title,
      start: dateHelpers.formatDateForAPI(event.start, event.allDay || false),
      end: dateHelpers.formatDateForAPI(event.end, event.allDay || false),
      allDay: event.allDay,
      description: event.description,
      location: event.location,
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    updateEvent({
      calendarId: CALENDAR_CONFIG.DEFAULT_CALENDAR_ID,
      eventId: updatedEvent.id,
      title: updatedEvent.title,
      start: dateHelpers.formatDateForAPI(updatedEvent.start, updatedEvent.allDay || false),
      end: dateHelpers.formatDateForAPI(updatedEvent.end, updatedEvent.allDay || false),
      allDay: updatedEvent.allDay,
      description: updatedEvent.description,
      location: updatedEvent.location,
    });
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent({
      calendarId: CALENDAR_CONFIG.DEFAULT_CALENDAR_ID,
      eventId: eventId,
    });
  };

  return (
    <EventCalendar
      events={transformedEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      className={className}
    />
  );
}
