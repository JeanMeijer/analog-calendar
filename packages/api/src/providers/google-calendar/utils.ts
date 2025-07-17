import { detectMeetingLink } from "@analog/meeting-links";
import { Temporal } from "temporal-polyfill";

import { CreateEventInput, UpdateEventInput } from "../../schemas/events";
import {
  Attendee,
  AttendeeStatus,
  Calendar,
  CalendarEvent,
  Conference,
} from "../interfaces";
import {
  GoogleCalendarCalendarListEntry,
  GoogleCalendarDate,
  GoogleCalendarDateTime,
  GoogleCalendarEvent,
  GoogleCalendarEventAttendee,
  GoogleCalendarEventAttendeeResponseStatus,
  GoogleCalendarEventConferenceData,
  GoogleCalendarEventCreateParams,
} from "./interfaces";

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
    dateTime: value.toString({ timeZoneName: "never", offset: "auto" }),
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
  calendar: Calendar;
  accountId: string;
  event: GoogleCalendarEvent;
}

export function parseGoogleCalendarEvent({
  calendar,
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
    attendees: event.attendees?.map(parseGoogleCalendarAttendee) ?? [],
    url: event.htmlLink,
    providerId: "google",
    accountId,
    calendarId: calendar.id,
    readOnly: calendar.readOnly,
    conference: parseGoogleCalendarConferenceData(event),
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
    // conferenceData: event.conference
    //   ? toGoogleCalendarConferenceData(event.conference)
    //   : undefined,
    // Required when creating/updating events with conference data
    // ...(event.conference && { conferenceDataVersion: 1 }),
  };
}

function toJoinUrl(joinUrl: string) {
  try {
    const url = new URL(joinUrl);

    return url.hostname + url.pathname;
  } catch {
    return joinUrl;
  }
}
function toGoogleCalendarConferenceData(
  conference: Conference,
): GoogleCalendarEventConferenceData {
  const entryPoints: GoogleCalendarEventConferenceData["entryPoints"] = [];

  if (conference.joinUrl) {
    entryPoints.push({
      entryPointType: "video",
      uri: conference.joinUrl,
      ...(conference.meetingCode && {
        meetingCode: conference.meetingCode,
        accessCode: conference.meetingCode,
      }),
      ...(conference.password && {
        password: conference.password,
        passcode: conference.password,
      }),
      label: toJoinUrl(conference.joinUrl),
    });
  }

  if (conference.phoneNumbers?.length) {
    conference.phoneNumbers.forEach((phoneNumber) => {
      entryPoints.push({
        entryPointType: "phone",
        uri: phoneNumber.startsWith("tel:")
          ? phoneNumber
          : `tel:${phoneNumber}`,
        label: phoneNumber,
        ...(conference.meetingCode && {
          accessCode: conference.meetingCode,
          pin: conference.meetingCode,
        }),
      });
    });
  }

  // Default to Google Meet
  const conferenceSolutionType = conference.name
    ? conference.name.toLowerCase().includes("google")
      ? "hangoutsMeet"
      : "addOn"
    : "hangoutsMeet";

  return {
    conferenceId: conference.id,
    conferenceSolution: {
      name: conference.name ?? "Google Meet",
      key: {
        type: conferenceSolutionType,
      },
    },
    entryPoints: entryPoints.length > 0 ? entryPoints : undefined,
    ...(conference.extra && {
      parameters: {
        addOnParameters: {
          parameters: Object.fromEntries(
            Object.entries(conference.extra).map(([key, value]) => [
              key,
              String(value),
            ]),
          ),
        },
      },
    }),
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
    readOnly:
      entry.accessRole === "reader" || entry.accessRole === "freeBusyReader",

    providerId: "google",
    accountId,
    color: entry.backgroundColor,
  };
}

export function toGoogleCalendarAttendeeResponseStatus(
  status: AttendeeStatus,
): GoogleCalendarEventAttendeeResponseStatus {
  if (status === "unknown") {
    return "needsAction";
  }

  return status;
}

