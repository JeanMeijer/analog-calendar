"use client";

import { useEffect, useRef, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { cn } from "@/lib/utils";

export function DatePicker() {
  const { currentDate, setCurrentDate, view } = useCalendarState();
  const [displayedDate, setDisplayedDate] = useState<Date>(currentDate);
  const [displayedMonth, setDisplayedMonth] = useState<Date>(currentDate);
  const updateSource = useRef<"internal" | "external">("external");

  // Prevent circular updates and animation conflicts by tracking update source:
  // - Internal (calendar clicks): Update context directly, skip useEffect
  // - External (navigation/hotkeys): Update local state via useEffect

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    updateSource.current = "internal";
    setDisplayedDate(date);
    setCurrentDate(date);
  };

  useEffect(() => {
    if (updateSource.current === "external") {
      setDisplayedDate(currentDate);
      setDisplayedMonth(currentDate);
    }
    updateSource.current = "external";
  }, [currentDate]);

  const isWeekView = view === "week";
  const isDayView = view === "day" || view === "agenda";

  return (
    <Calendar
      animate
      mode="single"
      required
      fixedWeeks
      selected={displayedDate}
      onSelect={handleSelect}
      month={displayedMonth}
      onMonthChange={setDisplayedMonth}
      className={cn("w-full px-0 [&_[role=gridcell]]:w-[33px]")}
      todayClassName={cn(
        "[&>button]:!bg-sidebar-primary [&>button]:!text-sidebar-primary-foreground",
        "[&>button:hover]:!bg-sidebar-primary [&>button:hover]:brightness-90",
        "[&>button]:font-medium",
      )}
      selectedClassName={cn(
        "[&>button]:text-sidebar-foreground [&>button]:bg-transparent",
        "[&>button:hover]:text-sidebar-primary-foreground [&>button:hover]:bg-sidebar-primary/80",
        "[&>button:focus]:bg-sidebar-primary [&>button:focus]:text-sidebar-primary-foreground",
        isDayView &&
          "dark:[&>button]:bg-sidebar-foreground/8 [&>button]:bg-sidebar-foreground/4",
      )}
      dayButtonClassName="hover:bg-sidebar-foreground/10 dark:hover:bg-sidebar-foreground/15"
      weekClassName={cn(
        "relative z-0 before:-z-10 before:absolute before:content-[''] before:inset-0 before:rounded-md",
        "[&:has([aria-selected=true])]:before:bg-sidebar-foreground/4",
        "dark:[&:has([aria-selected=true])]:before:bg-sidebar-foreground/8",
        !isWeekView && "before:hidden",
      )}
      weekdayClassName="flex-1 text-sidebar-foreground/70 font-medium"
      outsideClassName="aria-selected:opacity-100 aria-selected:bg-transparent"
      navClassName="[&>button]:z-10"
    />
  );
}
