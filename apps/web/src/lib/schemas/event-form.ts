import { isSameDay, parseDate, parseTime } from "@internationalized/date";
import { z } from "zod";

const participantSchema = z.object({
  id: z.string().min(1, "Participant ID is required"),
  name: z.string().trim().optional(),
  email: z.string().email("Invalid email format"),
});

const baseEventFormSchema = z.object({
  accountId: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be under 60 characters")
    .trim(),
  description: z
    .string()
    .max(400, "Description must be under 400 characters")
    .optional(),
  location: z
    .string()
    .describe("Place name or address")
    .max(60, "Location must be under 60 characters")
    .optional(),
  startTime: z.string().time("Invalid time format").nullable(),
  endTime: z.string().time("Invalid time format").nullable(),
  startDate: z
    .string()
    .describe("ISO 8601 date string, with no time components")
    .transform((val) => parseDate(val)),
  endDate: z
    .string()
    .describe("ISO 8601 date string, with no time components")
    .transform((val) => parseDate(val)),
  timezone: z
    .string()
    .describe("IANA timezone identifier like 'Europe/Warsaw'"),
  isAllDay: z.boolean(),
  repeats: z.boolean(),
  repeatType: z.enum(["daily", "weekly", "monthly"]).optional(),
  selectedParticipants: z.array(participantSchema).refine(
    (participants) => {
      const ids = participants.map((p) => p.id);
      return ids.length === new Set(ids).size;
    },
    { message: "Duplicate participants are not allowed" },
  ),
});

export const aiInputSchema = baseEventFormSchema.omit({
  accountId: true,
  selectedParticipants: true,
});

export const eventFormSchema = baseEventFormSchema.superRefine((data, ctx) => {
  const { startDate, endDate, startTime, endTime, isAllDay } = data;

  // Date relationship validation
  if (endDate.compare(startDate) < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    });
  }

  if (isAllDay) return;

  if (startTime === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start time is required for non-all day events",
      path: ["startTime"],
    });
  }

  if (endTime === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time is required for non-all day events",
      path: ["endTime"],
    });
  }

  // Time relationship validation (only when not all day)
  if (isSameDay(startDate, endDate) && startTime && endTime) {
    const startTimeObj = parseTime(startTime);
    const endTimeObj = parseTime(endTime);

    // Compare times directly using Time.compare method
    if (endTimeObj.compare(startTimeObj) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endTime"],
      });
    }
  }
});

export const eventFormSchemaWithRepeats = eventFormSchema.superRefine(
  (data, ctx) => {
    const { startDate, endDate, repeats, repeatType } = data;
    if (!repeats) return;

    if (!repeatType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Repeat type is required when repeat is enabled",
        path: ["repeatType"],
      });
    }

    if (isSameDay(startDate, endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date for repeating events",
        path: ["endDate"],
      });
    }
  },
);

export type AiOutputData = z.infer<typeof aiInputSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type EventFormData = z.input<typeof eventFormSchemaWithRepeats>;
export type EventOutputData = z.infer<typeof eventFormSchemaWithRepeats>;
