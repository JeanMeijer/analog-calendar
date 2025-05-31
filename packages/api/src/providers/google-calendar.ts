import { GoogleCalendar } from "@repo/google-calendar";

import { CALENDAR_DEFAULTS } from "../constants/calendar";
import { dateHelpers } from "../utils/date-helpers";
import type { CalendarEvent, CalendarProvider } from "./types";

interface GoogleCalendarProviderOptions {
  accessToken: string;
}

// Type definitions for Google Calendar API
interface EventCreateParams {
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  start?: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
}

interface EventUpdateParams extends EventCreateParams {
  calendarId: string;
}

export class GoogleCalendarProvider implements CalendarProvider {
  public providerId = "google" as const;
  private client: GoogleCalendar;

  constructor({ accessToken }: GoogleCalendarProviderOptions) {
    this.client = new GoogleCalendar({
      accessToken,
    });
  }

  async calendars() {
    const { items } = await this.client.users.me.calendarList.list();

    if (!items) return [];

    return items
      .filter((calendar) => calendar.id && calendar.summary)
      .map((calendar) => ({
        id: calendar.id!,
        provider: "google",
        name: calendar.summary!,
        primary: calendar.primary || false,
      }));
  }

  async events(calendarId: string, timeMin?: string, timeMax?: string) {
    const defaultTimeMin = new Date();
    const defaultTimeMax = new Date(
      Date.now() +
        CALENDAR_DEFAULTS.TIME_RANGE_DAYS_FUTURE * 24 * 60 * 60 * 1000,
    );

    const { items } = await this.client.calendars.events.list(calendarId, {
      timeMin: timeMin || defaultTimeMin.toISOString(),
      timeMax: timeMax || defaultTimeMax.toISOString(),
      singleEvents: CALENDAR_DEFAULTS.SINGLE_EVENTS,
      orderBy: CALENDAR_DEFAULTS.ORDER_BY,
      maxResults: CALENDAR_DEFAULTS.MAX_EVENTS_PER_CALENDAR,
    });

    return items?.map((event) => this.transformEvent(event)) ?? [];
  }

  async createEvent(calendarId: string, event: Omit<CalendarEvent, "id">) {
    const eventData: EventCreateParams = {
      summary: event.title,
      description: event.description,
      location: event.location,
      colorId: event.color,
      start: event.allDay
        ? { date: new Date(event.start.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.start.dateTime, timeZone: event.start.timeZone },
      end: event.allDay
        ? { date: new Date(event.end.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.end.dateTime, timeZone: event.end.timeZone },
    };

    const createdEvent = await this.client.calendars.events.create(
      calendarId,
      eventData,
    );

    return this.transformEvent(createdEvent);
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    event: Partial<CalendarEvent>,
  ) {
    // First get the existing event to merge with updates
    const existingEvent = await this.client.calendars.events.retrieve(eventId, {
      calendarId,
    });

    const eventData: EventUpdateParams = {
      calendarId,
      summary: event.title ?? existingEvent.summary,
      description: event.description ?? existingEvent.description,
      location: event.location ?? existingEvent.location,
      colorId: event.color ?? existingEvent.colorId,
      start: event.start
        ? event.allDay
          ? { date: new Date(event.start.dateTime).toISOString().split("T")[0] }
          : { dateTime: event.start.dateTime, timeZone: event.start.timeZone }
        : existingEvent.start,
      end: event.end
        ? event.allDay
          ? { date: new Date(event.end.dateTime).toISOString().split("T")[0] }
          : { dateTime: event.end.dateTime, timeZone: event.end.timeZone }
        : existingEvent.end,
    };

    const updatedEvent = await this.client.calendars.events.update(
      eventId,
      eventData,
    );

    return this.transformEvent(updatedEvent);
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.client.calendars.events.delete(eventId, { calendarId });
  }

  private transformEvent(
    googleEvent: GoogleCalendar.Calendars.Events.Event,
  ): CalendarEvent {
    const isAllDay = !googleEvent.start?.dateTime;

    const start = dateHelpers.parseGoogleDate(
      googleEvent.start || {},
      isAllDay,
    );
    const end = dateHelpers.parseGoogleDate(googleEvent.end || {}, isAllDay);

    return {
      id: googleEvent.id || "",
      title: googleEvent.summary || "Untitled Event",
      description: googleEvent.description,
      start,
      end,
      allDay: isAllDay,
      location: googleEvent.location,
      status: googleEvent.status,
      htmlLink: googleEvent.htmlLink,
      color: googleEvent.colorId,
    };
  }
}
