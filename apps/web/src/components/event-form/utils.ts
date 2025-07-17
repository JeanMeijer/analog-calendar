import { Temporal } from "temporal-polyfill";

import { CalendarSettings } from "@/atoms/calendar-settings";
import { Calendar, CalendarEvent, DraftEvent } from "@/lib/interfaces";
import { createEventId, roundTo15Minutes } from "@/lib/utils/calendar";
import { FormValues } from "./form";

interface CreateDefaultEvent {
  settings: CalendarSettings;
  defaultCalendar: Calendar;
}

export function createDefaultEvent({
  settings,
  defaultCalendar: calendar,
}: CreateDefaultEvent): FormValues {
  const timeZone = calendar?.timeZone ?? settings.defaultTimeZone;
  const now = Temporal.Now.zonedDateTimeISO(timeZone);

  const start = roundTo15Minutes(now);
  const duration = Temporal.Duration.from({
    minutes: settings.defaultEventDuration,
  });

  return {
    id: createEventId(),
    title: "",
    start,
    end: start.add(duration),
    description: "",
    isAllDay: false,
    repeat: {},
    attendees: [],
    calendar: {
      accountId: calendar.accountId,
      calendarId: calendar.id,
    },
    providerId: calendar.providerId,
  };
}

interface ToZonedDateTime {
  date: Temporal.ZonedDateTime | Temporal.Instant | Temporal.PlainDate;
  defaultTimeZone: string;
}

function toZonedDateTime({
  date,
  defaultTimeZone,
}: ToZonedDateTime): Temporal.ZonedDateTime {
  if (date instanceof Temporal.ZonedDateTime) {
    return date;
  }

  if (date instanceof Temporal.Instant) {
    return date.toZonedDateTimeISO(defaultTimeZone);
  }

  return date.toZonedDateTime(defaultTimeZone);
}

interface ParseDraftEventOptions {
  event: DraftEvent;
  defaultCalendar: Calendar;
  settings: CalendarSettings;
}

export function parseDraftEvent({
  event,
  defaultCalendar,
  settings,
}: ParseDraftEventOptions): FormValues {
  return {
    id: event?.id ?? createEventId(),
    title: event.title ?? "",
    start: toZonedDateTime({
      date: event.start,
      defaultTimeZone: defaultCalendar.timeZone ?? settings.defaultTimeZone,
    }),
    end: toZonedDateTime({
      date: event.end,
      defaultTimeZone: defaultCalendar.timeZone ?? settings.defaultTimeZone,
    }),
    description: event.description ?? "",
    isAllDay: event.allDay ?? false,
    repeat: {},
    attendees:
      event.attendees?.map((attendee) => ({
        email: attendee.email ?? "",
        status: attendee.status,
        type: attendee.type,
        name: attendee.name ?? "",
      })) ?? [],
    calendar: {
      accountId: event?.accountId ?? defaultCalendar.accountId,
      calendarId: event?.calendarId ?? defaultCalendar.id,
    },
    providerId: event?.providerId ?? defaultCalendar.providerId,
  };
}

interface ParseCalendarEventOptions {
  event: CalendarEvent;
  settings: CalendarSettings;
}

export function parseCalendarEvent({
  event,
  settings,
}: ParseCalendarEventOptions): FormValues {
  const start = toZonedDateTime({
    date: event.start,
    defaultTimeZone: settings.defaultTimeZone,
  });
  const end = toZonedDateTime({
    date: event.end,
    defaultTimeZone: settings.defaultTimeZone,
  });

  return {
    id: event.id,
    title: event.title ?? "",
    start: start,
    end: end,
    description: event.description ?? "",
    isAllDay: event.allDay ?? false,
    repeat: {},
    attendees:
      event.attendees?.map((attendee) => ({
        email: attendee.email ?? "",
        status: attendee.status,
        type: attendee.type,
        name: attendee.name ?? "",
      })) ?? [],
    calendar: {
      accountId: event.accountId ?? "",
      calendarId: event.calendarId ?? "",
    },
    providerId: event.providerId,
  };
}

interface ToCalendarEvent {
  values: FormValues;
  event?: CalendarEvent | DraftEvent;
  calendar?: Calendar;
}

export function toCalendarEvent({
  values,
  event,
  calendar,
}: ToCalendarEvent): CalendarEvent {
  return {
    ...event,
    id: event?.id ?? values.id,
    title: values.title,
    description: values.description,
    allDay: values.isAllDay,
    calendarId: values.calendar.calendarId,
    accountId: values.calendar.accountId,
    providerId: values.providerId,
    start: values.isAllDay ? values.start.toPlainDate() : values.start,
    end: values.isAllDay ? values.end.toPlainDate() : values.end,
    color: calendar?.color ?? undefined,
    readOnly: false,
  };
}
