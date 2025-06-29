import { Temporal } from "temporal-polyfill";

import { toPlainDate } from "./convert";

export interface StartOfDayOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function startOfDay({
  value,
  timeZone,
}: StartOfDayOptions): Temporal.ZonedDateTime {
  if (value instanceof Temporal.PlainDate) {
    return value.toZonedDateTime({
      timeZone,
      plainTime: {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      },
    });
  }

  if (value instanceof Temporal.Instant) {
    return value.toZonedDateTimeISO(timeZone).with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }

  return value.with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  });
}

export interface EndOfDayOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function endOfDay({
  value,
  timeZone,
}: EndOfDayOptions): Temporal.ZonedDateTime {
  if (value instanceof Temporal.PlainDate) {
    return value.toZonedDateTime({
      timeZone,
      plainTime: {
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
      },
    });
  }

  if (value instanceof Temporal.Instant) {
    return value.toZonedDateTimeISO(timeZone).with({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    });
  }

  return value.with({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
    microsecond: 999,
    nanosecond: 999,
  });
}

export interface StartOfWeekOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
  weekStartsOn: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function startOfWeek({
  value,
  timeZone,
  weekStartsOn,
}: StartOfWeekOptions): Temporal.PlainDate {
  const date = toPlainDate({ value, timeZone });

  const diff = (date.dayOfWeek - weekStartsOn + 7) % 7;

  return date.subtract({ days: diff });
}

interface EndOfWeekOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
  weekStartsOn: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function endOfWeek({
  value,
  timeZone,
  weekStartsOn,
}: EndOfWeekOptions): Temporal.PlainDate {
  const date = toPlainDate({ value, timeZone });

  const diff = (date.dayOfWeek - weekStartsOn + 7) % 7;

  return date.add({ days: 6 - diff });
}

interface StartOfMonthOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function startOfMonth({
  value,
  timeZone,
}: StartOfMonthOptions): Temporal.PlainDate {
  const date = toPlainDate({ value, timeZone });

  return date.with({ day: 1 });
}

interface EndOfMonthOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function endOfMonth({
  value,
  timeZone,
}: EndOfMonthOptions): Temporal.PlainDate {
  const date = toPlainDate({ value, timeZone });

  return date.with({ day: date.daysInMonth });
}
