import { detectIcsType, importEvent, importEvents } from "@analog/ical";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const icsRouter = createTRPCRouter({
  parseFromUrl: publicProcedure
    .input(
      z.object({
        url: z.string().url("Must be a valid URL"),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(input.url, {
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to fetch ICS file: ${response.status} ${response.statusText}`,
        });
      }

      const content = await response.text();

      if (!content.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ICS file is empty",
        });
      }

      try {
        const type = detectIcsType(content);

        if (type === "calendar") {
          const events = importEvents(content);
          return {
            type: "calendar",
            events,
          };
        } else {
          const event = importEvent(content);
          return {
            type: "event",
            events: [event],
          };
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process ICS file",
          cause: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
});
