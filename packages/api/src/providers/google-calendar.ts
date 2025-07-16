import { Temporal } from "temporal-polyfill";

import { GoogleCalendar } from "@repo/google-calendar";

import { CALENDAR_DEFAULTS } from "../constants/calendar";
import { CreateEventInput, UpdateEventInput } from "../schemas/events";
import {
  parseGoogleCalendarCalendarListEntry,
  parseGoogleCalendarEvent,
  toGoogleCalendarAttendeeResponseStatus,
  toGoogleCalendarEvent,
} from "./google-calendar/utils";
import type { Calendar, CalendarEvent, CalendarProvider } from "./interfaces";
import { ProviderError } from "./utils";

interface GoogleCalendarProviderOptions {
  accessToken: string;
  accountId: string;
}

export class GoogleCalendarProvider implements CalendarProvider {
  public readonly providerId = "google" as const;
  public readonly accountId: string;
  private client: GoogleCalendar;

  constructor({ accessToken, accountId }: GoogleCalendarProviderOptions) {
    this.accountId = accountId;
    this.client = new GoogleCalendar({
      accessToken,
    });
  }

  async calendars(): Promise<Calendar[]> {
    return this.withErrorHandler("calendars", async () => {
      const { items } = await this.client.users.me.calendarList.list();

      if (!items) return [];

      return items.map((calendar) =>
        parseGoogleCalendarCalendarListEntry({
          accountId: this.accountId,
          entry: calendar,
        }),
      );
    });
  }

  async createCalendar(
    calendar: Omit<Calendar, "id" | "providerId">,
  ): Promise<Calendar> {
    return this.withErrorHandler("createCalendar", async () => {
      const createdCalendar = await this.client.calendars.create({
        summary: calendar.name,
      });

      return parseGoogleCalendarCalendarListEntry({
        accountId: this.accountId,
        entry: createdCalendar,
      });
    });
  }

  async updateCalendar(
    calendarId: string,
    calendar: Partial<Calendar>,
  ): Promise<Calendar> {
    return this.withErrorHandler("updateCalendar", async () => {
      const updatedCalendar = await this.client.calendars.update(calendarId, {
        summary: calendar.name,
      });

      return parseGoogleCalendarCalendarListEntry({
        accountId: this.accountId,
        entry: updatedCalendar,
      });
    });
  }

  async deleteCalendar(calendarId: string): Promise<void> {
    return this.withErrorHandler("deleteCalendar", async () => {
      await this.client.calendars.delete(calendarId);
    });
  }

  async events(
    calendar: Calendar,
    timeMin: Temporal.ZonedDateTime,
    timeMax: Temporal.ZonedDateTime,
  ): Promise<CalendarEvent[]> {
    return this.withErrorHandler("events", async () => {
      const { items } = await this.client.calendars.events.list(calendar.id, {
        timeMin: timeMin.withTimeZone("UTC").toInstant().toString(),
        timeMax: timeMax.withTimeZone("UTC").toInstant().toString(),
        singleEvents: CALENDAR_DEFAULTS.SINGLE_EVENTS,
        orderBy: CALENDAR_DEFAULTS.ORDER_BY,
        maxResults: CALENDAR_DEFAULTS.MAX_EVENTS_PER_CALENDAR,
      });

      return (
        items?.map((event) =>
          parseGoogleCalendarEvent({
            calendar,
            accountId: this.accountId,
            event,
          }),
        ) ?? []
      );
    });
  }

  async createEvent(
    calendar: Calendar,
    event: CreateEventInput,
  ): Promise<CalendarEvent> {
    return this.withErrorHandler("createEvent", async () => {
      const createdEvent = await this.client.calendars.events.create(
        calendar.id,
        toGoogleCalendarEvent(event),
      );

      return parseGoogleCalendarEvent({
        calendar,
        accountId: this.accountId,
        event: createdEvent,
      });
    });
  }

  async updateEvent(
    calendar: Calendar,
    eventId: string,
    event: UpdateEventInput,
  ): Promise<CalendarEvent> {
    return this.withErrorHandler("updateEvent", async () => {
      const existingEvent = await this.client.calendars.events.retrieve(
        eventId,
        {
          calendarId: calendar.id,
        },
      );

      const updatedEvent = await this.client.calendars.events.update(
        eventId,
        {
          ...existingEvent,
          calendarId: calendar.id,
          ...toGoogleCalendarEvent(event),
        },
        event.etag ? { headers: { "If-Match": event.etag } } : undefined,
      );

      return parseGoogleCalendarEvent({
        calendar,
        accountId: this.accountId,
        event: updatedEvent,
      });
    });
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    return this.withErrorHandler("deleteEvent", async () => {
      await this.client.calendars.events.delete(eventId, { calendarId });
    });
  }

  async acceptEvent(calendarId: string, eventId: string): Promise<void> {
    return this.withErrorHandler("acceptEvent", async () => {
      const event = await this.client.calendars.events.retrieve(eventId, {
        calendarId,
      });

      const attendees = event.attendees ?? [];
      const selfIndex = attendees.findIndex((a) => a.self);

      if (selfIndex >= 0) {
        attendees[selfIndex] = {
          ...attendees[selfIndex],
          responseStatus: "accepted",
        };
      } else {
        attendees.push({ self: true, responseStatus: "accepted" });
      }

      await this.client.calendars.events.update(eventId, {
        ...event,
        calendarId,
        attendees,
        sendUpdates: "all",
      });
    });
  }

  async responseToEvent(
    calendarId: string,
    eventId: string,
    response: {
      status: "accepted" | "tentative" | "declined";
      comment?: string;
    },
  ): Promise<void> {
    return this.withErrorHandler("responseToEvent", async () => {
      const event = await this.client.calendars.events.retrieve(eventId, {
        calendarId,
      });

      if (!event.attendees) {
        throw new Error("Event has no attendees");
      }

      if (response.comment) {
        throw new Error("Comment is not supported");
      }

      const selfIndex = event.attendees.findIndex((attendee) => attendee.self);

      if (selfIndex === -1) {
        throw new Error("Event has no self attendee");
      }

      event.attendees[selfIndex] = {
        ...event.attendees[selfIndex],
        responseStatus: toGoogleCalendarAttendeeResponseStatus(response.status),
      };

      await this.client.calendars.events.update(eventId, {
        ...event,
        calendarId,
        sendUpdates: "all",
      });
    });
  }

  private async withErrorHandler<T>(
    operation: string,
    fn: () => Promise<T> | T,
    context?: Record<string, unknown>,
  ): Promise<T> {
    try {
      return await Promise.resolve(fn());
    } catch (error: unknown) {
      console.error(`Failed to ${operation}:`, error);

      throw new ProviderError(error as Error, operation, context);
    }
  }
}
