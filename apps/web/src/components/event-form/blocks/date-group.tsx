"use client";

import { useCallback, useMemo } from "react";
import { parseDate, type CalendarDate } from "@internationalized/date";
import { useField, useStore } from "@tanstack/react-form";
import { differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import {
  Button,
  DatePicker,
  DateRangePicker,
  Dialog,
  Group,
  Label,
  Popover,
  type DatePickerProps,
} from "react-aria-components";

import { withForm } from "@/components/event-form/hooks/form";
import { defaultFormOptions } from "@/components/event-form/support/form-defaults";
import { Calendar, RangeCalendar } from "@/components/ui/calendar-rac";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFormData } from "@/lib/schemas/event-form";
import { cn } from "@/lib/utils";

type DateRange = {
  start: CalendarDate;
  end: CalendarDate;
};

const getDateRange = (startDate: string, endDate: string) => {
  return {
    start: parseDate(startDate),
    end: parseDate(endDate),
  };
};

const getDurationInDays = (range: DateRange) => {
  const start = range.start.toDate("UTC");
  const end = range.end.toDate("UTC");
  return differenceInDays(end, start);
};

const segmentClassName =
  "data-focused:bg-blue-100 data-focused:text-blue-800 dark:data-focused:bg-blue-300/10 dark:data-focused:text-blue-400 px-1";

const DateGroup = withForm({
  ...defaultFormOptions,
  render: function Render({ form }) {
    const startField = useField({ name: "startDate", form });
    const endField = useField({ name: "endDate", form });
    const repeats = useStore(form.store, (state) => state.values.repeats);

    const [range, duration] = useMemo(() => {
      if (!repeats) return [null, 0];
      const range = getDateRange(startField.state.value, endField.state.value);
      const duration = getDurationInDays(range);
      return [range, duration];
    }, [startField.state.value, endField.state.value, repeats]);

    return (
      <div className="-ml-0.5 flex flex-col">
        {repeats ? (
          <DateRangeInput
            range={range as DateRange}
            onStartDateChange={startField.handleChange}
            onEndDateChange={(value) => endField.handleChange(value)}
            isInvalid={startField.state.meta.isValid === false}
          />
        ) : (
          <SingleDateInput
            value={parseDate(startField.state.value)}
            onChange={(value) => {
              if (value) {
                const date = value.toString();
                startField.handleChange(date);
                endField.handleChange(date);
              }
            }}
            isInvalid={startField.state.meta.isValid === false}
          />
        )}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: repeats ? 1 : 0,
            height: repeats ? "fit-content" : 0,
          }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="overflow-hidden pl-0.5"
        >
          <div className="pt-2">
            <form.Field name="repeatType">
              {(repeatTypeField) => (
                <RepeatTypeSelect
                  rangeDuration={duration}
                  value={repeatTypeField.state.value}
                  onChange={repeatTypeField.handleChange}
                />
              )}
            </form.Field>
          </div>
        </motion.div>
      </div>
    );
  },
});

function SingleDateInput({
  value,
  onChange,
  isInvalid,
}: DatePickerProps<CalendarDate>) {
  return (
    <DatePicker value={value} onChange={onChange} isInvalid={isInvalid}>
      <Label className="sr-only">Pick a date</Label>
      <div className="flex">
        <Group className="w-full leading-none">
          <DateInput
            className="h-6 rounded-none border-none bg-transparent p-0 shadow-none data-focus-within:ring-0"
            segmentClassName={segmentClassName}
          />
        </Group>
        <Button className="z-10 flex w-fit items-center justify-center rounded px-0.5 text-muted-foreground/80 outline-hidden transition-[color,box-shadow] hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
          <CalendarIcon className="size-4" />
        </Button>
      </div>
      <WithPopover>
        <Calendar />
      </WithPopover>
    </DatePicker>
  );
}

function DateRangeInput({
  range,
  onStartDateChange,
  onEndDateChange,
  isInvalid,
}: {
  range: DateRange;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  isInvalid?: boolean;
}) {
  const handleChange = useCallback(
    (value: DateRange | null) => {
      if (value) {
        onStartDateChange(value.start.toString());
        onEndDateChange(value.end.toString());
      }
    },
    [onStartDateChange, onEndDateChange],
  );

  return (
    <DateRangePicker
      value={range}
      onChange={handleChange}
      isInvalid={isInvalid}
    >
      <Label className="sr-only">Pick a date range</Label>
      <div className="flex">
        <Group
          className={cn(
            dateInputStyle,
            "h-6 rounded-none border-none bg-transparent p-0 shadow-none data-focus-within:ring-0",
          )}
        >
          <DateInput
            slot="start"
            segmentClassName={segmentClassName}
            unstyled
          />
          <span aria-hidden="true" className="px-2 text-muted-foreground/70">
            -
          </span>
          <DateInput slot="end" segmentClassName={segmentClassName} unstyled />
        </Group>
        <Button className="z-10 flex w-fit items-center justify-center rounded px-0.5 text-muted-foreground/80 outline-hidden transition-[color,box-shadow] hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
          <CalendarIcon className="size-4" />
        </Button>
      </div>
      <WithPopover>
        <RangeCalendar />
      </WithPopover>
    </DateRangePicker>
  );
}

type RepeatType = EventFormData["repeatType"];

function RepeatTypeSelect({
  value,
  onChange,
  rangeDuration,
}: {
  value: RepeatType;
  onChange: (value: RepeatType) => void;
  rangeDuration: number;
}) {
  const handleChange = useCallback(
    (value: string) => value && onChange(value as RepeatType),
    [onChange],
  );

  return (
    <Select value={value ?? "daily"} onValueChange={handleChange}>
      <SelectTrigger className="h-6 w-[calc(50%+0.5rem)] border-none !bg-transparent pr-0 pl-0.5 text-sm text-muted-foreground/80 shadow-none select-none hover:text-foreground hover:[&_svg]:text-foreground">
        <SelectValue placeholder="Repeat pattern" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily" disabled={rangeDuration === 0}>
          Every day until
        </SelectItem>
        <SelectItem value="weekly" disabled={rangeDuration < 7}>
          Every week until
        </SelectItem>
        <SelectItem
          value="monthly"
          className="pe-5"
          disabled={rangeDuration < 30}
        >
          Every month until
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function WithPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover
      offset={5}
      crossOffset={11}
      className="z-50 rounded-md border border-input bg-popover text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
    >
      <Dialog className="max-h-[inherit] overflow-auto p-2">{children}</Dialog>
    </Popover>
  );
}

export default DateGroup;
