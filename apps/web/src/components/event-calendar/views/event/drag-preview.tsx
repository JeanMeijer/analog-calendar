import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type DragPreviewProps = React.ComponentProps<typeof motion.div> & {
  isPersistent?: boolean;
};

export function DragPreview({ 
  className, 
  isPersistent = false,
  ...props 
}: DragPreviewProps) {
  return (
    <motion.div
      className={cn(
        "absolute inset-[2px] z-[1000] rounded-sm transition-all duration-[10ms] px-2 overflow-hidden border border-primary/10",
        isPersistent 
          ? "bg-primary/20 border border-primary/30" 
          : "bg-primary/10",
        className,
      )}
      {...props}
    >
      <span className="text-xs text-primary/50 select-none" >
      (New event)
      </span>
    </motion.div>
  );
}
