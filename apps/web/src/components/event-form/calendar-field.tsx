import * as React from "react";

import {
  CalendarListPicker,
  CalenderAccount,
} from "@/components/calendar-picker";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import type { Calendar } from "@/lib/interfaces";
import { cn } from "@/lib/utils";

interface CalendarFieldProps {
  id: string;
  className?: string;
  items: CalenderAccount[];
  value: { accountId: string; calendarId: string };
  onChange: (calendar: { accountId: string; calendarId: string }) => void;
  disabled?: boolean;
}

export function CalendarField({
  id,
  className,
  value,
  onChange,
  disabled,
  items,
  ...props
}: CalendarFieldProps) {
  const onSelect = React.useCallback(
    (calendar: Calendar) => {
      onChange({ accountId: calendar.accountId, calendarId: calendar.id });
    },
    [onChange],
  );

  const selected = React.useMemo(() => {
    return items
      .flatMap((item) => item.calendars)
      .find((item) => item.id === value.calendarId);
  }, [items, value]);

  return (
    <CalendarListPicker items={items} onSelect={onSelect} value={selected}>
      <PopoverTrigger
        id={id}
        className={cn(
          "flex h-9 w-full items-center gap-2 font-medium",
          className,
        )}
        disabled={disabled}
        {...props}
        asChild
      >
        <Button variant="ghost" className="grow justify-start text-sm">
          <div className="size-5 p-1">
            <div
              className={cn(
                "size-3 rounded-[4px] bg-(--calendar-color)",
                selected?.primary &&
                  "outline-2 outline-offset-2 outline-(--calendar-color)",
                disabled && "opacity-50",
              )}
              style={
                {
                  "--calendar-color":
                    selected?.color ?? "var(--color-muted-foreground)",
                } as React.CSSProperties
              }
            />
          </div>
          {selected?.name}
        </Button>
      </PopoverTrigger>
    </CalendarListPicker>
  );
}
