"use client";

import { Niconne } from "next/font/google";
import { AnimatePresence, Variant, motion } from "motion/react";

import type { ViewPreferences } from "@/atoms/view-preferences";
import { cn } from "@/lib/utils";
import { CalendarView } from "./types";
import { getViewTitleData, getWeekNumber } from "./utils";

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
  viewPreferences: ViewPreferences;
}

/**
 * Component that renders the calendar view title with responsive breakpoints
 */

export function CalendarViewTitle(props: CalendarViewTitleProps) {
  const { currentDate, view, className, viewPreferences } = props;
  const titleData = getViewTitleData(currentDate, view);
  const weekNumber = getWeekNumber(currentDate, view);

  return (
    <div className="relative h-8 w-full">
      <AnimatePresence>
        <motion.h2
          key={titleData.full}
          className={cn(
            "absolute inset-0 flex items-center justify-start gap-2 transition-all",
            className,
          )}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="line-clamp-1 @md/header:hidden" aria-hidden="true">
            {titleData.short}
          </span>
          <span className="line-clamp-1 @max-md/header:hidden">
            {titleData.full}
          </span>
          {viewPreferences.showWeekNumbers && weekNumber ? (
            <span className="line-clamp-1 text-sm text-muted-foreground">
              W{weekNumber}
            </span>
          ) : null}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
