import { detectMeetingLink } from "@analog/meeting-links";
import type {
  Calendar as MicrosoftCalendar,
  Event as MicrosoftEvent,
  Attendee as MicrosoftEventAttendee,
  ResponseStatus as MicrosoftEventAttendeeResponseStatus,
} from "@microsoft/microsoft-graph-types";
import { Temporal } from "temporal-polyfill";

import {
  CreateEventInput,
  MicrosoftEventMetadata,
  UpdateEventInput,
} from "../../schemas/events";
import type {
  Attendee,
  AttendeeStatus,
  Calendar,
  CalendarEvent,
  Conference,
} from "../interfaces";
import { mapWindowsToIanaTimeZone } from "./windows-timezones";

interface ToMicrosoftDateOptions {
  value: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime;
  originalTimeZone?: {
    raw: string;
    parsed?: string;
  };
}

export function toMicrosoftDate({
  value,
  originalTimeZone,
}: ToMicrosoftDateOptions) {
  if (value instanceof Temporal.PlainDate) {
    return {
      dateTime: value.toString(),
      timeZone: originalTimeZone?.raw ?? "UTC",
    };
  }

  // These events were created using another provider.
  if (value instanceof Temporal.Instant) {
    const dateTime = value
      .toZonedDateTimeISO("UTC")
      .toPlainDateTime()
      .toString();

    return {
      dateTime,
      timeZone: "UTC",
    };
  }

  return {
    dateTime: value.toInstant().toString(),
    timeZone:
      originalTimeZone?.parsed === value.timeZoneId
        ? originalTimeZone?.raw
        : value.timeZoneId,
  };
}

function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error("Time zones are not available in this environment");
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (error: unknown) {
    return false;
  }
}

function parseTimeZone(timeZone: string) {
  if (isValidTimeZone(timeZone)) {
    return timeZone;
  }

  return mapWindowsToIanaTimeZone(timeZone);
}

function parseDate(date: string) {
  return Temporal.PlainDate.from(date);
}

function parseDateTime(dateTime: string, timeZone: string) {
  const dt = Temporal.PlainDateTime.from(dateTime);

  return dt.toZonedDateTime(parseTimeZone(timeZone) ?? "UTC");
}

interface ParseMicrosoftEventOptions {
  accountId: string;
  calendar: Calendar;
  event: MicrosoftEvent;
}

export function parseMicrosoftEvent({
  accountId,
  calendar,
  event,
}: ParseMicrosoftEventOptions): CalendarEvent {
  const { start, end, isAllDay } = event;

  if (!start || !end) {
    throw new Error("Event start or end is missing");
  }

  return {
    id: event.id!,
    etag: event.changeKey ?? undefined,
    title: event.subject!,
    description: event.bodyPreview ?? undefined,
    start: isAllDay
      ? parseDate(start.dateTime!)
      : parseDateTime(start.dateTime!, start.timeZone!),
    end: isAllDay
      ? parseDate(end.dateTime!)
      : parseDateTime(end.dateTime!, end.timeZone!),
    allDay: isAllDay ?? false,
    location: event.location?.displayName ?? undefined,
    status: event.showAs ?? undefined,
    attendees: event.attendees?.map(parseMicrosoftAttendee) ?? [],
    url: event.webLink ?? undefined,
    color: undefined,
    providerId: "microsoft",
    accountId,
    calendarId: calendar.id,
    readOnly: calendar.readOnly,
    conference: parseMicrosoftConference(event),
    metadata: {
      ...(event.originalStartTimeZone
        ? {
            originalStartTimeZone: {
              raw: event.originalStartTimeZone,
              parsed: event.originalStartTimeZone
                ? parseTimeZone(event.originalStartTimeZone)
                : undefined,
            },
          }
        : {}),
      ...(event.originalEndTimeZone
        ? {
            originalEndTimeZone: {
              raw: event.originalEndTimeZone,
              parsed: event.originalEndTimeZone
                ? parseTimeZone(event.originalEndTimeZone)
                : undefined,
            },
          }
        : {}),
    },
  };
}

