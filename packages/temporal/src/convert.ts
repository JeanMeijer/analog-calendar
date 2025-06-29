import { Temporal } from "temporal-polyfill";

interface ToDateOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function toDate({ value, timeZone }: ToDateOptions): Date {
  return new Date(toInstant({ value, timeZone }).toString());
}

interface ToInstantOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function toInstant({ value, timeZone }: ToInstantOptions) {
  if (value instanceof Temporal.Instant) {
    return value.toZonedDateTimeISO(timeZone).toInstant();
  }

  if (value instanceof Temporal.ZonedDateTime) {
    return value.withTimeZone(timeZone).toInstant();
  }

  return value.toZonedDateTime(timeZone).toInstant();
}

interface ToPlainDateOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function toPlainDate({ value, timeZone }: ToPlainDateOptions) {
  if (value instanceof Temporal.PlainDate) {
    return value;
  }

  if (value instanceof Temporal.Instant) {
    return value.toZonedDateTimeISO(timeZone).toPlainDate();
  }

  return value.withTimeZone(timeZone).toPlainDate();
}

export interface ToPlainYearMonthOptions {
  value: Temporal.Instant | Temporal.ZonedDateTime | Temporal.PlainDate;
  timeZone: string;
}

export function toPlainYearMonth({ value, timeZone }: ToPlainYearMonthOptions) {
  if (value instanceof Temporal.PlainDate) {
    return value.toPlainYearMonth();
  }

  return toPlainDate({ value, timeZone }).toPlainYearMonth();
}

export function compareTemporal(
  a: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime,
  b: Temporal.PlainDate | Temporal.Instant | Temporal.ZonedDateTime,
) {
  return Temporal.Instant.compare(
    toInstant({ value: a, timeZone: "UTC" }),
    toInstant({ value: b, timeZone: "UTC" }),
  );
}
