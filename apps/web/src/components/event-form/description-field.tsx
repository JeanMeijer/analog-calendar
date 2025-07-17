import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";

type DescriptionFieldProps = Omit<
  React.ComponentPropsWithoutRef<typeof Textarea>,
  "rows" | "placeholder"
>;

export function DescriptionField({
  className,
  ...props
}: DescriptionFieldProps) {
  const ref = useAutoResizeTextarea(120);

  return (
    <Textarea
      className={cn(
        "scrollbar-hidden field-sizing-content max-h-64 min-h-0 resize-none border-none bg-transparent py-1.5 ps-8 font-medium shadow-none dark:bg-transparent",
        className,
      )}
      ref={ref}
      placeholder="Description"
      rows={1}
      {...props}
    />
  );
}
