"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { ChevronDownIcon } from "lucide-react";

import { ViewPreferences, viewPreferencesAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Key } from "@/components/ui/keyboard-shortcut";
import { CalendarView } from "./types";

function CalendarViewPreferences() {
  const [preferences, setPreferences] = useAtom(viewPreferencesAtom);

  const handlePreferenceChange = (
    key: keyof ViewPreferences,
    value: boolean,
  ) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <>
      <DropdownMenuCheckboxItem
        checked={preferences.showWeekends}
        onCheckedChange={(checked) =>
          handlePreferenceChange("showWeekends", checked)
        }
      >
        Show weekends
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={preferences.showWeekNumbers}
        onCheckedChange={(checked) =>
          handlePreferenceChange("showWeekNumbers", checked)
        }
      >
        Show week numbers
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={preferences.showDeclinedEvents}
        onCheckedChange={(checked) =>
          handlePreferenceChange("showDeclinedEvents", checked)
        }
      >
        Show declined events
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={preferences.showPastEvents}
        onCheckedChange={(checked) =>
          handlePreferenceChange("showPastEvents", checked)
        }
      >
        Show past events
      </DropdownMenuCheckboxItem>
    </>
  );
}

const VIEW_OPTIONS = [
  { value: "month" as const, label: "Month", shortcut: "M" },
  { value: "week" as const, label: "Week", shortcut: "W" },
  { value: "day" as const, label: "Day", shortcut: "D" },
  { value: "agenda" as const, label: "Agenda", shortcut: "A" },
];

interface CalendarViewMenuProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

function CalendarViewOptions({
  currentView,
  onViewChange,
}: CalendarViewMenuProps) {
  const handleViewChange = React.useCallback(
    (view: CalendarView) => {
      onViewChange(view);
    },
    [onViewChange],
  );

  return (
    <DropdownMenuRadioGroup
      value={currentView}
      onValueChange={(value) => handleViewChange(value as CalendarView)}
    >
      {VIEW_OPTIONS.map(({ value, label, shortcut }) => (
        <DropdownMenuRadioItem key={value} value={value}>
          {label}
          <DropdownMenuShortcut className="min-w-6 justify-center text-center">
            <Key>{shortcut}</Key>
          </DropdownMenuShortcut>
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}

interface CalendarViewMenuProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarViewMenu({
  currentView,
  onViewChange,
}: CalendarViewMenuProps) {
  const viewDisplayName =
    currentView.charAt(0).toUpperCase() + currentView.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 gap-1.5">
          <span>
            <span className="@min-md/header:hidden" aria-hidden="true">
              {currentView.charAt(0).toUpperCase()}
            </span>
            <span className="@max-md/header:sr-only">{viewDisplayName}</span>
          </span>
          <ChevronDownIcon
            className="-me-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <CalendarViewOptions
          currentView={currentView}
          onViewChange={onViewChange}
        />
        <DropdownMenuSeparator />
        <CalendarViewPreferences />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
