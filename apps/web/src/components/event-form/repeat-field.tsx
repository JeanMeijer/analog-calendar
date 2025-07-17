import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface RepeatFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const RepeatField = ({ value, onChange }: RepeatFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">day</SelectItem>
          <SelectItem value="week">week</SelectItem>
          <SelectItem value="month">month</SelectItem>
          <SelectItem value="year">year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

type RepeatInterval = "day" | "week" | "month" | "year";

interface RepeatIntervalSelectProps {
  className?: string;
  value: RepeatInterval;
  onChange: (value: RepeatInterval) => void;
}

function RepeatIntervalSelect({
  className,
  value,
  onChange,
}: RepeatIntervalSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">day</SelectItem>
        <SelectItem value="week">week</SelectItem>
        <SelectItem value="month">month</SelectItem>
        <SelectItem value="year">year</SelectItem>
      </SelectContent>
    </Select>
  );
}

type RepeatDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface RepeatDayToggleGroupProps {
  className?: string;
  value: RepeatDay;
  onChange: (value: RepeatDay) => void;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Mo" },
  { value: "tuesday", label: "Tu" },
  { value: "wednesday", label: "We" },
  { value: "thursday", label: "Th" },
  { value: "friday", label: "Fr" },
  { value: "saturday", label: "Sa" },
  { value: "sunday", label: "Su" },
] as const;

function RepeatDayToggleGroup({
  className,
  value,
  onChange,
}: RepeatDayToggleGroupProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onChange}
      className={cn("w-[180px]", className)}
    >
      {DAYS_OF_WEEK.map((day) => (
        <ToggleGroupItem key={day.value} value={day.value}>
          {day.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
