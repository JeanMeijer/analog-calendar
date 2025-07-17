"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RepeatIcon } from "lucide-react";

import {
  CalendarSettings,
  useCalendarSettings,
} from "@/atoms/calendar-settings";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import {
  createDefaultEvent,
  parseCalendarEvent,
  parseDraftEvent,
  toCalendarEvent,
} from "@/components/event-form/utils";
import * as Icons from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Calendar, CalendarEvent, DraftEvent } from "@/lib/interfaces";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { createEventId, isDraftEvent } from "@/lib/utils/calendar";
import {
  AttendeeList,
  AttendeeListInput,
  AttendeeListItem,
} from "./attendee-list";
import { CalendarField } from "./calendar-field";
import { DateInputSection } from "./date-input-section";
import { DescriptionField } from "./description-field";
import { FormValues, defaultValues, formSchema, useAppForm } from "./form";
import { RepeatSelect } from "./repeat-select";

interface GetDefaultValuesOptions {
  event?: CalendarEvent | DraftEvent;
  defaultCalendar?: Calendar;
  settings: CalendarSettings;
}

function getDefaultValues({
  event,
  defaultCalendar,
  settings,
}: GetDefaultValuesOptions): FormValues {
  if (!defaultCalendar) {
    return {
      ...defaultValues,
      id: createEventId(),
    };
  }

  if (!event) {
    return createDefaultEvent({ settings, defaultCalendar });
  }

  if (isDraftEvent(event)) {
    return parseDraftEvent({
      event,
      defaultCalendar,
      settings,
    });
  }

  return parseCalendarEvent({ event, settings });
}

interface EventFormProps {
  selectedEvent?: CalendarEvent | DraftEvent;
  dispatchAsyncAction: (action: Action) => Promise<void>;
  defaultCalendar?: Calendar;
}

