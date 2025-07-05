import { Temporal } from "temporal-polyfill";

import { CalendarEvent, DraftEvent } from "../interfaces";

export function roundTo15Minutes(
  date: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime {
  const roundedMinutes = Math.round(date.minute / 15) * 15;

  return date.with({ minute: roundedMinutes });
}

export type CreateDraftEventOptions = Omit<DraftEvent, "id" | "type"> &
  Required<Pick<DraftEvent, "start" | "end">>;

export function createDraftEvent(options: CreateDraftEventOptions): DraftEvent {
  return {
    ...options,
    id: createEventId(),
    type: "draft",
  };
}

export function isDraftEvent(
  event: CalendarEvent | DraftEvent,
): event is DraftEvent {
  return "type" in event && event.type === "draft";
}

export function createEventId() {
  return `${crypto.randomUUID()}`.replace(/-/g, "");
}
