"use client";

import * as React from "react";
import { useResizeObserver } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";

import { Calendar } from "@repo/api/providers/interfaces";

import { useCalendarsVisibility } from "@/atoms";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTRPC } from "@/lib/trpc/client";
import { CalendarToggle } from "./calendar-toggle";

interface VisibleCalendarProps {
  calendars?: Calendar[];
}

function VisibleCalendars({ calendars }: VisibleCalendarProps) {
  return (
    <div className="flex -space-x-1">
      {calendars
        ?.slice(0, calendars.length > 3 ? 3 : calendars.length)
        .map((calendar) => (
          <div
            key={calendar.id}
            className="size-4 rounded-full bg-(--calendar-color) ring-2 ring-background group-hover/trigger:ring-border"
            style={
              {
                "--calendar-color": calendar.color ?? "var(--color-muted)",
              } as React.CSSProperties
            }
          ></div>
        ))}
    </div>
  );
}

function useCalendarList() {
  const trpc = useTRPC();

  return useQuery(trpc.calendars.list.queryOptions());
}

function CalendarListItem({ calendar }: { calendar: Calendar }) {
  const [calendarsVisibility, setCalendarsVisibility] =
    useCalendarsVisibility();
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isTextTruncated, setIsTextTruncated] = React.useState(false);

  // Check for text truncation whenever the element resizes
  useResizeObserver(textRef, () => {
    const element = textRef.current;
    if (element) {
      setIsTextTruncated(element.scrollWidth > element.clientWidth);
    }
  });

  const handleCalendarVisibilityChange = React.useCallback(
    (checked: boolean, calendarId: string) => {
      const newHiddenCalendars = checked
        ? calendarsVisibility.hiddenCalendars.filter((id) => id !== calendarId)
        : [...calendarsVisibility.hiddenCalendars, calendarId];

      setCalendarsVisibility({
        hiddenCalendars: newHiddenCalendars,
      });
    },
    [calendarsVisibility.hiddenCalendars, setCalendarsVisibility],
  );

  const checked = !calendarsVisibility.hiddenCalendars.includes(calendar.id);

  return (
    <CommandItem
      className="gap-3 ps-3"
      value={`${calendar.name}`}
      onSelect={() => {
        handleCalendarVisibilityChange(!checked, calendar.id);
      }}
    >
      <CalendarToggle
        style={
          {
            "--calendar-color":
              calendar.color ?? "var(--color-muted-foreground)",
          } as React.CSSProperties
        }
        className="dark:border-neutral-700"
        checked={checked}
        onCheckedChange={(checked: boolean) => {
          handleCalendarVisibilityChange(checked, calendar.id);
        }}
        primaryCalendar={calendar.primary}
      />
      {calendar.name}
    </CommandItem>
  );
}

export function CalendarPicker() {
  const [open, setOpen] = React.useState(false);

  const { data } = useCalendarList();

  const [calendarVisibility] = useCalendarsVisibility();

  const visibleCalendars = React.useMemo(() => {
    return data?.accounts
      .flatMap((account) => account.calendars)
      .filter(
        (calendar) => !calendarVisibility.hiddenCalendars.includes(calendar.id),
      );
  }, [data, calendarVisibility]);

  if (!data) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="group/trigger w-10 p-0 hover:bg-transparent dark:hover:bg-transparent"
          >
            <span className="sr-only">Select calendars</span>
            <VisibleCalendars calendars={visibleCalendars} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-fit max-w-72 min-w-64 p-0"
          side="bottom"
          align="center"
        >
          <Command>
            <CommandInput placeholder="Search calendars..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {data.accounts.map((account) => (
                <CommandGroup
                  heading={account.name}
                  key={account.id}
                  value={account.name}
                >
                  {account.calendars.map((calendar) => (
                    <CalendarListItem
                      calendar={calendar}
                      key={`${account.id}-${calendar.id}`}
                    />
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
