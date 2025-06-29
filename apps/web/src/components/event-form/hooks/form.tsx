"use client";

import { lazy } from "react";
import { createFormHook } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fieldContext, formContext, useFormContext } from "./form-context";

const TitleField = lazy(() => import("../blocks/fields/title-field"));
const DescriptionField = lazy(
  () => import("../blocks/fields/description-field"),
);
const LocationField = lazy(() => import("../blocks/fields/location-field"));
const SelectedAccountField = lazy(
  () => import("../blocks/fields/account-field"),
);

function SubmitButton({ className }: { className?: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "bg-blue-600 select-none hover:bg-blue-600/90 focus-visible:ring-blue-400/50 dark:bg-blue-500 dark:hover:bg-blue-500/90 dark:focus-visible:ring-blue-400/50",
            className,
          )}
          onClick={form.handleSubmit}
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    DescriptionField,
    LocationField,
    TitleField,
    SelectedAccountField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
