import { Client } from "@microsoft/microsoft-graph-client";
import type {
  Calendar as MicrosoftCalendar,
  Event as MicrosoftEvent,
} from "@microsoft/microsoft-graph-types";
import { Temporal } from "temporal-polyfill";

import { CALENDAR_DEFAULTS } from "../constants/calendar";
import { CreateCalendarInput, UpdateCalendarInput } from "../schemas/calendars";
import { CreateEventInput, UpdateEventInput } from "../schemas/events";
import { assignColor } from "./colors";
import type { Calendar, CalendarEvent, CalendarProvider } from "./interfaces";
import {
  calendarPath,
  eventResponseStatusPath,
  parseMicrosoftCalendar,
  parseMicrosoftEvent,
  toMicrosoftEvent,
} from "./microsoft-calendar/utils";
import { ProviderError } from "./utils";

interface MicrosoftCalendarProviderOptions {
  accessToken: string;
  accountId: string;
}

export class MicrosoftCalendarProvider implements CalendarProvider {
  public readonly providerId = "microsoft" as const;
  public readonly accountId: string;
  private graphClient: Client;

  constructor({ accessToken, accountId }: MicrosoftCalendarProviderOptions) {
    this.accountId = accountId;
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => accessToken,
      },
    });
  }

  async calendars(): Promise<Calendar[]> {
    return this.withErrorHandler("calendars", async () => {
      // Microsoft Graph API does not work without $select due to a bug
      const response = await this.graphClient
        .api(
          "/me/calendars?$select=id,name,isDefaultCalendar,canEdit,hexColor,isRemovable,owner,calendarPermissions",
        )
        .get();

      return (response.value as MicrosoftCalendar[]).map((calendar, idx) => ({
        ...parseMicrosoftCalendar({ calendar, accountId: this.accountId }),
        color: assignColor(idx),
      }));
    });
  }

  async createCalendar(calendarData: CreateCalendarInput): Promise<Calendar> {
    return this.withErrorHandler("createCalendar", async () => {
      const createdCalendar: MicrosoftCalendar = await this.graphClient
        .api("/me/calendars")
        .post(calendarData);

      return parseMicrosoftCalendar({
        calendar: createdCalendar,
        accountId: this.accountId,
      });
    });
  }

  async updateCalendar(
    calendarId: string,
    calendar: UpdateCalendarInput,
  ): Promise<Calendar> {
    return this.withErrorHandler("updateCalendar", async () => {
      const updatedCalendar: MicrosoftCalendar = await this.graphClient
        .api(calendarPath(calendarId))
        .patch(calendar);

      return parseMicrosoftCalendar({
        calendar: updatedCalendar,
        accountId: this.accountId,
      });
    });
  }

  async deleteCalendar(calendarId: string): Promise<void> {
    return this.withErrorHandler("deleteCalendar", async () => {
      await this.graphClient.api(calendarPath(calendarId)).delete();
    });
  }

  async events(
    calendar: Calendar,
    timeMin: Temporal.ZonedDateTime,
    timeMax: Temporal.ZonedDateTime,
  ): Promise<CalendarEvent[]> {
    return this.withErrorHandler("events", async () => {
      const startTime = timeMin.withTimeZone("UTC").toInstant().toString();
      const endTime = timeMax.withTimeZone("UTC").toInstant().toString();

      const response = await this.graphClient
        .api(`${calendarPath(calendar.id)}/events`)
        .filter(
          `start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`,
        )
        .orderby("start/dateTime")
        .top(CALENDAR_DEFAULTS.MAX_EVENTS_PER_CALENDAR)
        .get();

      return (response.value as MicrosoftEvent[]).map((event: MicrosoftEvent) =>
        parseMicrosoftEvent({ event, accountId: this.accountId, calendar }),
      );
    });
  }

  async createEvent(
    calendar: Calendar,
    event: CreateEventInput,
  ): Promise<CalendarEvent> {
    return this.withErrorHandler("createEvent", async () => {
      const createdEvent: MicrosoftEvent = await this.graphClient
        .api(`${calendarPath(calendar.id)}/events`)
        .post(toMicrosoftEvent(event));

      return parseMicrosoftEvent({
        event: createdEvent,
        accountId: this.accountId,
        calendar,
      });
    });
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
    calendar: Calendar,
    eventId: string,
    event: UpdateEventInput,
  ): Promise<CalendarEvent> {
    return this.withErrorHandler("updateEvent", async () => {
      let request = this.graphClient.api(
        `${calendarPath(calendar.id)}/events/${eventId}`,
      );

      if (event.etag) {
        request = request.header("If-Match", event.etag);
      }

      const updatedEvent: MicrosoftEvent = await request.patch(
        toMicrosoftEvent(event),
      );

      return parseMicrosoftEvent({
        event: updatedEvent,
        accountId: this.accountId,
        calendar,
      });
    });
  }

  /**
   * Deletes an event from the calendar
   *
   * @param calendarId - The calendar identifier
   * @param eventId - The event identifier
   */
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.withErrorHandler("deleteEvent", async () => {
      await this.graphClient
        .api(`${calendarPath(calendarId)}/events/${eventId}`)
        .delete();
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
    await this.withErrorHandler("responseToEvent", async () => {
      await this.graphClient
        .api(
          `/me/events/${eventId}/${eventResponseStatusPath(response.status)}`,
        )
        .post({ comment: response.comment, sendResponse: true });
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
