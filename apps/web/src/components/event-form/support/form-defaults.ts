"use client";

import {
  getLocalTimeZone,
  now,
  toCalendarDate,
  toTime,
} from "@internationalized/date";
import { formOptions } from "@tanstack/react-form";

import {
  eventFormSchemaWithRepeats,
  type EventFormData,
} from "@/lib/schemas/event-form";

const getDefaultFormValues = (): EventFormData => {
  const timezone = getLocalTimeZone();
  const currDate = now(timezone);
  const roundedMinutes = Math.ceil(currDate.minute / 15) * 15;
  const roundedDate =
    roundedMinutes === 60
      ? currDate.add({ hours: 1 }).set({ minute: 0, second: 0, millisecond: 0 })
      : currDate.set({ minute: roundedMinutes, second: 0, millisecond: 0 });

  const startDate = toCalendarDate(roundedDate);
  const startTime = toTime(roundedDate);
  const endTime = startTime.add({ hours: 1 });

  return {
    accountId: "",
    title: "",
    timezone,
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    startDate: startDate.toString(),
    endDate: startDate.toString(),
    isAllDay: false,
    repeats: false,
    description: undefined,
    location: undefined,
    selectedParticipants: [],
  };
};

export const defaultFormOptions = formOptions({
  defaultValues: getDefaultFormValues(),
  validators: {
    onChange: eventFormSchemaWithRepeats,
  },
});
