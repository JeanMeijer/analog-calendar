import * as React from "react";

import { cn } from "@/lib/utils";

type KeyProps = React.ComponentProps<"kbd">;

export function Key({ className, ...props }: KeyProps) {
  return (
    <kbd
      className={cn(
        "text-semibold inline-flex h-5 max-h-full items-center rounded px-0.5 font-[inherit] text-xs font-semibold text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type KeyboardInputProps = React.ComponentProps<"div">;

export function KeyboardShortcut({ className, ...props }: KeyboardInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded bg-primary/4 px-1",
        className,
      )}
      {...props}
    />
  );
}