export function toMicrosoftEvent(
  event: CreateEventInput | UpdateEventInput,
): MicrosoftEvent {
  const metadata = event.metadata as MicrosoftEventMetadata | undefined;

  return {
    subject: event.title,
    body: event.description
      ? { contentType: "text", content: event.description }
      : undefined,
    start: toMicrosoftDate({
      value: event.start,
      originalTimeZone: metadata?.originalStartTimeZone,
    }),
    end: toMicrosoftDate({
      value: event.end,
      originalTimeZone: metadata?.originalEndTimeZone,
    }),
    isAllDay: event.allDay ?? false,
    location: event.location ? { displayName: event.location } : undefined,
    // ...(event.conference && {
    //   isOnlineMeeting: true,
    //   onlineMeeting: {
    //     conferenceId: event.conference.id,
    //     joinUrl: event.conference.joinUrl,
    //     phones: event.conference.phoneNumbers?.map((number) => ({
    //       number,
    //     })),
    //   },
    //   onlineMeetingProvider: "unknown",
    // }),
  };
}

interface ParseMicrosoftCalendarOptions {
  accountId: string;
  calendar: MicrosoftCalendar;
}

export function parseMicrosoftCalendar({
  accountId,
  calendar,
}: ParseMicrosoftCalendarOptions): Calendar {
  return {
    id: calendar.id as string,
    providerId: "microsoft",
    name: calendar.name as string,
    primary: calendar.isDefaultCalendar as boolean,
    accountId,
    color: calendar.hexColor as string,
    readOnly: !calendar.canEdit,
  };
}

export function calendarPath(calendarId: string) {
  return calendarId === "primary"
    ? "/me/calendar"
    : `/me/calendars/${calendarId}`;
}

function parseConferenceFallback(
  event: MicrosoftEvent,
): Conference | undefined {
  if (!event.location) {
    return undefined;
  }

  if (event.location.locationUri) {
    const service = detectMeetingLink(event.location.locationUri);

    if (service) {
      return service;
    }
  }

  if (!event.location.displayName) {
    return undefined;
  }

  const service = detectMeetingLink(event.location.displayName);

  if (!service) {
    return undefined;
  }

  return service;
}

function parseMicrosoftConference(
  event: MicrosoftEvent,
): Conference | undefined {
  const joinUrl = event.onlineMeeting?.joinUrl ?? event.onlineMeetingUrl;

  if (!joinUrl) {
    return parseConferenceFallback(event);
  }

  const phoneNumbers = event.onlineMeeting?.phones
    ?.map((p) => p.number)
    .filter((n): n is string => Boolean(n));

  return {
    id: event.onlineMeeting?.conferenceId ?? undefined,
    name:
      event.onlineMeetingProvider === "teamsForBusiness"
        ? "Microsoft Teams"
        : "Online Meeting",
    joinUrl,
    meetingCode: event.onlineMeeting?.conferenceId ?? undefined,
    phoneNumbers:
      phoneNumbers && phoneNumbers.length ? phoneNumbers : undefined,
  };
}

export function eventResponseStatusPath(
  status: "accepted" | "tentative" | "declined",
): "accept" | "tentativelyAccept" | "decline" {
  if (status === "accepted") {
    return `accept`;
  }

  if (status === "tentative") {
    return `tentativelyAccept`;
  }

  if (status === "declined") {
    return `decline`;
  }

  throw new Error("Invalid status");
}

function parseMicrosoftAttendeeStatus(
  status: MicrosoftEventAttendeeResponseStatus["response"],
): AttendeeStatus {
  if (
    status === "notResponded" ||
    status === "none" ||
    status === "organizer"
  ) {
    return "unknown";
  }

  if (status === "accepted") {
    return "accepted";
  }

  if (status === "tentativelyAccepted") {
    return "tentative";
  }

  if (status === "declined") {
    return "declined";
  }

  return "unknown";
}

export function parseMicrosoftAttendee(
  attendee: MicrosoftEventAttendee,
): Attendee {
  return {
    email: attendee.emailAddress?.address ?? undefined,
    name: attendee.emailAddress?.name ?? undefined,
    status: parseMicrosoftAttendeeStatus(attendee.status?.response),
    type: attendee.type!,
  };
}
