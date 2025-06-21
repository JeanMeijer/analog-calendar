import { useCallback } from "react";

import { useCalendarState } from "@/hooks/use-calendar-state";
import { navigateToNext, navigateToPrevious } from "../utils";

export function useCalendarNavigation() {
  const { currentDate, view, setCurrentDate } = useCalendarState();

  const handlePrevious = useCallback(() => {
    setCurrentDate(navigateToPrevious(currentDate, view));
  }, [currentDate, view, setCurrentDate]);

  const handleNext = useCallback(() => {
    setCurrentDate(navigateToNext(currentDate, view));
  }, [currentDate, view, setCurrentDate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  return {
    handlePrevious,
    handleNext,
    handleToday,
  };
}
