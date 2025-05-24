import { GoogleCalendar } from "@repo/google-calendar";
import { dateHelpers } from "../utils/date-helpers";
import { CALENDAR_DEFAULTS } from "../constants/calendar";

interface GoogleCalendarProviderOptions {
  accessToken: string;
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
    const defaultTimeMax = new Date(Date.now() + CALENDAR_DEFAULTS.TIME_RANGE_DAYS_FUTURE * 24 * 60 * 60 * 1000);

    const { items } = await this.client.calendars.events.list(calendarId, {
      timeMin: timeMin || defaultTimeMin.toISOString(),
      timeMax: timeMax || defaultTimeMax.toISOString(),
      singleEvents: CALENDAR_DEFAULTS.SINGLE_EVENTS,
      orderBy: CALENDAR_DEFAULTS.ORDER_BY,
      maxResults: CALENDAR_DEFAULTS.MAX_EVENTS_PER_CALENDAR,
    });

    return items?.map((event) => this.transformGoogleEvent(event)) ?? [];
  }

  async createEvent(calendarId: string, params: any) {
    const googleEvent = await this.client.calendars.events.create(calendarId, params);
    return this.transformGoogleEvent(googleEvent);
  }

  async updateEvent(calendarId: string, eventId: string, params: any) {
    const googleEvent = await this.client.calendars.events.update(eventId, { calendarId, ...params });
    return this.transformGoogleEvent(googleEvent);
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.client.calendars.events.delete(eventId, { calendarId });
  }

  private transformGoogleEvent(googleEvent: any) {
    const isAllDay = !googleEvent.start?.dateTime;

    const start = dateHelpers.parseGoogleDate(googleEvent.start || {}, isAllDay);
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
