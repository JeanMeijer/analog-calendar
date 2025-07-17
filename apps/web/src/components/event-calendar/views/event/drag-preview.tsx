import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type DragPreviewProps = React.ComponentProps<typeof motion.div>;

export function DragPreview({ className, ...props }: DragPreviewProps) {
  return (
    <motion.div
      className={cn(
        "absolute inset-[2px] z-[1000] rounded-sm bg-primary/10 transition-all duration-[10ms]",
        className,
      )}
      {...props}
    ></motion.div>
  );
}
