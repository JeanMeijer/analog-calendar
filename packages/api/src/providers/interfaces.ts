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
}

/**
 * export const reccurrenceSchema = z.object({
   frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
   interval: z.number().int().min(1).default(1),
   count: z.number().int().min(1).optional(),
   until: zZonedDateTimeInstance.optional(),
   byDay: z.array(z.enum(["SU", "MO", "TU", "WE", "TH", "FR", "SA"])).optional(),
   byMonth: z.array(z.number().int().min(1).max(12)).optional(),
   byMonthDay: z.array(z.number().int().min(1).max(31)).optional(),
   byYearDay: z.array(z.number().int().min(1).max(366)).optional(),
   byWeekNo: z.array(z.number().int().min(1).max(53)).optional(),
   byHour: z.array(z.number().int().min(0).max(23)).optional(),
   byMinute: z.array(z.number().int().min(0).max(59)).optional(),
   bySecond: z.array(z.number().int().min(0).max(59)).optional(),
 }).partial().default({ frequency: "daily", interval: 1 });
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime;
  end: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime;
  allDay?: boolean;
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
  };
  location?: string;
  status?: string;
  url?: string;
  color?: string;
  providerId: string;
  accountId: string;
  calendarId: string;
}

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
}
