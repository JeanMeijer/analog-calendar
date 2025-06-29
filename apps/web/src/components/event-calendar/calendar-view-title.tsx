"use client";

import { AnimatePresence, Variant, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { CalendarView } from "./types";
import { getViewTitleData } from "./utils";

const variants: Record<string, Variant> = {
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

interface CalendarViewTitleProps {
  currentDate: Date;
  view: CalendarView;
  className?: string;
  prevDate?: Date;
}

/**
 * Component that renders the calendar view title with responsive breakpoints
 */

export function CalendarViewTitle(props: CalendarViewTitleProps) {
  const { currentDate, view, className } = props;
  const titleData = getViewTitleData(currentDate, view);

  if (view === "day") {
    return (
      <motion.h2
        className={className}
        key={titleData.full}
        variants={variants}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <span className="min-[480px]:hidden" aria-hidden="true">
          {titleData.short}
        </span>
        <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
          {titleData.medium}
        </span>
        <span className="max-md:hidden">{titleData.full}</span>
      </motion.h2>
    );
  }

  return (
    <div className="relative h-8 w-full">
      <AnimatePresence>
        <motion.h2
          key={titleData.full}
          className={cn(
            "absolute inset-0 flex items-center justify-start transition-all",
            className,
          )}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="md:hidden" aria-hidden="true">
            {titleData.short}
          </span>
          <span className="max-md:hidden">{titleData.full}</span>
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
