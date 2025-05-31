import type { RouterOutputs } from "@/lib/trpc";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEvent = RouterOutputs["events"]["list"]["events"][number];

// export interface CalendarEvent {
//   id: string;
//   title: string;
//   description?: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
//   color?: EventColor;
//   location?: string;
//   calendarId: string;
//   connectionId: string;
// }

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
