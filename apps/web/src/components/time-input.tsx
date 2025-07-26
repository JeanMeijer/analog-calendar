"use client";

import * as React from "react";
import { startTransition, useMemo, useState } from "react";
import { format } from "@formkit/tempo";
import { useVirtualizer } from "@tanstack/react-virtual";
import { parseDate } from "chrono-node";
import { useAtomValue } from "jotai";
import { matchSorter } from "match-sorter";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxPopover,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface FormatTimeOptions {
  value: Temporal.ZonedDateTime;
  use12Hour: boolean;
  locale: string;
}

function formatTime({ value, use12Hour, locale }: FormatTimeOptions) {
  const date = toDate({ value, timeZone: value.timeZoneId });

  if (use12Hour) {
    return format({
      date,
      format: "hh:mm a",
      locale,
      tz: value.timeZoneId,
    });
  }

  return format({
    date,
    format: "HH:mm",
    locale,
    tz: value.timeZoneId,
  });
}

interface TimeInputValue {
  key: string;
  id: number;
  time: Temporal.PlainTime;
  label: string;
  formattedIn12h: string;
  formattedIn24h: string;
}

interface CreateItemOptions {
  key?: string;
  time: Temporal.ZonedDateTime;
  use12Hour: boolean;
  locale: string;
}

function createItem({
  key,
  time,
  use12Hour,
  locale,
}: CreateItemOptions): TimeInputValue {
  const formattedIn12h = formatTime({ value: time, use12Hour: true, locale });
  const formattedIn24h = formatTime({ value: time, use12Hour: false, locale });

  return {
    key: key ?? `${time.epochMilliseconds}`,
    id: time.epochMilliseconds,
    time: time.toPlainTime(),
    label: use12Hour ? formattedIn12h : formattedIn24h,
    formattedIn12h,
    formattedIn24h,
  };
}

interface GenerateListOptions {
  locale: string;
  timeZone: string;
  use12Hour: boolean;
}

function generateList({ locale, timeZone, use12Hour }: GenerateListOptions) {
  const list: TimeInputValue[] = [];

  const startOfDay = Temporal.Now.zonedDateTimeISO(timeZone).startOfDay();

  for (let hours = 0; hours < 24; hours++) {
    const date = startOfDay.add({ hours });

    for (let minutes = 0; minutes < 60; minutes += 15) {
      const item = createItem({
        time: date.add({ minutes }),
        use12Hour,
        locale,
      });

      list.push(item);
    }
  }

  return list;
}

function useTimeSuggestions() {
  const settings = useAtomValue(calendarSettingsAtom);

  const [searchValue, setSearchValue] = useState("");
  const list = useMemo(() => {
    return generateList({
      locale: settings.locale,
      timeZone: settings.defaultTimeZone,
      use12Hour: settings.use12Hour,
    });
  }, [settings.locale, settings.defaultTimeZone, settings.use12Hour]);

  const suggestions = useMemo(() => {
    const parsedDate = parseDate(searchValue);

    const matches = matchSorter(list, searchValue, {
      keys: ["formattedIn24h"],
    });

    if (parsedDate) {
      const instant = Temporal.Instant.fromEpochMilliseconds(
        parsedDate.getTime(),
      );

      if (matches.some((item) => item.id === parsedDate.getTime())) {
        return matches;
      }

      const parsedTime = createItem({
        key: `suggestion-${parsedDate.getTime()}`,
        time: instant.toZonedDateTimeISO(settings.defaultTimeZone),
        locale: settings.locale,
        use12Hour: settings.use12Hour,
      });

      return [parsedTime].concat(matches);
    }

    return matches.map((item) => ({
      ...item,
      key: `suggestion-${item.id}`,
    }));
  }, [
    list,
    searchValue,
    settings.defaultTimeZone,
    settings.locale,
    settings.use12Hour,
  ]);

  return {
    list,
    suggestions,
    searchValue,
    setSearchValue,
  };
}

interface TimeInputProps {
  className?: string;
  id?: string;
  value: Temporal.ZonedDateTime;
  onChange: (value: Temporal.ZonedDateTime) => void;
  disabled?: boolean;
}

export function TimeInput({
  className,
  id,
  value,
  onChange,
  disabled,
}: TimeInputProps) {
  const { use12Hour, locale } = useAtomValue(calendarSettingsAtom);
  const [input, setInput] = React.useState(
    formatTime({ value, use12Hour, locale }),
  );
  const { suggestions, searchValue, setSearchValue } = useTimeSuggestions();

  React.useEffect(() => {
    setInput(formatTime({ value, use12Hour, locale }));
  }, [value, use12Hour, locale]);

  const [isOpen, setIsOpen] = React.useState(false);

  const onComplete = React.useCallback(
    (newValue: string) => {
      const date = parseDate(newValue);

      if (!date) {
        setInput(formatTime({ value, use12Hour, locale }));
        return;
      }

      const parsedZonedDateTime = value.withPlainTime({
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
      });

      onChange(parsedZonedDateTime);
      setInput(formatTime({ value: parsedZonedDateTime, use12Hour, locale }));
      setIsOpen(false);
    },
    [use12Hour, locale, value, onChange],
  );

  const onInputChange = React.useCallback((newValue: string) => {
    setInput(newValue);
  }, []);

  return (
    <Combobox
      open={isOpen}
      setOpen={setIsOpen}
      value={input}
      setValue={(value) => {
        startTransition(() => {
          setSearchValue(value);
          onInputChange(value);
        });
      }}
    >
      <ComboboxLabel className="sr-only">Time</ComboboxLabel>
      <ComboboxInput
        id={id}
        className={cn("font-medium", className)}
        onBlur={(e) => onComplete(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") {
            return;
          }

          onComplete(input);
        }}
        disabled={disabled}
      />
      <MemoizedTimeInputList
        value={value}
        searchValue={searchValue}
        suggestions={suggestions}
      />
    </Combobox>
  );
}

interface TimeInputListProps {
  value: Temporal.ZonedDateTime;
  suggestions: TimeInputValue[];
  searchValue: string;
}

function TimeInputList({ suggestions }: TimeInputListProps) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 6,
  });

  return (
    <ComboboxPopover className="max-h-64 overflow-y-auto" ref={parentRef}>
      <div
        className="relative w-full"
        style={{ height: rowVirtualizer.getTotalSize() }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = suggestions[virtualRow.index];
          return (
            <ComboboxItem
              key={item?.key}
              value={item?.label}
              className="absolute left-0 w-full ps-7 text-sm font-medium tabular-nums"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            />
          );
        })}
      </div>
    </ComboboxPopover>
  );
}

const MemoizedTimeInputList = React.memo(
  TimeInputList,
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.searchValue === nextProps.searchValue
    );
  },
);
