"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";

import { CalendarEvent } from "@/components/event-calendar/types";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Action } from "./hooks/use-optimistic-events";

function CalendarRadioItem({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "peer relative size-3 shrink-0 rounded-[4px] outline-hidden",
        "ring-offset-2 ring-offset-popover focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary",
        "bg-(--calendar-color) disabled:bg-muted",
        disabled && "bg-(--calendar-color)/50",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 flex size-3 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon
            className="size-2.5 stroke-white/80 dark:stroke-black/60"
            size={10}
            strokeWidth={4}
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

interface EventContextMenuCalendarListProps {
  disabled?: boolean;
}

function EventContextMenuCalendarList({
  disabled,
}: EventContextMenuCalendarListProps) {
  const trpc = useTRPC();
  const calendarQuery = useQuery(trpc.calendars.list.queryOptions());

  return (
    <div className="mb-1 flex scrollbar-hidden gap-3 overflow-x-auto px-2 py-2">
      {calendarQuery.data?.accounts.map((account, index) => (
        <React.Fragment key={index}>
          {account.calendars.map((calendar, index) => (
            <Tooltip key={index}>
              <CalendarRadioItem
                value={`${calendar.accountId}-${calendar.id}`}
                style={
                  {
                    "--calendar-color": calendar.color,
                  } as React.CSSProperties
                }
                disabled={disabled}
              ></CalendarRadioItem>
              <TooltipContent className="w-full max-w-48" sideOffset={8}>
                <span className="break-all">{calendar.name}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

interface EventContextMenuProps {
  event: CalendarEvent;
  children: React.ReactNode;
  dispatchAction: (action: Action) => void;
}

export function EventContextMenu({
  event,
  children,
  dispatchAction,
}: EventContextMenuProps) {
  const responseStatus = React.useMemo(() => {
    return event.attendees?.find((attendee) => attendee.email === " ")?.status;
  }, [event]);

  const handleDelete = () => {
    dispatchAction({ type: "delete", eventId: event.id });
  };

  return (
    <ContextMenu>
      {children}
      <ContextMenuContent className="w-64">
        <ContextMenuRadioGroup value={`${event.accountId}-${event.calendarId}`}>
          <EventContextMenuCalendarList disabled />
        </ContextMenuRadioGroup>

        <ContextMenuSeparator />
        {/* Status options */}
        <ContextMenuCheckboxItem
          className="font-medium"
          checked={responseStatus === "accepted"}
          disabled={!responseStatus}
        >
          Going
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            Y
          </KeyboardShortcut>
        </ContextMenuCheckboxItem>

        <ContextMenuCheckboxItem
          className="font-medium"
          checked={responseStatus === "tentative"}
          disabled={!responseStatus}
        >
          Maybe
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            M
          </KeyboardShortcut>
        </ContextMenuCheckboxItem>

        <ContextMenuCheckboxItem
          className="font-medium"
          checked={responseStatus === "declined"}
          disabled={!responseStatus}
        >
          Not going
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            N
          </KeyboardShortcut>
        </ContextMenuCheckboxItem>

        <ContextMenuSeparator />

        {/* Meeting actions */}
        <ContextMenuItem
          className="ps-8 font-medium"
          disabled={!event.conference?.joinUrl}
          asChild
        >
          <a
            href={event.conference?.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join meeting
            <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
              J
            </KeyboardShortcut>
          </a>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Edit actions */}
        <ContextMenuItem className="ps-8 font-medium" disabled>
          Cut
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            X
          </KeyboardShortcut>
        </ContextMenuItem>

        <ContextMenuItem className="ps-8 font-medium" disabled>
          Copy
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            C
          </KeyboardShortcut>
        </ContextMenuItem>

        <ContextMenuItem className="ps-8 font-medium" disabled>
          Paste
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            P
          </KeyboardShortcut>
        </ContextMenuItem>

        <ContextMenuItem className="ps-8 font-medium" disabled>
          Duplicate
          <KeyboardShortcut className="ml-auto bg-transparent text-muted-foreground">
            D
          </KeyboardShortcut>
        </ContextMenuItem>

        <ContextMenuItem
          className="ps-8 font-medium text-red-400 hover:text-red-400 dark:hover:text-red-400"
          disabled={event.readOnly}
          onClick={handleDelete}
        >
          Delete
          <KeyboardShortcut className="ml-auto bg-transparent text-red-400">
            ⌫
          </KeyboardShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const MemoizedEventContextMenu = React.memo(
  EventContextMenu,
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.accountId === nextProps.event.accountId &&
      prevProps.event.calendarId === nextProps.event.calendarId
    );
  },
);
