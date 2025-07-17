import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHotkeyProvider } from "@/providers/app-hotkey-provider";

import "react-day-picker/style.css";
import "@/styles/date-picker.css";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider defaultWidthRight="21.5rem">
      <AppHotkeyProvider>{children}</AppHotkeyProvider>
    </SidebarProvider>
  );
}
