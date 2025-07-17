import * as React from "react";
import { useAtomValue } from "jotai";
import { useMotionValue, type PanInfo } from "motion/react";
import { Temporal } from "temporal-polyfill";

import { selectedEventsAtom } from "@/atoms/selected-events";
import { createDraftEvent } from "@/lib/utils/calendar";
import { Action } from "./use-optimistic-events";

interface UseDragToCreateOptions {
  dispatchAction: (action: Action) => void;
  date: Temporal.PlainDate;
  timeZone: string;
  columnRef: React.RefObject<HTMLDivElement | null>;
}

function timeFromMinutes(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = Math.floor(minutes % 60);

  return Temporal.PlainTime.from({
    hour: Math.min(23, Math.max(0, hour)),
    minute: Math.min(59, Math.max(0, minute)),
  });
}

export function useDragToCreate({
  dispatchAction,
  date,
  timeZone,
  columnRef,
}: UseDragToCreateOptions) {
  const initialMinutes = React.useRef(0);
  const top = useMotionValue<number | undefined>(undefined);
  const height = useMotionValue(0);
  const opacity = useMotionValue(0);
  const emptyImageRef = React.useRef<HTMLImageElement | null>(null);
  const selectedEvent = useAtomValue(selectedEventsAtom);

  // Create empty image on client side only to prevent globe icon on Mac Chrome
  React.useEffect(() => {
    if (typeof window === "undefined" || emptyImageRef.current) {
      return;
    }

    const emptyImage = new Image(1, 1);
    emptyImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    emptyImageRef.current = emptyImage;
  }, []);

  // Prevent HTML5 drag and drop which causes the globe icon on Mac Chrome
  React.useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();

      if (emptyImageRef.current?.complete) {
        event.dataTransfer?.setDragImage(emptyImageRef.current, 0, 0);
      }
    };

    column.addEventListener("dragstart", handleDragStart);
    return () => column.removeEventListener("dragstart", handleDragStart);
  }, [columnRef]);

  const getMinutesFromPosition = (globalY: number) => {
    if (!columnRef.current) return 0;

    const columnRect = columnRef.current.getBoundingClientRect();
    const relativeY = globalY - columnRect.top;
    const columnHeight = columnRect.height;

    // Calculate minutes from the top (0 = 00:00, columnHeight = 24:00 = 1440 minutes)
    const minutes = Math.max(
      0,
      Math.min(1440, (relativeY / columnHeight) * 1440),
    );

    return minutes;
  };

  const getSnappedPosition = (relativeY: number) => {
    if (!columnRef.current) return 0;

    const columnRect = columnRef.current.getBoundingClientRect();
    const columnHeight = columnRect.height;

    // Calculate which 15-minute interval this position corresponds to
    const minutes = Math.max(
      0,
      Math.min(1440, (relativeY / columnHeight) * 1440),
    );
    const snappedMinutes = Math.floor(minutes / 15) * 15;

    // Convert back to position
    return (snappedMinutes / 1440) * columnHeight;
  };

  const onDragStart = (event: PointerEvent, info: PanInfo) => {
    if (!columnRef.current) return;

    // Prevent the default drag behavior that causes the globe icon
    event.preventDefault();

    const columnRect = columnRef.current.getBoundingClientRect();
    const relativeY = info.point.y - columnRect.top;

    initialMinutes.current = getMinutesFromPosition(info.point.y);

    const snappedTop = getSnappedPosition(relativeY);
    // console.log(snappedTop, 0);
    top.set(snappedTop);
    opacity.set(1);
    // height.set(0);
  };

  const onDrag = (event: PointerEvent, info: PanInfo) => {
    if (!columnRef.current) {
      return;
    }

    // Ensure onDragStart has been called first to prevent flickering
    if (top.get() === undefined) {
      return;
    }

    const columnRect = columnRef.current.getBoundingClientRect();
    const currentRelativeY = info.point.y - columnRect.top;
    const initialRelativeY =
      (initialMinutes.current / 1440) * columnRect.height;

    const snappedCurrentY = getSnappedPosition(currentRelativeY);
    const snappedInitialY = getSnappedPosition(initialRelativeY);

    // If the pointer is above the initial position
    if (snappedCurrentY < snappedInitialY) {
      top.set(currentRelativeY);
      height.set(snappedInitialY - currentRelativeY);

      return;
    }

    top.set(snappedInitialY);
    height.set(currentRelativeY - snappedInitialY);
  };

  const onDragEnd = (event: PointerEvent, info: PanInfo) => {
    const currentMinutes = getMinutesFromPosition(info.point.y);

    console.log(currentMinutes, initialMinutes.current);
    const startMinutes = Math.min(initialMinutes.current, currentMinutes);
    const endMinutes = Math.max(initialMinutes.current, currentMinutes);

    const startTime = timeFromMinutes(startMinutes).round({
      smallestUnit: "minute",
      roundingIncrement: 15,
      roundingMode: "floor",
    });
    const endTime = timeFromMinutes(endMinutes).round({
      smallestUnit: "minute",
      roundingIncrement: 15,
      roundingMode: "halfExpand",
    });

    console.log(
      startTime.toLocaleString("en-US"),
      endTime.toLocaleString("en-US"),
    );

    const start = date.toZonedDateTime({ timeZone, plainTime: startTime });
    const end = date.toZonedDateTime({ timeZone, plainTime: endTime });

    const draft = createDraftEvent({
      start,
      end,
      allDay: false,
    });

    top.set(0);
    height.set(0);
    opacity.set(0);

    dispatchAction({
      type: "draft",
      event: draft,
    });
  };

  return { onDragStart, onDrag, onDragEnd, top, height, opacity };
}
