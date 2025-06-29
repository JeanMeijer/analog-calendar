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

export const createEventInputSchema = z.object({
  title: z.string().optional(),
  start: dateInputSchema,
  end: dateInputSchema,
  allDay: z.boolean().optional(),
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
