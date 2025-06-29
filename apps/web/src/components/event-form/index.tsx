"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import {
  useClickOutside,
  useMeasure,
  useMediaQuery,
  useToggle,
  useUpdateEffect,
} from "@react-hookz/web";
import type { StandardSchemaV1Issue } from "@tanstack/react-form";
import { AlertCircleIcon, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccounts } from "@/hooks/accounts";
import { eventFormSchemaWithRepeats } from "@/lib/schemas/event-form";
import { cn } from "@/lib/utils";
import { useEventOperations } from "../event-calendar";
import { DateGroup, Participants, TimeGroup, ToggleGroup } from "./blocks";
import { useAppForm } from "./hooks/form";
import { useAiInput } from "./hooks/use-ai-input";
import { toCalendarEvent } from "./support/event-utils";
import { defaultFormOptions } from "./support/form-defaults";

function EventForm() {
  const { handleEventSave } = useEventOperations();
  const [measurements, ref] = useMeasure<HTMLDivElement>();
  const { accounts } = useAccounts();

  const form = useAppForm({
    defaultValues: {
      ...defaultFormOptions.defaultValues,
      accountId: accounts?.find((a) => !a.email)?.id ?? "",
    },
    validators: defaultFormOptions.validators,
    onSubmit: ({ value }) => {
      const data = eventFormSchemaWithRepeats.parse(value);
      const account = accounts?.find((a) => a.id === data.accountId);
      if (!account) {
        toast.error("No account available to save the event", {
          closeButton: false,
        });
        return;
      }
      const calendarEvent = toCalendarEvent({
        data,
        providerId: account.providerId,
        accountId: account.id,
      });
      if (calendarEvent) {
        handleEventSave(calendarEvent);
      }
      form.reset();
      form.setFieldValue("accountId", account.id);
    },
  });

  const {
    isLoading,
    data: aiData,
    enabled: aiEnabled,
  } = useAiInput(() => form.getFieldValue("title"));

  useUpdateEffect(() => {
    if (!aiData) return;
    const { startDate, endDate, ...rest } = aiData;
    form.reset(
      {
        ...rest,
        accountId: form.state.values.accountId,
        selectedParticipants: form.state.values.selectedParticipants,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      },
      { keepDefaultValues: true },
    );
  }, [aiData]);

  const preventDefaultEnter = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }, []);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={preventDefaultEnter}
      className="w-full"
    >
      <form.AppField name="title">
        {(field) => (
          <field.TitleField
            cardSize={measurements}
            isLoading={isLoading}
            aiEnabled={aiEnabled}
          />
        )}
      </form.AppField>
      <div
        className="relative mb-2.5 rounded-lg border border-border/70 bg-background dark:border-0"
        ref={ref}
      >
        <div className="px-4 pt-3 pb-4">
          <TimeGroup form={form} />
          <div className="flex flex-col gap-y-2.5">
            <DateGroup form={form} />
            <ToggleGroup form={form} />
            <form.AppField name="description">
              {(field) => <field.DescriptionField maxLength={400} />}
            </form.AppField>
            <Separator className="bg-muted-foreground/10" />
            <form.Field name="selectedParticipants">
              {(field) => (
                <Participants
                  value={field.state.value}
                  onChange={field.handleChange}
                  isInvalid={field.state.meta.isValid === false}
                />
              )}
            </form.Field>
            <Separator className="bg-muted-foreground/10" />
            <form.AppField name="location">
              {(field) => <field.LocationField />}
            </form.AppField>
            <Separator className="bg-muted-foreground/10" />
            <Button
              variant="secondary"
              type="button"
              className="h-7 w-full bg-input/70 text-[0.8rem] text-muted-foreground shadow-none select-none hover:bg-input/40"
            >
              <Video /> Link Video Conferencing
            </Button>
          </div>
          <form.Subscribe selector={(state) => state.errorMap}>
            {(errors) =>
              errors.onChange && (
                <ErrorsPopover
                  className="absolute -top-3 right-1 z-30 -translate-y-full"
                  side="bottom"
                  sideOffset={5}
                  align="end"
                  alignOffset={-6}
                  errors={errors.onChange}
                />
              )
            }
          </form.Subscribe>
        </div>
      </div>
      <form.AppForm>
        <form.SubmitButton className="mb-2.5 w-full rounded-lg dark:mx-0.5 dark:w-[calc(100%-0.25rem)]" />
      </form.AppForm>
      <form.AppField name="accountId">
        {(field) => <field.SelectedAccountField />}
      </form.AppField>
    </form>
  );
}

function ErrorsPopover({
  className,
  errors,
  ...props
}: {
  className?: string;
  errors: Record<string, StandardSchemaV1Issue[]>;
} & React.ComponentProps<typeof TooltipContent>) {
  const [open, toggleOpen] = useToggle(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    if (isSmallDevice) toggleOpen(false);
  });

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isSmallDevice ? open : undefined}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 rounded-full bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive",
              className,
            )}
            onClick={isSmallDevice ? toggleOpen : undefined}
          >
            <AlertCircleIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="max-w-60 min-w-52 overflow-clip border-destructive/30 bg-background p-0 dark:border-[1.75px] dark:shadow-[-30px_20px_30px_0_oklch(0.205_0_0)]"
          ref={ref}
          {...props}
        >
          <div className="bg-destructive/10 px-3 py-2">
            <p className="mb-1 font-medium">Errors</p>
            <ul className="list-disc pl-3">
              {Object.entries(errors).map(([field, errors]) =>
                errors.map((error, ind) => (
                  <li
                    key={`${field}-${ind}`}
                    className="text-[0.8rem] text-pretty text-destructive-foreground/80"
                  >
                    {error.message}
                  </li>
                )),
              )}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default EventForm;
