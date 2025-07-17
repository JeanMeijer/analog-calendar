import { Temporal } from "temporal-polyfill";
import {
  convertIcsCalendar,
  convertIcsEvent,
  convertIcsTimezone,
  generateIcsCalendar,
  generateIcsEvent,
  generateIcsTimezone,
  type IcsAttendee,
  type IcsCalendar,
  type IcsDateObject,
  type IcsEvent,
  type IcsTimezone,
} from "ts-ics";

import type { Attendee, CalendarEvent } from "@repo/api/providers/interfaces";

function formatOffset(offset: string): string {
  return offset.replace(":", "");
}

function toDate(value: CalendarEvent["start"]): Date {
  if (value instanceof Temporal.PlainDate) {
    return new Date(value.toString());
  }

  if (value instanceof Temporal.Instant) {
    return new Date(value.epochMilliseconds);
  }

  return new Date(value.toInstant().epochMilliseconds);
}

function toTemporal(dateObj: IcsDateObject): CalendarEvent["start"] {
  if (dateObj.type === "DATE") {
    return Temporal.PlainDate.from(dateObj.date.toISOString().slice(0, 10));
  }

  if (dateObj.local) {
    const instant = Temporal.Instant.from(dateObj.date.toISOString());
    return instant.toZonedDateTimeISO(dateObj.local.timezone);
  }

  return Temporal.Instant.from(dateObj.date.toISOString());
}

function toAttendee(attendee: Attendee): IcsAttendee {
  return {
    email: attendee.email ?? "",
    ...(attendee.name && { name: attendee.name }),
    ...(attendee.status && {
      partstat:
        attendee.status === "accepted"
          ? "ACCEPTED"
          : attendee.status === "declined"
            ? "DECLINED"
            : attendee.status === "tentative"
              ? "TENTATIVE"
              : "NEEDS-ACTION",
    }),
    ...(attendee.type && {
      role:
        attendee.type === "optional"
          ? "OPT-PARTICIPANT"
          : attendee.type === "resource"
            ? "NON-PARTICIPANT"
            : "REQ-PARTICIPANT",
    }),
  };
}

function fromAttendee(attendee: IcsAttendee): Attendee {
  const status = attendee.partstat
    ? (attendee.partstat.toLowerCase() as Attendee["status"])
    : "unknown";
  let type: Attendee["type"] = "required";
  if (attendee.role === "OPT-PARTICIPANT") type = "optional";
  if (attendee.role === "NON-PARTICIPANT") type = "resource";

  return {
    email: attendee.email,
    name: attendee.name,
    status,
    type,
  };
}

function toIcsEvent(event: CalendarEvent): IcsEvent {
  const start: IcsDateObject = {
    date: toDate(event.start),
    type: event.allDay ? "DATE" : "DATE-TIME",
  };

  const end: IcsDateObject = {
    date: toDate(event.end),
    type: event.allDay ? "DATE" : "DATE-TIME",
  };

  if (!event.allDay) {
    if (event.start instanceof Temporal.ZonedDateTime) {
      start.local = {
        date: start.date,
        timezone: event.start.timeZoneId,
        tzoffset: formatOffset(event.start.offset),
      };
    }

    if (event.end instanceof Temporal.ZonedDateTime) {
      end.local = {
        date: end.date,
        timezone: event.end.timeZoneId,
        tzoffset: formatOffset(event.end.offset),
      };
    }
  }

  return {
    uid: event.id,
    summary: event.title ?? "",
    stamp: { date: new Date() },
    start,
    end,
    ...(event.description && { description: event.description }),
    ...(event.location && { location: event.location }),
    ...(event.url && { url: event.url }),
    ...(event.attendees &&
      event.attendees.length > 0 && {
        attendees: event.attendees.map(toAttendee),
      }),
  };
}

function fromIcsEvent(event: IcsEvent): CalendarEvent {
  return {
    id: event.uid,
    title: event.summary,
    description: event.description,
    start: toTemporal(event.start),
    end: toTemporal(event.end!),
    allDay: event.start.type === "DATE",
    location: event.location,
    status: event.status?.toLowerCase(),
    attendees: event.attendees?.map(fromAttendee) ?? [],
    url: event.url,
    color: undefined,
    readOnly: false,
    providerId: "ics",
    accountId: "",
    calendarId: "",
  };
}

export function exportEvent(event: CalendarEvent): string {
  return generateIcsEvent(toIcsEvent(event));
}

export function exportEvents(events: CalendarEvent[]): string {
  const calendar: IcsCalendar = {
    prodId: "@analog/ical",
    version: "2.0",
    events: events.map(toIcsEvent),
  };
  return generateIcsCalendar(calendar);
}

export function importEvent(ics: string): CalendarEvent {
  const event = convertIcsEvent(undefined, ics);
  return fromIcsEvent(event);
}

export function importEvents(ics: string): CalendarEvent[] {
  const calendar = convertIcsCalendar(undefined, ics);
  return calendar.events?.map(fromIcsEvent) ?? [];
}

export function exportTimezone(timezone: IcsTimezone): string {
  return generateIcsTimezone(timezone);
}

export function importTimezone(ics: string): IcsTimezone {
  return convertIcsTimezone(undefined, ics);
}

export function detectIcsType(ics: string): "calendar" | "event" {
  const normalizedIcs = ics.trim().toUpperCase();

  // Check if it contains VCALENDAR wrapper
  if (normalizedIcs.includes("BEGIN:VCALENDAR")) {
    return "calendar";
  }

  // Check if it starts with VEVENT (single event without calendar wrapper)
  if (normalizedIcs.includes("BEGIN:VEVENT")) {
    return "event";
  }

  // Default to calendar if unclear
  return "calendar";
}

export function importIcs(ics: string): {
  type: "calendar" | "event";
  events: CalendarEvent[];
} {
  const type = detectIcsType(ics);

  if (type === "calendar") {
    const events = importEvents(ics);
    return { type, events };
  } else {
    const event = importEvent(ics);
    return { type, events: [event] };
  }
}
