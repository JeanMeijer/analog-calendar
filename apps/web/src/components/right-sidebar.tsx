"use client";

import * as React from "react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

interface RightSidebarProps extends React.ComponentProps<typeof Sidebar> {
  minSidebarWidth?: string;
}

export function RightSidebar({
  children,
  minSidebarWidth,
  ...props
}: RightSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarRail minSidebarWidth={minSidebarWidth} />
      <SidebarContent className="pr-0.5">{children}</SidebarContent>
    </Sidebar>
  );
}
