import { TaskFormValues } from "./form";

export interface TaskRequest {
  title: string;
  notes?: string;
  due?: string;
  status: "needsAction" | "completed" | "cancelled";
}

export function toTaskRequest(values: TaskFormValues): TaskRequest {
  return {
    title: values.title.trim(),
    notes: values.notes?.trim() || undefined,
    due: values.due?.toISOString(),
    status: values.status,
  };
}

export function validateTaskForm(values: TaskFormValues): boolean {
  return values.title.trim().length > 0 && values.categoryId.length > 0;
}

export function resetTaskForm(): TaskFormValues {
  return {
    title: "",
    notes: "",
    due: new Date(),
    status: "needsAction",
    categoryId: "",
  };
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  
  // Handle zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as any).issues;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues[0].message || "Invalid value";
    }
  }
  
  return "Invalid value";
} 