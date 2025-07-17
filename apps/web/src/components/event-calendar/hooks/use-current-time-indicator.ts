"use client";

import { useEffect, useState } from "react";
import { format } from "@formkit/tempo";
import { endOfWeek, isSameDay, isWithinInterval, startOfWeek } from "date-fns";

import { useCalendarSettings } from "@/atoms/calendar-settings";
import { EndHour, StartHour } from "@/components/event-calendar/constants";

export function useCurrentTimeIndicator(
  currentDate: Date,
  view: "day" | "week",
) {
  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0);
  const [currentTimeVisible, setCurrentTimeVisible] = useState<boolean>(false);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const { use12Hour } = useCalendarSettings();

  useEffect(() => {
    const calculateTimePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = (hours - StartHour) * 60 + minutes;
      const dayStartMinutes = 0;
      const dayEndMinutes = (EndHour - StartHour) * 60;

      const position =
        ((totalMinutes - dayStartMinutes) / (dayEndMinutes - dayStartMinutes)) *
        100;

      let isCurrentTimeVisible = false;

      if (view === "day") {
        isCurrentTimeVisible = isSameDay(now, currentDate);
      } else if (view === "week") {
        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 });
        isCurrentTimeVisible = isWithinInterval(now, {
          start: startOfWeekDate,
          end: endOfWeekDate,
        });
      }

      const formattedTime = use12Hour
        ? format(now, "h:mm a")
        : format(now, "HH:mm");
      setFormattedTime(formattedTime);
      setCurrentTimePosition(position);
      setCurrentTimeVisible(isCurrentTimeVisible);
    };

    calculateTimePosition();

    const interval = setInterval(calculateTimePosition, 60000);

    return () => clearInterval(interval);
  }, [currentDate, view, use12Hour]);

  return { currentTimePosition, currentTimeVisible, formattedTime };
}
