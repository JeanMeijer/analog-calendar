import { Temporal } from "temporal-polyfill";

import { toInstant, toPlainDate, toPlainYearMonth } from "./convert";

export interface IsSameDayOptions {
  a: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  b: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isSameDay({ a, b, timeZone }: IsSameDayOptions) {
  return toPlainDate({ value: a, timeZone }).equals(
    toPlainDate({ value: b, timeZone }),
  );
}

export interface IsSameMonthOptions {
  a: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  b: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isSameMonth({ a, b, timeZone }: IsSameMonthOptions) {
  return toPlainYearMonth({ value: a, timeZone }).equals(
    toPlainYearMonth({ value: b, timeZone }),
  );
}

export interface IsSameYearOptions {
  a: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  b: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isSameYear({ a, b, timeZone }: IsSameYearOptions) {
  const yearA = toPlainDate({ value: a, timeZone }).withCalendar(
    "iso8601",
  ).year;
  const yearB = toPlainDate({ value: b, timeZone }).withCalendar(
    "iso8601",
  ).year;

  return yearA === yearB;
}

interface IsBeforeOptions {
  a: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  b: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
}

export function isBefore({ a, b }: IsBeforeOptions) {
  return (
    Temporal.Instant.compare(
      toInstant({ value: a, timeZone: "UTC" }),
      toInstant({ value: b, timeZone: "UTC" }),
    ) < 0
  );
}

interface IsAfterOptions {
  a: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  b: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
}

export function isAfter({ a, b }: IsAfterOptions) {
  return (
    Temporal.Instant.compare(
      toInstant({ value: a, timeZone: "UTC" }),
      toInstant({ value: b, timeZone: "UTC" }),
    ) > 0
  );
}

export interface IsTodayOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isToday({ value, timeZone }: IsTodayOptions) {
  const today = Temporal.Now.plainDateISO(timeZone);

  return today.equals(toPlainDate({ value, timeZone }));
}

export interface IsYesterdayOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isYesterday({ value, timeZone }: IsYesterdayOptions) {
  const today = Temporal.Now.plainDateISO(timeZone);
  const yesterday = today.subtract({ days: 1 });

  return yesterday.equals(toPlainDate({ value, timeZone }));
}

export interface IsTomorrowOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function isTomorrow({ value, timeZone }: IsTomorrowOptions) {
  const today = Temporal.Now.plainDateISO(timeZone);
  const tomorrow = today.add({ days: 1 });

  return tomorrow.equals(toPlainDate({ value, timeZone }));
}
