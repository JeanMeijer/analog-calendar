import * as React from "react";

import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import { Tasks } from "@/components/tasks/tasks";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent className="relative flex flex-col">
        <SidebarGroup className="sticky top-0 z-10 bg-sidebar px-0">
          <SidebarGroupContent>
            <DatePicker />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="flex min-h-0 flex-1 flex-col">
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent className="min-h-0 flex-1">
            <ScrollArea className="h-full w-full">
              <Tasks />
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
