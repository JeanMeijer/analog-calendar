"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { CalendarView } from "@/components/calendar-view";
import { useEventOperations } from "@/components/event-calendar";
import { RightSidebar } from "@/components/right-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export function CalendarLayout() {
  return (
    <>
      <AppSidebar variant="inset" side="left" />
      <IsolatedCalendarLayout />
    </>
  );
}

function IsolatedCalendarLayout() {
  const {
    events,
    selectedEvents,
    handleEventMove,
    handleEventSelect,
    handleEventSave,
    handleEventCreate,
  } = useEventOperations();

  return (
    <>
      <SidebarInset className="h-full overflow-hidden">
        <div className="flex h-[calc(100dvh-1rem)]">
          <CalendarView
            className="grow"
            events={events}
            handleEventMove={handleEventMove}
            handleEventSelect={handleEventSelect}
            handleEventCreate={handleEventCreate}
          />
        </div>
      </SidebarInset>
      <RightSidebar
        variant="inset"
        side="right"
        selectedEvent={selectedEvents[0]}
        handleEventSave={handleEventSave}
      />
    </>
  );
}
