"use client";

import type { ComponentProps } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Button,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

interface BaseCalendarProps {
  className?: string;
}

type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps;
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> &
  BaseCalendarProps;

function CalendarHeader() {
  return (
    <header className="flex w-full items-center gap-1 pb-1">
      <Button
        slot="previous"
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground/80 outline-hidden transition-[color,box-shadow] hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <ChevronLeftIcon size={16} />
      </Button>
      <HeadingRac className="grow text-center text-sm font-medium" />
      <Button
        slot="next"
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground/80 outline-hidden transition-[color,box-shadow] hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <ChevronRightIcon size={16} />
      </Button>
    </header>
  );
}

// Style constants for calendar cell styling
const BASE_CELL_STYLES =
  "relative flex size-9 items-center justify-center rounded-md p-0 text-sm font-normal whitespace-nowrap text-foreground outline-hidden [transition-property:color,background-color,border-radius,box-shadow] duration-150 data-disabled:pointer-events-none data-disabled:opacity-30 data-focus-visible:z-10 data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 data-hovered:bg-accent data-hovered:text-foreground data-selected:bg-primary data-selected:text-primary-foreground data-unavailable:pointer-events-none data-unavailable:line-through data-unavailable:opacity-30";

const RANGE_STYLES =
  "data-invalid:bg-red-100 data-selected:rounded-none data-selected:bg-accent data-selected:text-foreground data-selection-end:rounded-e-md data-selection-end:bg-primary data-selection-end:text-primary-foreground data-invalid:data-selection-end:bg-destructive data-invalid:data-selection-end:text-white data-selection-start:rounded-s-md data-selection-start:bg-primary data-selection-start:text-primary-foreground data-invalid:data-selection-start:bg-destructive data-invalid:data-selection-start:text-white";

const TODAY_INDICATOR_STYLES =
  "after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-primary";

const TODAY_RANGE_STYLES =
  "data-selection-end:after:bg-background data-selection-start:after:bg-background";

const TODAY_SINGLE_STYLES = "data-selected:after:bg-background";

const buildCalendarCellClassName = (isRange: boolean, isToday: boolean) => {
  const rangeStyles = isRange ? RANGE_STYLES : "";
  const todayStyles = isToday ? TODAY_INDICATOR_STYLES : "";
  const todayModeStyles = isToday
    ? isRange
      ? TODAY_RANGE_STYLES
      : TODAY_SINGLE_STYLES
    : "";

  return cn(
    BASE_CELL_STYLES,
    rangeStyles,
    isToday && cn(todayStyles, todayModeStyles),
  );
};

function CalendarGridComponent({ isRange = false }: { isRange?: boolean }) {
  const now = today(getLocalTimeZone());

  return (
    <CalendarGridRac>
      <CalendarGridHeaderRac>
        {(day) => (
          <CalendarHeaderCellRac className="size-9 rounded-md p-0 text-xs font-medium text-muted-foreground/80">
            {day}
          </CalendarHeaderCellRac>
        )}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0 [&_td]:py-px">
        {(date) => {
          const isToday = date.compare(now) === 0;

          return (
            <CalendarCellRac
              date={date}
              className={buildCalendarCellClassName(isRange, isToday)}
            />
          );
        }}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  );
}

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <CalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent />
    </CalendarRac>
  );
}

function RangeCalendar({ className, ...props }: RangeCalendarProps) {
  return (
    <RangeCalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent isRange />
    </RangeCalendarRac>
  );
}

export { Calendar, RangeCalendar };
