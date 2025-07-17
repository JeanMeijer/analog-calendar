"use client";

import * as React from "react";
import * as Ariakit from "@ariakit/react";

import { cn } from "@/lib/utils";

function Combobox(
  props: React.ComponentProps<typeof Ariakit.ComboboxProvider>,
) {
  return <Ariakit.ComboboxProvider {...props} />;
}

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof Ariakit.Combobox>) {
  return (
    <Ariakit.Combobox
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxPopover({
  className,
  gutter = 4,
  shift = 0,
  slide = false,
  sameWidth = true,
  ...props
}: React.ComponentProps<typeof Ariakit.ComboboxPopover> & {
  gutter?: number;
}) {
  return (
    <Ariakit.ComboboxPopover
      gutter={gutter}
      shift={shift}
      slide={slide}
      sameWidth={sameWidth}
      className={cn(
        "z-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      {props.children}
    </Ariakit.ComboboxPopover>
  );
}

function ComboboxItem({
  className,
  ...props
}: React.ComponentProps<typeof Ariakit.ComboboxItem>) {
  return (
    <Ariakit.ComboboxItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium outline-hidden select-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof Ariakit.ComboboxLabel>) {
  return <Ariakit.ComboboxLabel className={cn("", className)} {...props} />;
}

export {
  ComboboxPopover,
  ComboboxItem,
  ComboboxInput,
  ComboboxLabel,
  Combobox,
};
