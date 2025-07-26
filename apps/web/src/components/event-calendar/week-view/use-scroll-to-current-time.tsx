import * as React from "react";
import { Temporal } from "temporal-polyfill";

import { EventHeight } from "../constants";

interface useScrollToCurrentTimeProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollToCurrentTime({
  scrollContainerRef,
}: useScrollToCurrentTimeProps) {
  const scrollToCurrentTime = React.useCallback(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    console.log("scrollToCurrentTime");

    const { hour, minute } = Temporal.Now.plainTimeISO();
    const top = hour * EventHeight + (minute * EventHeight) / 60;

    scrollContainerRef.current.scrollTo({
      //Trying a
      top,
    });
  }, [scrollContainerRef]);

  return scrollToCurrentTime;
}
