import type { Temporal } from "@js-temporal/polyfill";
import { RRuleTemporal, type RRuleOptions } from "rrule-temporal";

import type { EventOutputData } from "@/lib/schemas/event-form";

type GetFreqType<T> = T extends { freq: infer F } ? F : never;
type FreqType = GetFreqType<RRuleOptions>;

type GenerateRRuleParams = {
  repeatType: Required<EventOutputData>["repeatType"];
  eventDates: {
    startDate: Temporal.ZonedDateTime;
    endDate: Temporal.ZonedDateTime;
  };
  timezone: string;
};

/**
 * Generates RRULE string from event data using rrule-temporal
 */
export function generateRRule({
  repeatType,
  eventDates,
  timezone,
}: GenerateRRuleParams): string {
  if (!eventDates.startDate || !eventDates.endDate) {
    return "";
  }
  const rule = new RRuleTemporal({
    freq: repeatType.toUpperCase() as FreqType,
    dtstart: eventDates.startDate,
    until: eventDates.endDate,
    tzid: timezone,
  });
  return rule.toString();
}

/**
 * Get human-readable description of an RRULE
 */
export function getRecurrenceDescription(rruleString: string): string {
  try {
    const rule = new RRuleTemporal({ rruleString });
    return rule.toText();
  } catch (error) {
    console.error("Error generating recurrence description:", error);
    return "Invalid recurrence rule";
  }
}
