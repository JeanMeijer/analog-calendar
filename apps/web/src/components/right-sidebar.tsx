"use client";

import * as React from "react";

import { EventForm } from "@/components/event-form/event-form";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import type { CalendarEvent, DraftEvent } from "@/lib/interfaces";

interface RightSidebarProps extends React.ComponentProps<typeof Sidebar> {
  minSidebarWidth?: string;
  selectedEvent?: CalendarEvent | DraftEvent;
  handleEventSave: (event: CalendarEvent) => void;
}

export function RightSidebar({
  minSidebarWidth,
  selectedEvent,
  handleEventSave,
  ...props
}: RightSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarRail minSidebarWidth={minSidebarWidth} />
      <SidebarContent className="pr-0.5">
        <EventForm
          selectedEvent={selectedEvent}
          handleEventSave={handleEventSave}
        />
      </SidebarContent>
    </Sidebar>
  );
}
