"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const switchRootVariants = cva(
  "peer data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-[1.15rem] w-8",
        sm: "h-3 w-4 border-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white pointer-events-none block rounded-full ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "size-4 data-[state=checked]:translate-x-[calc(100%-2px)]",
        sm: "size-2 data-[state=checked]:translate-x-[calc(100%-4px)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
) satisfies typeof switchRootVariants;

function Switch({
  className,
  size,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchRootVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchRootVariants({ size, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
