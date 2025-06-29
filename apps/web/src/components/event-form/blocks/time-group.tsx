"use client";

import { useCallback } from "react";
import {
  getLocalTimeZone,
  now,
  parseTime,
  toTime,
  type Time,
} from "@internationalized/date";
import { useField, useStore } from "@tanstack/react-form";
import { ArrowRight, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Label as AriaLabel, type TimeFieldProps } from "react-aria-components";

import { withForm } from "@/components/event-form/hooks/form";
import { Button } from "@/components/ui/button";
import { DateInput, TimeField } from "@/components/ui/datefield-rac";
import { cn } from "@/lib/utils";
import { defaultFormOptions } from "../support/form-defaults";
import { TimezoneSelect } from "./timezone-select";

const safeParseTime = (time: string | null) => {
  if (!time) return null;
  try {
    return parseTime(time);
  } catch {
    return null;
  }
};

const TimeGroup = withForm({
  ...defaultFormOptions,
  render: function Render({ form }) {
    const isAllDay = useStore(form.store, (state) => state.values.isAllDay);
    const startField = useField({ name: "startTime", form });
    const endField = useField({ name: "endTime", form });

    const getDurationChangeHandler = useCallback(
      (minutes: number) => () => {
        let start = safeParseTime(startField.state.value);
        if (!start) {
          const nowTime = now(getLocalTimeZone()).set({
            second: 0,
            millisecond: 0,
          });
          start = toTime(nowTime);
          startField.handleChange(start.toString());
        }
        const end = start.add({ minutes });
        endField.handleChange(end.toString());
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [startField.state.value, startField.handleChange, endField.handleChange],
    );

    return (
      <AnimatePresence initial={false}>
        {!isAllDay && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{
              opacity: 1,
              height: "fit-content",
              marginBottom: "0.2rem",
            }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
          >
            <section className="-ml-0.5 flex flex-col gap-y-2.5 pb-2.5">
              <div className="grid grid-cols-[1fr_auto_1fr] pl-0.5">
                <div className="flex items-center">
                  <Clock
                    className="size-4 text-muted-foreground/80 hover:text-foreground"
                    aria-hidden="true"
                  />
                  <StyledTimeField
                    label="Start Time"
                    className="flex-1 pr-9 md:pr-7"
                    inputClassName="justify-end"
                    value={safeParseTime(startField.state.value)}
                    onChange={(value) =>
                      value && startField.handleChange(value.toString())
                    }
                    isInvalid={startField.state.meta.isValid === false}
                  />
                </div>
                <ArrowRight className="size-4 self-center text-muted-foreground/80" />
                <StyledTimeField
                  label="End Time"
                  className="flex-1 pl-9 md:pl-7"
                  value={safeParseTime(endField.state.value)}
                  onChange={(value) =>
                    value && endField.handleChange(value.toString())
                  }
                  isInvalid={endField.state.meta.isValid === false}
                />
              </div>
              <ActionsRow durationChangeHandler={getDurationChangeHandler}>
                <form.Field name="timezone">
                  {(field) => (
                    <TimezoneSelect
                      className="h-5 gap-0 text-xs shadow-none"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                </form.Field>
              </ActionsRow>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
});

function ActionsRow({
  children,
  durationChangeHandler,
}: {
  children: React.ReactNode;
  durationChangeHandler: (minutes: number) => () => void;
}) {
  return (
    <div className="flex gap-x-1">
      <ActionTag onClick={durationChangeHandler(15)}>15 m</ActionTag>
      <ActionTag onClick={durationChangeHandler(30)}>30 m</ActionTag>
      <ActionTag onClick={durationChangeHandler(60)}>1 h</ActionTag>
      <ActionTag onClick={durationChangeHandler(120)}>2 h</ActionTag>
      {children}
    </div>
  );
}

function ActionTag({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="relative h-5 min-w-11 rounded-md border border-input bg-background/40 px-2 text-xs font-medium select-none"
      {...props}
    >
      {children}
    </Button>
  );
}

function StyledTimeField({
  label,
  inputClassName,
  ...props
}: {
  label: string;
  inputClassName?: string;
} & TimeFieldProps<Time>) {
  return (
    <TimeField hourCycle={24} {...props}>
      <AriaLabel className="sr-only" htmlFor={props.name}>
        {label}
      </AriaLabel>
      <DateInput
        className={cn(
          "text-md inline-flex h-6 w-full items-center border-none bg-transparent shadow-none data-focus-within:ring-0",
          inputClassName,
        )}
        segmentClassName="data-focused:bg-blue-100 data-focused:text-blue-800 dark:data-focused:bg-blue-300/10 dark:data-focused:text-blue-400 px-1"
        unstyled
      />
    </TimeField>
  );
}

export default TimeGroup;
