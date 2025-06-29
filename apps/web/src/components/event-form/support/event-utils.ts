import {
  parseTime,
  toCalendarDateTime,
  toZoned,
  type CalendarDate,
} from "@internationalized/date";
import { Temporal } from "temporal-polyfill";

import { CalendarEvent } from "@/components/event-calendar";
import { ProviderId } from "@/lib/constants";
import type { EventOutputData } from "@/lib/schemas/event-form";
import { generateRRule } from "./rrule-utils";

type DateFields = Pick<
  EventOutputData,
  "startDate" | "endDate" | "startTime" | "endTime" | "timezone"
>;

type StringDateFields = {
  date: CalendarDate;
  time: string | null;
  timezone: string;
};

export function getZonedEventTimes(data: DateFields) {
  try {
    return {
      startTime: getTemporalZonedDateTime({
        date: data.startDate,
        time: data.startTime,
        timezone: data.timezone,
      }),
      endTime: getTemporalZonedDateTime({
        date: data.startDate,
        time: data.endTime,
        timezone: data.timezone,
      }),
    };
  } catch (error) {
    console.error("Error getting zoned event dates:", error);
    return {
      startTime: null,
      endTime: null,
    };
  }
}

export function getTemporalZonedDateTime(
  strings: StringDateFields,
): Temporal.ZonedDateTime {
  const { date, time, timezone } = strings;
  const parsedTime = time ? parseTime(time) : undefined;

  const dateTime = toCalendarDateTime(date, parsedTime);
  const zoned = toZoned(dateTime, timezone);

  return Temporal.ZonedDateTime.from({
    year: zoned.year,
    month: zoned.month,
    day: zoned.day,
    hour: zoned.hour,
    minute: zoned.minute,
    timeZone: zoned.timeZone,
  });
}

type TransformParams = {
  data: EventOutputData;
  providerId: ProviderId;
  accountId: string;
};

export function toCalendarEvent({
  data,
  providerId,
  accountId,
}: TransformParams): CalendarEvent | null {
  const { startTime, endTime } = getZonedEventTimes(data);
  if (!startTime || !endTime) {
    return null;
  }
  const endDateUTC = endTime
    .with({
      year: data.endDate.year,
      month: data.endDate.month,
      day: data.endDate.day,
    })
    .withTimeZone("UTC");

  const recurrenceRule = data.repeatType
    ? generateRRule({
        repeatType: data.repeatType,
        eventDates: { startDate: startTime, endDate: endDateUTC },
        timezone: data.timezone,
      })
    : "";

  const adjustedStartTime = data.isAllDay ? startTime.toPlainDate() : startTime;
  const adjustedEndTime = data.isAllDay ? endTime.toPlainDate() : endTime;

  return {
    id: "",
    title: data.title,
    description: data.description,
    start: adjustedStartTime,
    end: adjustedEndTime,
    allDay: data.isAllDay,
    location: data.location ?? "",
    calendarId: "primary",
    color: undefined,
    providerId,
    accountId,
  };
}
