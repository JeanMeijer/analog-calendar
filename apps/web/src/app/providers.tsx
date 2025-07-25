"use client";

import type { ReactNode } from "react";

import { ReauthDialogProvider } from "@/components/reauth-dialog";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TRPCReactProvider } from "@/lib/trpc/client";

export function Providers(props: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <ReauthDialogProvider>{props.children}</ReauthDialogProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
