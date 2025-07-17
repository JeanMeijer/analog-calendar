import type { RouterOutputs } from "@/lib/trpc";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEvent = RouterOutputs["events"]["list"]["events"][number];
