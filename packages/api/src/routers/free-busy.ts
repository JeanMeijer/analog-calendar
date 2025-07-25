import { Temporal } from "temporal-polyfill";
import { zZonedDateTimeInstance } from "temporal-zod";
import { z } from "zod";

import { calendarProcedure, createTRPCRouter } from "../trpc";
import { toInstant } from "@repo/temporal";

export const freeBusyRouter = createTRPCRouter({
  list: calendarProcedure
    .input(
      z.object({
        calendars: z.array(z.string()).default([]),
        timeMin: zZonedDateTimeInstance,
        timeMax: zZonedDateTimeInstance,
      }),
    )
    .query(async ({ ctx, input }) => {
      const promises = ctx.providers.map(async ({ client }) => {
        const calendars = await client.calendars();

        const blocks = await client.freeBusy(
          input.calendars.length === 0
            ? calendars.map((c) => c.id)
            : input.calendars,
          input.timeMin,
          input.timeMax,
        );

        return blocks;
      });

      const results = await Promise.all(promises);

      const events = results
        .flat()
        .map(
          (v) => [v, v.] as const,
        )
        .sort(([, i1], [, i2]) => Temporal.Instant.compare(i1, i2))
        .map(([v]) => v);

      return { events };
    }),
});
