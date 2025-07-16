import {
  zInstantInstance,
  zPlainDateInstance,
  zZonedDateTimeInstance,
} from "temporal-zod";
import { z } from "zod";

const conferenceSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  joinUrl: z.string().url().optional(),
  hostUrl: z.string().url().optional(),
  meetingCode: z.string().optional(),
  password: z.string().optional(),
  phoneNumbers: z.array(z.string()).optional(),
  notes: z.string().optional(),
  extra: z.record(z.unknown()).optional(),
});

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
  id: z.string(),
  title: z.string().optional(),
  start: dateInputSchema,
  end: dateInputSchema,
  allDay: z.boolean().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  accountId: z.string(),
  calendarId: z.string(),
  // Zoom for type compatibility
  providerId: z.enum(["google", "microsoft", "zoom"]),
  readOnly: z.boolean(),
  metadata: z.union([microsoftMetadataSchema, googleMetadataSchema]).optional(),
  conference: conferenceSchema.optional(),
});

export const updateEventInputSchema = createEventInputSchema.extend({
  id: z.string(),
  etag: z.string().optional(),
  conference: conferenceSchema.optional(),
  metadata: z.union([microsoftMetadataSchema, googleMetadataSchema]).optional(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;

export type MicrosoftEventMetadata = z.infer<typeof microsoftMetadataSchema>;
export type GoogleEventMetadata = z.infer<typeof googleMetadataSchema>;