function parseGoogleCalendarAttendeeStatus(
  status: GoogleCalendarEventAttendeeResponseStatus,
): AttendeeStatus {
  if (status === "needsAction") {
    return "unknown";
  }

  return status;
}

function parseGoogleCalendarAttendeeType(
  attendee: GoogleCalendarEventAttendee,
): "required" | "optional" | "resource" {
  if (attendee.resource) {
    return "resource";
  }

  if (attendee.optional) {
    return "optional";
  }

  return "required";
}

function parseGoogleCalendarConferenceFallback(
  event: GoogleCalendarEvent,
): Conference | undefined {
  // Function to extract URLs from text using a comprehensive regex
  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s<>"'{}|\\^`\[\]]+/gi;
    return text.match(urlRegex) || [];
  };

  // Function to check if a URL is a meeting link
  const checkMeetingLink = (url: string): Conference | undefined => {
    const service = detectMeetingLink(url);
    if (service) {
      return {
        id: service.id,
        name: service.name,
        joinUrl: service.joinUrl,
        meetingCode: "",
      };
    }
    return undefined;
  };

  // 1. Check hangoutLink (legacy Google Meet)
  if (event.hangoutLink) {
    const service = checkMeetingLink(event.hangoutLink);

    if (service) {
      return service;
    }
  }

  // 2. Check description for meeting links
  if (event.description) {
    const urls = extractUrls(event.description);

    for (const url of urls) {
      const service = checkMeetingLink(url);

      if (service) {
        return service;
      }
    }
  }

  // 3. Check location field
  if (event.location) {
    const urls = extractUrls(event.location);

    for (const url of urls) {
      const service = checkMeetingLink(url);

      if (service) {
        return service;
      }
    }
  }

  // 4. Check source.url
  if (event.source?.url) {
    const service = checkMeetingLink(event.source.url);

    if (service) {
      return service;
    }
  }

  // 6. Check attachments
  if (event.attachments) {
    for (const attachment of event.attachments) {
      if (attachment.fileUrl) {
        const service = checkMeetingLink(attachment.fileUrl);
        if (service) return service;
      }
    }
  }

  // 7. Check gadget.link (legacy)
  if (event.gadget?.link) {
    const service = checkMeetingLink(event.gadget.link);
    if (service) return service;
  }

  return undefined;
}

function parseGoogleCalendarConferenceData(
  event: GoogleCalendarEvent,
): Conference | undefined {
  if (event.conferenceData?.entryPoints?.length) {
    const videoEntry = event.conferenceData.entryPoints.find(
      (e) => e.entryPointType === "video" && e.uri,
    );

    const phoneNumbers = event.conferenceData.entryPoints
      .filter((e) => e.entryPointType === "phone" && e.uri)
      .map((e) => e.uri as string);

    if (videoEntry?.uri) {
      const accessCode =
        videoEntry.meetingCode ?? videoEntry.passcode ?? videoEntry.password;

      return {
        id: event.conferenceData.conferenceId,
        name: event.conferenceData.conferenceSolution?.name ?? "Google Meet",
        joinUrl: videoEntry.uri,
        meetingCode: accessCode ?? "",
        phoneNumbers: phoneNumbers.length ? phoneNumbers : undefined,
        password: accessCode,
      };
    }
  }

  // If no official conference data, fall back to searching other fields
  return parseGoogleCalendarConferenceFallback(event);
}

export function parseGoogleCalendarAttendee(
  attendee: GoogleCalendarEventAttendee,
): Attendee {
  return {
    id: attendee.id,
    email: attendee.email,
    name: attendee.displayName,
    status: parseGoogleCalendarAttendeeStatus(
      attendee.responseStatus as GoogleCalendarEventAttendeeResponseStatus,
    ),
    type: parseGoogleCalendarAttendeeType(attendee),
    additionalGuests: attendee.additionalGuests,
  };
}
