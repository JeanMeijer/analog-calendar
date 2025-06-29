import { Temporal } from "temporal-polyfill";

import type { CreateEventInput, UpdateEventInput } from "../schemas/events";

export type TemporalDate =
  | Temporal.PlainDate
  | Temporal.Instant
  | Temporal.ZonedDateTime;

export interface Calendar {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  timeZone?: string;
  primary: boolean;
  accountId: string;
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime;
  allDay?: boolean;
  location?: string;
  status?: string;
  attendees?: Attendee[];
  url?: string;
  color?: string;
  providerId: string;
  accountId: string;
  calendarId: string;
  metadata?: Record<string, unknown>;
}

export interface Attendee {
  id?: string;
  email?: string;
  name?: string;
  status: "accepted" | "tentative" | "declined" | "unknown";
  type: "required" | "optional" | "resource";
  comment?: string; // Google only
  additionalGuests?: number; // Google only
}

export type AttendeeStatus = Attendee["status"];

export interface CalendarProvider {
  providerId: "google" | "microsoft";
  calendars(): Promise<Calendar[]>;
  createCalendar(
    calendar: Omit<Calendar, "id" | "providerId">,
  ): Promise<Calendar>;
  updateCalendar(
    calendarId: string,
    calendar: Partial<Calendar>,
  ): Promise<Calendar>;
  deleteCalendar(calendarId: string): Promise<void>;
  events(
    calendarId: string,
    timeMin: Temporal.ZonedDateTime,
    timeMax: Temporal.ZonedDateTime,
  ): Promise<CalendarEvent[]>;
  createEvent(
    calendarId: string,
    event: CreateEventInput,
  ): Promise<CalendarEvent>;
  updateEvent(
    calendarId: string,
    eventId: string,
    event: UpdateEventInput,
  ): Promise<CalendarEvent>;
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
  responseToEvent(
    calendarId: string,
    eventId: string,
    response: {
      status: "accepted" | "tentative" | "declined";
      comment?: string;
    },
  ): Promise<void>;
}
