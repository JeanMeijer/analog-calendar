export const CALENDAR_DEFAULTS = {
  TIME_RANGE_DAYS_PAST: 30,
  TIME_RANGE_DAYS_FUTURE: 60,
  MAX_EVENTS_PER_CALENDAR: 250,
  SINGLE_EVENTS: true,
  ORDER_BY: "startTime" as const,
} as const;

export const colorMap = {
  "1": "sky",
  "2": "emerald",
  "3": "violet",
  "4": "rose",
  "5": "amber",
  "6": "orange",
  "7": "sky",
  "8": "violet",
  "9": "sky",
  "10": "emerald",
  "11": "rose",
} as const;

export type EventColorId = keyof typeof colorMap;
export type EventColor = (typeof colorMap)[EventColorId];
