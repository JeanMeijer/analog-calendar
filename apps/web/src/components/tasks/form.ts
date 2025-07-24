import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { z } from "zod";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .refine((val) => val.trim().length > 0, "Title cannot be empty"),
  notes: z.string().optional(),
  due: z.date().optional(),
  status: z.enum(["needsAction", "completed", "cancelled"]),
  categoryId: z.string().min(1, "Category is required"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const defaultTaskValues: TaskFormValues = {
  title: "",
  notes: "",
  due: new Date(),
  status: "needsAction",
  categoryId: "",
};
