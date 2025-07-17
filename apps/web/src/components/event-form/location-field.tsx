import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LocationFieldProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "placeholder"
>;

export function LocationField({ className, ...props }: LocationFieldProps) {
  return (
    <Input
      className={cn(
        "scrollbar-hidden field-sizing-content max-h-24 min-h-0 resize-none border-none bg-transparent py-1.5 ps-8 shadow-none dark:bg-transparent",
        className,
      )}
      placeholder="Location"
      {...props}
    />
  );
}
