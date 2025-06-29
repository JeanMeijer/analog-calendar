import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHotkeyProvider } from "@/providers/app-hotkey-provider";
import "react-day-picker/style.css";
import "@/styles/date-picker.css";
import { AppSidebar } from "@/components/app-sidebar";
import { RightSidebar } from "@/components/right-sidebar";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider defaultWidthRight="21.5rem" defaultOpenRight={false}>
      <AppHotkeyProvider>
        <AppSidebar variant="inset" side="left" />
        <SidebarInset className="h-full overflow-hidden">
          {children}
        </SidebarInset>
        <RightSidebar variant="inset" side="right" />
      </AppHotkeyProvider>
    </SidebarProvider>
  );
}
