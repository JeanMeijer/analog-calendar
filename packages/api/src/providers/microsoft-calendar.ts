import { Client } from "@microsoft/microsoft-graph-client";
import type {
  Calendar as MicrosoftCalendar,
  Event as MicrosoftEvent,
} from "@microsoft/microsoft-graph-types";

import { CALENDAR_DEFAULTS } from "../constants/calendar";
import { dateHelpers } from "../utils/date-helpers";
import type { Calendar, CalendarEvent, CalendarProvider } from "./types";

interface MicrosoftCalendarProviderOptions {
  accessToken: string;
}

export class MicrosoftCalendarProvider implements CalendarProvider {
  public providerId = "microsoft" as const;
  private graphClient: Client;

  constructor({ accessToken }: MicrosoftCalendarProviderOptions) {
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => accessToken,
      },
    });
  }

  async calendars(): Promise<Calendar[]> {
    try {
      const response = await this.graphClient.api("/me/calendars").get();
      const data = response.value as MicrosoftCalendar[];

      return data.map((calendar) => ({
        id: calendar.id as string,
        provider: "microsoft",
        name: calendar.name as string,
        primary: calendar.isDefaultCalendar as boolean,
      }));
    } catch (error) {
      console.error("Error fetching Microsoft calendars:", error);
      return [];
    }
  }

  // async createCalendar(
  //   calendarData: Omit<Calendar, "id" | "changeKey" | "isDefaultCalendar">,
  // ): Promise<Calendar> {
  //   return (await this.graphClient
  //     .api("/me/calendars")
  //     .post(calendarData)) as Calendar;
  // }

  // async calendarGroups(): Promise<CalendarGroup[]> {
  //   const response = await this.graphClient.api("/me/calendarGroups").get();
  //   return response.value;
  // }

  // async createCalendarGroup(
  //   groupData: Omit<CalendarGroup, "id" | "changeKey">,
  // ): Promise<CalendarGroup> {
  //   return (await this.graphClient
  //     .api("/me/calendarGroups")
  //     .post(groupData)) as CalendarGroup;
  // }

  async events(
    calendarId: string,
    timeMin?: string,
    timeMax?: string,
  ): Promise<CalendarEvent[]> {
    const defaultTimeMin = new Date();
    const defaultTimeMax = new Date(
      Date.now() +
        CALENDAR_DEFAULTS.TIME_RANGE_DAYS_FUTURE * 24 * 60 * 60 * 1000,
    );

    const startTime = timeMin || defaultTimeMin.toISOString();
    const endTime = timeMax || defaultTimeMax.toISOString();

    const apiPath =
      calendarId === "primary"
        ? "/me/calendar/events"
        : `/me/calendars/${calendarId}/events`;

    const response = await this.graphClient
      .api(apiPath)
      .filter(
        `start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`,
      )
      .orderby("start/dateTime")
      .top(CALENDAR_DEFAULTS.MAX_EVENTS_PER_CALENDAR)
      .get();

    return (response.value as MicrosoftEvent[]).map((event: MicrosoftEvent) =>
      this.transformEvent(event),
    );
  }

  async createEvent(
    calendarId: string,
    event: Omit<CalendarEvent, "id">,
  ): Promise<CalendarEvent> {
    const microsoftEvent = {
      subject: event.title,
      body: event.description
        ? {
            contentType: "text",
            content: event.description,
          }
        : undefined,
      start: event.allDay
        ? { date: new Date(event.start.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.start.dateTime, timeZone: event.start.timeZone },
      end: event.allDay
        ? { date: new Date(event.end.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.end.dateTime, timeZone: event.end.timeZone },
      isAllDay: event.allDay || false,
      location: event.location
        ? {
            displayName: event.location,
          }
        : undefined,
    };

    const apiPath =
      calendarId === "primary"
        ? "/me/calendar/events"
        : `/me/calendars/${calendarId}/events`;

    const createdEvent = (await this.graphClient
      .api(apiPath)
      .post(microsoftEvent)) as MicrosoftEvent;

    return this.transformEvent(createdEvent);
  }

  /**
   * Updates an existing event
   *
   * @param calendarId - The calendar identifier
   * @param eventId - The event identifier
   * @param event - Partial event data for updates using UpdateEventInput interface
   * @returns The updated transformed Event object
   */
  async updateEvent(
    calendarId: string,
    eventId: string,
    event: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    const microsoftEvent: any = {};

    if (event.title !== undefined) {
      microsoftEvent.subject = event.title;
    }
    if (event.description !== undefined) {
      microsoftEvent.body = event.description
        ? {
            contentType: "text",
            content: event.description,
          }
        : undefined;
    }
    if (event.start !== undefined) {
      microsoftEvent.start = event.allDay
        ? { date: new Date(event.start.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.start.dateTime, timeZone: event.start.timeZone };
    }
    if (event.end !== undefined) {
      microsoftEvent.end = event.allDay
        ? { date: new Date(event.end.dateTime).toISOString().split("T")[0] }
        : { dateTime: event.end.dateTime, timeZone: event.end.timeZone };
    }
    if (event.allDay !== undefined) {
      microsoftEvent.isAllDay = event.allDay;
    }
    if (event.location !== undefined) {
      microsoftEvent.location = event.location
        ? {
            displayName: event.location,
          }
        : undefined;
    }

    const apiPath =
      calendarId === "primary"
        ? `/me/calendar/events/${eventId}`
        : `/me/calendars/${calendarId}/events/${eventId}`;

    const updatedEvent = (await this.graphClient
      .api(apiPath)
      .patch(microsoftEvent)) as MicrosoftEvent;

    return this.transformEvent(updatedEvent);
  }

  /**
   * Deletes an event from the calendar
   *
   * @param calendarId - The calendar identifier
   * @param eventId - The event identifier
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    const apiPath =
      calendarId === "primary"
        ? `/me/calendar/events/${eventId}`
        : `/me/calendars/${calendarId}/events/${eventId}`;

    await this.graphClient.api(apiPath).delete();
  }

  private transformEvent(microsoftEvent: MicrosoftEvent): CalendarEvent {
    const isAllDay = microsoftEvent.isAllDay || false;

    const start = dateHelpers.parseMicrosoftDate(
      microsoftEvent.start || undefined,
      isAllDay,
    );

    const end = dateHelpers.parseMicrosoftDate(
      microsoftEvent.end || undefined,
      isAllDay,
    );

    return {
      id: microsoftEvent.id ?? "",
      title: microsoftEvent.subject ?? "Untitled Event",
      description:
        (microsoftEvent.body?.content as string) ?? microsoftEvent.bodyPreview,
      start,
      end,
      allDay: isAllDay,
      location:
        microsoftEvent.location?.displayName ||
        microsoftEvent.location?.address?.street ||
        undefined,
      status: microsoftEvent.showAs || undefined,
      htmlLink: microsoftEvent.webLink || undefined,
      color: undefined, // Microsoft doesn't have colorId equivalent
    };
  }
}
