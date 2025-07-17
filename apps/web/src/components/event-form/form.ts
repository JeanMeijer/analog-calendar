import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Temporal } from "temporal-polyfill";
import { zZonedDateTimeInstance } from "temporal-zod";
import { z } from "zod";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: zZonedDateTimeInstance,
  end: zZonedDateTimeInstance,
  isAllDay: z.boolean(),
  repeat: z.object({
    type: z.enum(["daily", "weekly", "monthly"]).optional(),
  }),
  description: z.string(),
  calendar: z.object({
    accountId: z.string(),
    calendarId: z.string(),
  }),
  attendees: z.array(
    z.object({
      name: z.string().optional(),
      email: z.string(),
      status: z.enum(["accepted", "declined", "tentative", "unknown"]),
      type: z.enum(["required", "optional", "resource"]).optional(),
    }),
  ),
  providerId: z.enum(["google", "microsoft"]),
});

export type FormValues = z.infer<typeof formSchema>;
export type RepeatType = FormValues["repeat"];

export const defaultValues: FormValues = {
  id: "",
  title: "",
  start: Temporal.Now.zonedDateTimeISO(),
  end: Temporal.Now.zonedDateTimeISO().add({ hours: 2 }),
  isAllDay: false,
  description: "",
  repeat: {},
  attendees: [],
  calendar: {
    accountId: "",
    calendarId: "",
  },
  providerId: "google",
};
