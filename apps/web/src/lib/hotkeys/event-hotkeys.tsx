"use client";

import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Temporal } from "temporal-polyfill";

import { useCalendarSettings } from "@/atoms";
import { DeleteEventConfirmation } from "@/components/delete-event-confirmation";
import type { Action } from "@/components/event-calendar/hooks/use-optimistic-events";
import { useSidebarWithSide } from "@/components/ui/sidebar";
import type { CalendarEvent, DraftEvent } from "@/lib/interfaces";
import { createDraftEvent } from "@/lib/utils/calendar";

export const KEYBOARD_SHORTCUTS = {
  CREATE_EVENT: "c",
  JOIN_MEETING: "j",
  DELETE_EVENT: "backspace",
  UNSELECT_EVENT: "esc",
} as const;

interface CalendarHotkeysProps {
  dispatchAction: (action: Action) => void;
  selectedEvent: CalendarEvent | DraftEvent | undefined;
}

export function EventHotkeys({
  dispatchAction,
  selectedEvent,
}: CalendarHotkeysProps) {
  const { open: rightSidebarOpen, setOpen: setRightSidebarOpen } =
    useSidebarWithSide("right");
  const settings = useCalendarSettings();

  useHotkeys(
    KEYBOARD_SHORTCUTS.CREATE_EVENT,
    () => {
      const start = Temporal.Now.zonedDateTimeISO(settings.defaultTimeZone);

      const end = start.add({ minutes: settings.defaultEventDuration });

      if (!rightSidebarOpen) {
        setRightSidebarOpen(true);
      }

      const event = createDraftEvent({ start, end });

      dispatchAction({
        type: "draft",
        event,
      });
    },
    { scopes: ["event"] },
  );

  useHotkeys(
    KEYBOARD_SHORTCUTS.JOIN_MEETING,
    () => {
      if (!selectedEvent || !selectedEvent.conference) {
        return;
      }

      window.open(
        selectedEvent.conference.joinUrl,
        "_blank",
        "noopener,noreferrer",
      );
    },
    { scopes: ["event"] },
  );

  useHotkeys(
    KEYBOARD_SHORTCUTS.DELETE_EVENT,
    () => {
      if (!selectedEvent) {
        return;
      }

      setOpen(true);
    },
    { scopes: ["event"] },
  );

  useHotkeys(
    KEYBOARD_SHORTCUTS.UNSELECT_EVENT,
    () => {
      dispatchAction({ type: "unselect" });
    },
    { scopes: ["event"] },
  );

  const [open, setOpen] = React.useState(false);

  if (!selectedEvent) {
    return null;
  }

  return (
    <DeleteEventConfirmation
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => {
        dispatchAction({ type: "delete", eventId: selectedEvent.id });
      }}
    />
  );
}
