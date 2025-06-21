"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useCalendarNavigation } from "./hooks";

export function CalendarNavigation() {
  const { handlePrevious, handleNext, handleToday } = useCalendarNavigation();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center sm:gap-1">
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="size-8"
            >
              <ChevronLeftIcon className="text-muted-foreground" />
              <span className="sr-only">Previous</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            Move previous
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="size-8"
            >
              <ChevronRightIcon className="text-muted-foreground" />
              <span className="sr-only">Next</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            Move next
          </TooltipContent>
        </Tooltip>
      </div>
      <Button
        variant="outline"
        className="aspect-square h-8"
        onClick={handleToday}
      >
        Today
      </Button>
    </div>
  );
}
