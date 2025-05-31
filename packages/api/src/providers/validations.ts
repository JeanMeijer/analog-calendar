import { z } from "zod";

export const dateInputSchema = z.object({
  dateTime: z.string(),
  timeZone: z.string(),
});
