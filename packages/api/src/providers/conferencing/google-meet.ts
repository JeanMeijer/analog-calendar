import GoogleCalendar from "@repo/google-calendar";

import { Conference, ConferencingProvider } from "../interfaces";
import { ProviderError } from "../utils";

interface GoogleMeetProviderOptions {
  accessToken: string;
  accountId: string;
}

export class GoogleMeetProvider implements ConferencingProvider {
  public readonly providerId = "google" as const;
  public readonly accountId: string;
  private client: GoogleCalendar;

  constructor({ accessToken, accountId }: GoogleMeetProviderOptions) {
    this.accountId = accountId;
    this.client = new GoogleCalendar({
      accessToken,
    });
  }

  async createConference(
    agenda: string,
    startTime: string,
    endTime: string,
    timeZone?: string,
    calendarId?: string,
    eventId?: string,
  ): Promise<Conference> {
    return this.withErrorHandler("createConferencing", async () => {
      if (!eventId || !calendarId) {
        throw new Error("Google Meet requires a calendarId and eventId");
      }

      const existingEvent = await this.client.calendars.events.retrieve(
        eventId,
        {
          calendarId,
        },
      );

      const updatedEvent = await this.client.calendars.events.update(eventId, {
        calendarId,
        ...existingEvent,
        conferenceDataVersion: 1, // This ensures the conference data is created, DO NOT REMOVE
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      });

      if (!updatedEvent.conferenceData) {
        throw new Error("Failed to create conference data");
      }

      const conferenceData = updatedEvent.conferenceData;

      const videoEntry = conferenceData.entryPoints?.find(
        (e) => e.entryPointType === "video" && e.uri,
      );
      const phoneNumbers = conferenceData.entryPoints
        ?.filter((e) => e.entryPointType === "phone" && e.uri)
        .map((e) => e.uri as string);

      return {
        id: conferenceData.conferenceId,
        name: conferenceData.conferenceSolution?.name || "Google Meet",
        joinUrl: videoEntry?.uri,
        meetingCode: videoEntry?.meetingCode ?? conferenceData.conferenceId,
        phoneNumbers:
          phoneNumbers && phoneNumbers.length ? phoneNumbers : undefined,
      };
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
