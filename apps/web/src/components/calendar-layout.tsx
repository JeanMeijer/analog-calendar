"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import {
  calendarSettingsAtom,
  defaultTimeZone,
} from "@/atoms/calendar-settings";
import { AppSidebar } from "@/components/app-sidebar";
import { CalendarView } from "@/components/calendar-view";
import { EventForm } from "@/components/event-form/event-form";
import { RightSidebar } from "@/components/right-sidebar";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { SidebarInset, useSidebarWithSide } from "@/components/ui/sidebar";
import { EventHotkeys } from "@/lib/hotkeys/event-hotkeys";
import { useTRPC } from "@/lib/trpc/client";
import { useOptimisticEvents } from "./event-calendar/hooks/use-optimistic-events";

export function CalendarLayout() {
  const [, setSettings] = useAtom(calendarSettingsAtom);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      defaultTimeZone,
    }));
  }, [setSettings]);

  return (
    <>
      <AppSidebar variant="inset" side="left" className="hidden md:flex" />
      <IsolatedCalendarLayout />
    </>
  );
}

function IsolatedCalendarLayout() {
  const trpc = useTRPC();
  const query = useQuery(trpc.calendars.list.queryOptions());

  const { events, selectedEvents, dispatchAction, dispatchAsyncAction } =
    useOptimisticEvents();
  const { openMobile, setOpenMobile } = useSidebarWithSide("right");
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  return (
    <>
      <EventHotkeys
        selectedEvent={selectedEvents[0]}
        dispatchAction={dispatchAction}
      />
      {(isMobile ?? true) && (
        <Drawer
          open={openMobile}
          onOpenChange={setOpenMobile}
          className="md:hidden"
        >
          <DrawerContent className="max-h-[80vh] overflow-y-auto">
            <EventForm
              selectedEvent={selectedEvents[0]}
              dispatchAsyncAction={dispatchAsyncAction}
              defaultCalendar={query.data?.defaultCalendar}
            />
          </DrawerContent>
        </Drawer>
      )}
      <SidebarInset className="h-full overflow-hidden">
        <div className="flex h-[calc(100dvh-1rem)]">
          <CalendarView
            className="grow"
            events={events}
            dispatchAction={dispatchAction}
          />
        </div>
      </SidebarInset>
      {(isMobile === undefined || !isMobile) && (
        <RightSidebar variant="inset" side="right" className="hidden md:flex">
          <EventForm
            selectedEvent={selectedEvents[0]}
            dispatchAsyncAction={dispatchAsyncAction}
            defaultCalendar={query.data?.defaultCalendar}
          />
        </RightSidebar>
      )}
    </>
  );
}