export function EventForm({
  selectedEvent,
  dispatchAsyncAction,
  defaultCalendar,
}: EventFormProps) {
  const settings = useCalendarSettings();

  const trpc = useTRPC();
  const query = useQuery(trpc.calendars.list.queryOptions());

  const [event, setEvent] = React.useState(selectedEvent);

  const disabled = event?.readOnly;

  const form = useAppForm({
    defaultValues: getDefaultValues({ event, defaultCalendar, settings }),
    validators: {
      onBlur: formSchema,
      onSubmit: ({ value }) => {
        const calendar = query.data?.accounts
          .flatMap((a) => a.calendars)
          .find((c) => c.id === value.calendar.calendarId);

        if (!calendar) {
          return {
            fields: {
              calendar: "Calendar not found",
            },
          };
        }

        const isNewEvent = !selectedEvent || isDraftEvent(selectedEvent);
        if (isNewEvent && value.title.trim() === "") {
          return {
            fields: {
              title: "Title is required",
            },
          };
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const calendar = query.data?.accounts
        .flatMap((a) => a.calendars)
        .find((c) => c.id === value.calendar.calendarId);

      await dispatchAsyncAction({
        type: "update",
        event: toCalendarEvent({ values: value, event, calendar }),
      });
    },
    listeners: {
      onBlur: async ({ formApi }) => {
        if (!formApi.state.isValid || !formApi.state.isDirty) {
          return;
        }

        await formApi.handleSubmit();
      },
    },
  });

  React.useEffect(() => {
    // If the form is modified and the event changes, keep the modified values
    if (form.state.isDirty && selectedEvent?.id === event?.id) {
      return;
    }

    setEvent(selectedEvent);

    form.reset();
  }, [selectedEvent, event, form]);

  return (
    <form
      className={cn("flex flex-col gap-y-1")}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await form.handleSubmit();
      }}
    >
      <div className="p-1">
        <form.Field name="title">
          {(field) => (
            <>
              <label htmlFor={field.name} className="sr-only">
                Title
              </label>
              <Input
                id={field.name}
                className="border-none bg-transparent px-3.5 text-base shadow-none dark:bg-transparent"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                placeholder="Title"
                disabled={disabled}
              />
            </>
          )}
        </form.Field>
      </div>
      <FormContainer>
        <div className="px-2.5">
          <DateInputSection form={form} disabled={disabled} />
        </div>
        <Separator />
        <FormRow className="gap-x-1">
          <div className="pointer-events-none absolute inset-0 grid grid-cols-(--grid-event-form) items-center gap-2">
            <div className="col-start-3 ps-1.5">
              <RepeatIcon className="size-4 text-muted-foreground opacity-50 peer-hover:text-foreground" />
            </div>
          </div>
          <form.Field name="isAllDay">
            {(field) => (
              <>
                <div className="col-start-1 flex ps-2">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    onBlur={field.handleBlur}
                    size="sm"
                    disabled={disabled}
                  />
                </div>
                <Label
                  htmlFor={field.name}
                  className={cn(
                    "col-start-2 ps-3.5",
                    disabled && "text-muted-foreground/70",
                  )}
                >
                  All Day
                </Label>
              </>
            )}
          </form.Field>
          <form.Field name="repeat">
            {(field) => (
              <div className="relative col-span-2 col-start-3">
                <label htmlFor={field.name} className="sr-only">
                  Repeat
                </label>
                <RepeatSelect
                  id={field.name}
                  className="ps-8 shadow-none"
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  disabled={disabled}
                />
              </div>
            )}
          </form.Field>
        </FormRow>
        <Separator />
        <FormRow>
          <div className="pointer-events-none absolute inset-0 grid grid-cols-(--grid-event-form) items-start gap-2 pt-2">
            <div className="col-start-1 ps-4">
              <Icons.Attendees className="size-4 text-muted-foreground opacity-50 peer-hover:text-foreground" />
            </div>
          </div>
          <form.Field name="attendees" mode="array">
            {(field) => {
              return (
                <>
                  <div className="col-span-4 col-start-1 flex flex-col">
                    <AttendeeList
                      className={cn(field.state.value.length > 0 && "py-2")}
                    >
                      {field.state.value.map((v, i) => {
                        return (
                          <form.Field
                            key={`${field.name}-${v.email}`}
                            name={`attendees[${i}]`}
                          >
                            {(subField) => {
                              return (
                                <AttendeeListItem
                                  name={subField.state.value.name}
                                  email={subField.state.value.email}
                                  status={subField.state.value.status}
                                  type={subField.state.value.type}
                                />
                              );
                            }}
                          </form.Field>
                        );
                      })}
                    </AttendeeList>
                  </div>
                  <div
                    className={cn(
                      "col-span-4 col-start-1",
                      field.state.value.length > 0 && "col-span-3 col-start-2",
                    )}
                  >
                    <AttendeeListInput
                      className={cn(
                        "ps-8",
                        field.state.value.length > 0 && "ps-3",
                      )}
                      onComplete={(email) => {
                        field.pushValue({
                          email,
                          status: "unknown",
                          type: "required",
                        });
                      }}
                      disabled={disabled}
                    />
                  </div>
                </>
              );
            }}
          </form.Field>
        </FormRow>
        <Separator />
        <FormRow>
          <div className="pointer-events-none absolute inset-0 grid grid-cols-(--grid-event-form) items-start gap-2 pt-2">
            <div className="col-start-1 ps-4">
              <Icons.Notes className="size-4 text-muted-foreground opacity-50 peer-hover:text-foreground" />
            </div>
          </div>
          <form.Field name="description">
            {(field) => (
              <div className="col-span-4 col-start-1">
                <label htmlFor={field.name} className="sr-only">
                  Description
                </label>
                <DescriptionField
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={disabled}
                />
              </div>
            )}
          </form.Field>
        </FormRow>
      </FormContainer>
      <div className="">
        <form.Field name="calendar">
          {(field) => (
            <>
              <label htmlFor={field.name} className="sr-only">
                Title
              </label>
              <CalendarField
                className="px-4 text-base"
                id={field.name}
                value={field.state.value}
                items={query.data?.accounts ?? []}
                onChange={(value) => {
                  field.handleChange(value);
                  field.handleBlur();
                }}
                disabled={disabled}
              />
            </>
          )}
        </form.Field>
      </div>
    </form>
  );
}

function FormRow({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-(--grid-event-form) items-center px-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function FormContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 rounded-2xl border border-input bg-background px-0.5 py-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
