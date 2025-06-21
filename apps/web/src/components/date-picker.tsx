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
      todayClassName="[&>button]:!bg-sidebar-primary hover:[&>button]:!bg-sidebar-primary [&>button]:font-medium hover:opacity-80"
      selectedClassName={cn(
        "[&>button]:text-sidebar-primary-foreground hover:[&>button]:text-sidebar-primary-foreground hover:filter hover:brightness-[0.8] focus:[&>button]:bg-sidebar-primary focus:[&>button]:text-sidebar-primary-foreground",
        "[&>button]:bg-transparent",
        isDayView &&
          "dark:[&>button]:!bg-sidebar-foreground/10 [&>button]:!bg-sidebar-foreground/5",
      )}
      dayButtonClassName="dark:hover:bg-sidebar-foreground/15"
      weekClassName={cn(
        "relative z-0 before:-z-10 before:absolute before:content-[''] before:inset-0 before:rounded-md dark:[&:has([aria-selected=true])]:before:bg-sidebar-foreground/10 [&:has([aria-selected=true])]:before:bg-sidebar-foreground/5",
        !isWeekView && "before:hidden",
      )}
      weekdayClassName="flex-1"
      outsideClassName="aria-selected:opacity-100 aria-selected:bg-transparent"
      navClassName="[&>button]:z-10"
    />
  );
}
