import {
  zInstantInstance,
  zPlainDateInstance,
  zZonedDateTimeInstance,
} from "temporal-zod";
import { z } from "zod";

const microsoftMetadataSchema = z.object({
  originalStartTimeZone: z
    .object({
      raw: z.string(),
      parsed: z.string().optional(),
    })
    .optional(),
  originalEndTimeZone: z
    .object({
      raw: z.string(),
      parsed: z.string().optional(),
    })
    .optional(),
});

const googleMetadataSchema = z.object({});

export const dateInputSchema = z.union([
  zPlainDateInstance,
  zInstantInstance,
  zZonedDateTimeInstance,
]);

export const reccurrenceSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  interval: z.number().int().min(1).default(1),
  count: z.number().int().min(1).optional(),
  until: dateInputSchema.optional(),
  byDay: z.array(z.enum(["SU", "MO", "TU", "WE", "TH", "FR", "SA"])).optional(),
  byMonth: z.array(z.number().int().min(1).max(12)).optional(),
  byMonthDay: z.array(z.number().int().min(1).max(31)).optional(),
  byYearDay: z.array(z.number().int().min(1).max(366)).optional(),
  byWeekNo: z.array(z.number().int().min(1).max(53)).optional(),
  byHour: z.array(z.number().int().min(0).max(23)).optional(),
  byMinute: z.array(z.number().int().min(0).max(59)).optional(),
  bySecond: z.array(z.number().int().min(0).max(59)).optional(),
}).partial().default({ frequency: "daily", interval: 1 });

export const createEventInputSchema = z.object({
  title: z.string().optional(),
  start: dateInputSchema,
  end: dateInputSchema,
  allDay: z.boolean().optional(),
  recurrence: reccurrenceSchema.optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  accountId: z.string(),
  calendarId: z.string(),
  metadata: z.union([microsoftMetadataSchema, googleMetadataSchema]).optional(),
});

export const updateEventInputSchema = createEventInputSchema.extend({
  id: z.string(),
  metadata: z.union([microsoftMetadataSchema, googleMetadataSchema]).optional(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;

export type MicrosoftEventMetadata = z.infer<typeof microsoftMetadataSchema>;
export type GoogleEventMetadata = z.infer<typeof googleMetadataSchema>;
