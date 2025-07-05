import { Temporal } from "temporal-polyfill";

import { Conference, ConferencingProvider } from "../interfaces";
import { ProviderError } from "../utils";

interface ZoomProviderOptions {
  accessToken: string;
  accountId?: string; // Unused but allows shared construction signature
}

export class ZoomProvider implements ConferencingProvider {
  public readonly providerId = "zoom" as const;
  private accessToken: string;

  constructor({ accessToken }: ZoomProviderOptions) {
    this.accessToken = accessToken;
  }

  /**
   * Create a Zoom meeting and return the details in the generic `Conference` format.
   *
   * The `calendarId` and `eventId` parameters are accepted to satisfy the
   * `ConferencingProvider` interface, however Zoom does not need them so they
   * are ignored. They are forwarded inside the `context` object that is passed
   * to the error-handler for easier debugging.
   */
  async createConferencing(
    agenda: string,
    startTime: string,
    endTime: string,
    timeZone = "UTC",
  ): Promise<Conference> {
    return this.withErrorHandler("createConferencing", async () => {
      // Default 60-minute duration
      let duration = 60;

      try {
        const startInstant = Temporal.Instant.from(startTime);
        const endInstant = Temporal.Instant.from(endTime);

        if (endInstant.epochMilliseconds > startInstant.epochMilliseconds) {
          duration = Math.ceil(
            Number(
              endInstant.epochMilliseconds - startInstant.epochMilliseconds,
            ) / 60000,
          );
        }
      } catch {
        /* keep default duration if parsing fails */
      }

      const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: agenda || "Meeting",
          type: 2, // Scheduled meeting
          agenda,
          start_time: startTime, // ISO 8601
          duration, // minutes
          timezone: timeZone,
          settings: {
            join_before_host: true,
            approval_type: 0,
            audio: "voip",
            waiting_room: false,
          },
        }),
      });

      if (!response.ok) {
        let errorPayload: unknown;
        try {
          errorPayload = await response.json();
        } catch {
          /* ignore */
        }
        throw new Error(
          `Zoom API responded with ${response.status} ${response.statusText}${
            errorPayload ? `: ${JSON.stringify(errorPayload)}` : ""
          }`,
        );
      }

      const data = (await response.json()) as {
        id: number | string;
        uuid?: string;
        join_url?: string;
        password?: string;
        start_url?: string;
      };

      const conference: Conference = {
        id: data.uuid ?? String(data.id),
        name: "Zoom Meeting",
        joinUrl: data.join_url ?? undefined,
        hostUrl: data.start_url ?? undefined,
        meetingCode: String(data.id),
        password: data.password ?? undefined,
      };

      return conference;
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
