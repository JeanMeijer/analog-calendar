import { Temporal } from "temporal-polyfill";

import { CreateEventInput, UpdateEventInput } from "../../schemas/events";
import { Calendar, CalendarEvent } from "../interfaces";
import {
  GoogleCalendarCalendarListEntry,
  GoogleCalendarDate,
  GoogleCalendarDateTime,
  GoogleCalendarEvent,
  GoogleCalendarEventCreateParams,
} from "./interfaces";
import { log } from "console";

export function toGoogleCalendarDate(
  value: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime,
): GoogleCalendarDate | GoogleCalendarDateTime {
  if (value instanceof Temporal.PlainDate) {
    return {
      date: value.toString(),
    };
  }

  if (value instanceof Temporal.Instant) {
    return {
      dateTime: value.toString(),
    };
  }

  return {
    dateTime: value.toInstant().toString(),
    timeZone: value.timeZoneId,
  };
}

function parseDate({ date }: GoogleCalendarDate) {
  return Temporal.PlainDate.from(date);
}

function parseDateTime({ dateTime, timeZone }: GoogleCalendarDateTime) {
  const instant = Temporal.Instant.from(dateTime);

  if (!timeZone) {
    return instant;
  }

  return instant.toZonedDateTimeISO(timeZone);
}

interface ParsedGoogleCalendarEventOptions {
  calendarId: string;
  accountId: string;
  event: GoogleCalendarEvent;
}

export function parseGoogleCalendarEvent({
  calendarId,
  accountId,
  event,
}: ParsedGoogleCalendarEventOptions): CalendarEvent {
  const isAllDay = !event.start?.dateTime;

  return {
    // ID should always be present if not defined Google Calendar will generate one
    id: event.id!,
    title: event.summary!,
    description: event.description,
    start: isAllDay
      ? parseDate(event.start as GoogleCalendarDate)
      : parseDateTime(event.start as GoogleCalendarDateTime),
    end: isAllDay
      ? parseDate(event.end as GoogleCalendarDate)
      : parseDateTime(event.end as GoogleCalendarDateTime),
    allDay: isAllDay,
    location: event.location,
    status: event.status,
    url: event.htmlLink,
    providerId: "google",
    accountId,
    calendarId,
  };
}

export function toGoogleCalendarEvent(
  event: CreateEventInput | UpdateEventInput,
): GoogleCalendarEventCreateParams {
  return {
    ...("id" in event ? { id: event.id } : {}),
    summary: event.title,
    description: event.description,
    location: event.location,
    start: toGoogleCalendarDate(event.start),
    end: toGoogleCalendarDate(event.end),
    recurrence: toGoogleCalendarRecurrenceOptions(event.recurrence),
  };
}

interface ParsedGoogleCalendarCalendarListEntryOptions {
  accountId: string;
  entry: GoogleCalendarCalendarListEntry;
}

export function parseGoogleCalendarCalendarListEntry({
  accountId,
  entry,
}: ParsedGoogleCalendarCalendarListEntryOptions): Calendar {
  if (!entry.id) {
    throw new Error("Calendar ID is missing");
  }

  return {
    id: entry.id,
    name: entry.summaryOverride ?? entry.summary!,
    description: entry.description,
    // location: entry.location,
    timeZone: entry.timeZone,
    primary: entry.primary!,
    // readOnly: entry.accessRole === "reader",

    providerId: "google",
    accountId,
  };
}


export function toGoogleCalendarRecurrenceOptions(
  recurrence?: {
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  interval?: number;
  count?: number;
  until?: Temporal.PlainDate | Temporal.ZonedDateTime | Temporal.Instant;
  byDay?: ("SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA")[];
  byMonth?: number[];
  byMonthDay?: number[];
  byYearDay?: number[];
  byWeekNo?: number[];
  byHour?: number[];
  byMinute?: number[];
  bySecond?: number[];
  }
): string[]{
  console.log(`toGoogleCalendarRecurrenceOptions called with recurrence: ${JSON.stringify(recurrence)}`);
  if (!recurrence) {
    return [];
  }

  let formatedUntil: string | undefined;
  if (recurrence.until) {
    if (recurrence.until instanceof Temporal.PlainDate) {
      formatedUntil = recurrence.until.toString().replace(/-/g, "");
    } else if (recurrence.until instanceof Temporal.ZonedDateTime) {
      formatedUntil = recurrence.until.toInstant().toString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    } else if (recurrence.until instanceof Temporal.Instant) {
      formatedUntil = recurrence.until.toString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    }
  }

  // Google Calendar expects a single string for recurrence rules
  let rule = ["RRULE:" + [
    `FREQ=${recurrence.frequency?.toUpperCase() || "DAILY"}`,
    `INTERVAL=${recurrence.interval || 1}`,
    recurrence.count ? `COUNT=${recurrence.count}` : "",
    recurrence.until ? `UNTIL=${formatedUntil}` : "", 
    recurrence.byDay ? `BYDAY=${recurrence.byDay.join(",")}` : "",
    recurrence.byMonth ? `BYMONTH=${recurrence.byMonth.join(",")}` : "",
    recurrence.byMonthDay ? `BYMONTHDAY=${recurrence.byMonthDay.join(",")}` : "",
    recurrence.byYearDay ? `BYYEARDAY=${recurrence.byYearDay.join(",")}` : "",
    recurrence.byWeekNo ? `BYWEEKNO=${recurrence.byWeekNo.join(",")}` : "",
    recurrence.byHour ? `BYHOUR=${recurrence.byHour.join(",")}` : "",
    recurrence.byMinute ? `BYMINUTE=${recurrence.byMinute.join(",")}` : "",
    recurrence.bySecond ? `BYSECOND=${recurrence.bySecond.join(",")}` : "",
  ].filter(Boolean).join(";")];
  console.log(`Generated recurrence rule: ${rule}`);
  return rule;
}