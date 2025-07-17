"use client";

import { usePrevious } from "@react-hookz/web";

import type { ViewPreferences } from "@/atoms/view-preferences";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { cn } from "@/lib/utils";
import { CalendarPicker } from "../calendar-picker";
import { CalendarNavigation } from "./calendar-navigation";
import { CalendarViewMenu } from "./calendar-view-menu";
import { CalendarViewTitle } from "./calendar-view-title";

type CalendarHeaderProps = React.ComponentProps<"header"> & {
  viewPreferences: ViewPreferences;
};

export function CalendarHeader({
  className,
  ref,
  viewPreferences,
}: CalendarHeaderProps) {
  const { currentDate, view, setView } = useCalendarState();
  const prevDate = usePrevious(currentDate);

  return (
    <header
      className={cn(
        "@container/header flex h-12 items-center justify-between gap-2 p-2 ps-4",
        className,
      )}
      ref={ref}
    >
      <div className="flex flex-1 items-center gap-1 sm:gap-4">
        <SidebarTrigger className="-ml-1 @max-md/header:hidden" />
        <CalendarViewTitle
          prevDate={prevDate}
          currentDate={currentDate}
          view={view}
          className="text-sm font-medium sm:text-lg md:text-xl"
          viewPreferences={viewPreferences}
        />
      </div>

      <div className="flex items-center gap-2">
        <CalendarPicker />

        <CalendarNavigation />

        <CalendarViewMenu currentView={view} onViewChange={setView} />
      </div>
    </header>
  );
}
