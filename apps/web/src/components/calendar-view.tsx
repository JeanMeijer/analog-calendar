"use client";

import { useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { useHotkeysContext } from "react-hotkeys-hook";
import { toast } from "sonner";

import { useCalendarsVisibility, useViewPreferences } from "@/atoms";
import {
  CalendarContent,
  CalendarDndProvider,
  CalendarHeader,
  EventDialog,
  EventGap,
  EventHeight,
  WeekCellsHeight,
} from "@/components/event-calendar";
import {
  useEventDialog,
  useEventOperations,
} from "@/components/event-calendar/hooks";
import {
  filterPastEvents,
  filterVisibleEvents,
} from "@/components/event-calendar/utils";
import { Button } from "@/components/ui/button";
import { useSidebarWithSide } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  className?: string;
}

export function CalendarView({ className }: CalendarViewProps) {
  const viewPreferences = useViewPreferences();
  const [calendarVisibility] = useCalendarsVisibility();
  const { toggleSidebar: toggleRightSidebar, open: isRightSidebarOpen } =
    useSidebarWithSide("right");

  const {
    isEventDialogOpen,
    selectedEvent,
    handleEventSelect,
    handleDialogClose,
  } = useEventDialog();

  const { events, handleEventSave, handleEventDelete, handleEventMove } =
    useEventOperations(handleDialogClose);

  const filteredEvents = useMemo(
    () =>
      filterVisibleEvents(
        filterPastEvents(events, viewPreferences.showPastEvents),
        calendarVisibility.hiddenCalendars,
      ),
    [
      events,
      viewPreferences.showPastEvents,
      calendarVisibility.hiddenCalendars,
    ],
  );

  const { enableScope, disableScope } = useHotkeysContext();

  useEffect(() => {
    if (isEventDialogOpen) {
      disableScope("calendar");
    } else {
      enableScope("calendar");
    }
  }, [isEventDialogOpen, enableScope, disableScope]);

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-auto has-data-[slot=month-view]:flex-1",
        className,
      )}
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventMove}>
        <CalendarHeader />

        <div className="grow overflow-auto">
          <CalendarContent
            events={filteredEvents}
            onEventSelect={handleEventSelect}
            onEventCreate={() =>
              toast.error("Event form is not wired up yet!", {
                closeButton: false,
              })
            }
          />
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={handleDialogClose}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      </CalendarDndProvider>
      <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        data-side="right"
        size="icon"
        className={cn(
          "group/sidebar-trigger absolute right-5 bottom-5 size-12 rounded-lg border border-border/50 bg-background text-foreground/50 shadow-md transition-all duration-300 hover:scale-[104%] hover:bg-background/70 hover:text-foreground/70 hover:shadow-lg dark:border-border/70 dark:bg-muted dark:text-foreground/80 dark:hover:brightness-110",
          className,
        )}
        onClick={() => toggleRightSidebar()}
      >
        <Plus
          className={cn("size-6 transition-transform duration-300", {
            "rotate-45": isRightSidebarOpen,
          })}
          strokeWidth={1.75}
          strokeLinecap="round"
        />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </div>
  );
}
