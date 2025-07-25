"use client";

import { useEffect } from "react";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { loadCustomThemeFromLocalStorage } from "@/lib/localCustomTheme";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    loadCustomThemeFromLocalStorage();
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
