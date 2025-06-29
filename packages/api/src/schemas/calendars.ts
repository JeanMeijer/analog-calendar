import { z } from "zod";

export const createCalendarInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  timeZone: z.string().optional(),
  accountId: z.string(),
});

export const updateCalendarInputSchema = createCalendarInputSchema.extend({
  id: z.string(),
});

export type CreateCalendarInput = z.infer<typeof createCalendarInputSchema>;
export type UpdateCalendarInput = z.infer<typeof updateCalendarInputSchema>;
