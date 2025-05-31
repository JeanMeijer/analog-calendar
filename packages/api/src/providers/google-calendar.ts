import { GoogleCalendar } from "@repo/google-calendar";

import { CALENDAR_DEFAULTS } from "../constants/calendar";
import { dateHelpers } from "../utils/date-helpers";
import type { CreateEventOptions, UpdateEventOptions } from "./interfaces";

interface GoogleCalendarProviderOptions {
  accessToken: string;
}

interface DateTimeWithZone {
  dateTime: string;
  timeZone: string;
}

interface CreateEventInput {
  summary: string;
  description?: string;
  start: DateTimeWithZone;
  end: DateTimeWithZone;
  allDay?: boolean;
  location?: string;
  colorId?: string;
}

interface UpdateEventInput {
  title?: string;
  description?: string;
  start?: Date;
  end?: Date;
  allDay?: boolean;
  location?: string;
  colorId?: string;
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

export class GoogleCalendarProvider {
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
        primary: calendar.primary,
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

    return items?.map((event) => this.transformGoogleEvent(event)) ?? [];
  }

  async createEvent(calendarId: string, event: CreateEventInput) {
    const eventData: EventCreateParams = {
      summary: event.summary,
      description: event.description,
      location: event.location,
      colorId: event.colorId,
      start: event.allDay
        ? { date: event.start.dateTime.split("T")[0] }
        : { dateTime: event.start.dateTime, timeZone: event.start.timeZone },
      end: event.allDay
        ? { date: event.end.dateTime.split("T")[0] }
        : { dateTime: event.end.dateTime, timeZone: event.end.timeZone },
    };

    const createdEvent = await this.client.calendars.events.create(
      calendarId,
      eventData,
    );

    return this.transformGoogleEvent(createdEvent);
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    event: UpdateEventInput,
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
      colorId: event.colorId ?? existingEvent.colorId,
      start: event.start
        ? event.allDay
          ? { date: event.start.toISOString().split("T")[0] }
          : { dateTime: event.start.toISOString() }
        : existingEvent.start,
      end: event.end
        ? event.allDay
          ? { date: event.end.toISOString().split("T")[0] }
          : { dateTime: event.end.toISOString() }
        : existingEvent.end,
    };

    const updatedEvent = await this.client.calendars.events.update(
      eventId,
      eventData,
    );

    return this.transformGoogleEvent(updatedEvent);
  }

  async deleteEvent(calendarId: string, eventId: string) {
    await this.client.calendars.events.delete(eventId, { calendarId });
  }

  private transformGoogleEvent(
    googleEvent: GoogleCalendar.Calendars.Events.Event,
  ) {
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
      colorId: googleEvent.colorId,
    };
  }
}
