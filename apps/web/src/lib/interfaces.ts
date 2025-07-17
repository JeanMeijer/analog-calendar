import type { Attendee, Calendar } from "@repo/api/providers/interfaces";

import type { RouterOutputs } from "./trpc";

export type CalendarEvent = RouterOutputs["events"]["list"]["events"][number];

export type DraftEvent = Partial<CalendarEvent> &
  Required<Pick<CalendarEvent, "id" | "start" | "end">> & {
    type: "draft";
  };

export type { Calendar, Attendee };
