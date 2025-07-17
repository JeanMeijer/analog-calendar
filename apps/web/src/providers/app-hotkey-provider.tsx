"use client";

import type { ReactNode } from "react";
import { HotkeysProvider } from "react-hotkeys-hook";

import { CalendarHotkeys } from "@/lib/hotkeys/calendar-hotkeys";

interface AppHotkeyProviderProps {
  children: ReactNode;
}

export function AppHotkeyProvider({ children }: AppHotkeyProviderProps) {
  return (
    <HotkeysProvider initiallyActiveScopes={["event", "calendar"]}>
      <CalendarHotkeys />
      {children}
    </HotkeysProvider>
  );
}
