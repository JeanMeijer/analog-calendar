import * as React from "react";
import { useMotionValue, type PanInfo } from "motion/react";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";
import { Temporal } from "temporal-polyfill";

import { createDraftEvent } from "@/lib/utils/calendar";
import { Action } from "./use-optimistic-events";
import { useSelectedEvents } from "@/atoms";

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
  const isDragging = React.useRef(false);
  const dragCancelled = React.useRef(false);
  const createdDraftId = React.useRef<string | null>(null);
  const [isPreviewPersistent, setIsPreviewPersistent] = React.useState(false);
  
  // Track selected events to know when draft becomes real event
  const { selectedEvent } = useSelectedEvents();

  // Hide preview when the selected event is no longer a draft (i.e., it was saved)
  React.useEffect(() => {
    if (createdDraftId.current && selectedEvent) {
      // If the selected event is not a draft and has the same ID, it means it was saved
      if (!('type' in selectedEvent) || selectedEvent.type !== 'draft') {
        if (selectedEvent.id === createdDraftId.current) {
          // Event was saved, hide the preview
          top.set(0);
          height.set(0);
          opacity.set(0);
          createdDraftId.current = null;
          setIsPreviewPersistent(false);
        }
      }
    }
  }, [selectedEvent, top, height, opacity]);

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

    if (!column) {
      return;
    }

    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();

      if (emptyImageRef.current?.complete) {
        event.dataTransfer?.setDragImage(emptyImageRef.current, 0, 0);
      }
    };

    column.addEventListener("dragstart", handleDragStart);
    return () => column.removeEventListener("dragstart", handleDragStart);
  }, [columnRef]);

  // Cancel dragging when Escape is pressed
  useHotkeys(
    "esc",
    () => {
      if (isDragging.current || createdDraftId.current) {
        dragCancelled.current = true;
        top.set(0);
        height.set(0);
        opacity.set(0);
        setIsPreviewPersistent(false);
        
        // If we have a created draft, unselect it
        if (createdDraftId.current) {
          dispatchAction({ type: "unselect" });
          createdDraftId.current = null;
        }
      }
    },
    { scopes: ["calendar"] },
  );

  const getMinutesFromPosition = (globalY: number) => {
    if (!columnRef.current) return 0;

    const columnRect = columnRef.current.getBoundingClientRect();
    const relativeY = globalY - columnRect.top;
    const columnHeight = columnRect.height;

    // Calculate minutes from the top (0 = 00:00, columnHeight = 24:00 = 1440 minutes)
    return Math.max(0, Math.min(1440, (relativeY / columnHeight) * 1440));
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
    if (!columnRef.current) {
      return;
    }

    if (isHotkeyPressed("esc")) {
      dragCancelled.current = true;
      return;
    }

    isDragging.current = true;
    dragCancelled.current = false;

    // Prevent the default drag behavior that causes the globe icon
    event.preventDefault();

    const columnRect = columnRef.current.getBoundingClientRect();
    const relativeY = info.point.y - columnRect.top;

    initialMinutes.current = getMinutesFromPosition(info.point.y);

    const snappedTop = getSnappedPosition(relativeY);

    top.set(snappedTop);
    opacity.set(1);
    setIsPreviewPersistent(false);
    // height.set(0);
  };

  const onDrag = (event: PointerEvent, info: PanInfo) => {
    if (!columnRef.current) {
      return;
    }

    if (!isDragging.current || dragCancelled.current) {
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
    isDragging.current = false;

    if (dragCancelled.current) {
      dragCancelled.current = false;
      top.set(0);
      height.set(0);
      opacity.set(0);
      setIsPreviewPersistent(false);
      return;
    }

    const currentMinutes = getMinutesFromPosition(info.point.y);

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

    const start = date.toZonedDateTime({ timeZone, plainTime: startTime });
    const end = date.toZonedDateTime({ timeZone, plainTime: endTime });

    const draft = createDraftEvent({
      start,
      end,
      allDay: false,
    });

    // Store the draft ID so we can track when it gets created
    createdDraftId.current = draft.id;

    // Keep the preview visible and mark it as persistent
    setIsPreviewPersistent(true);

    dispatchAction({
      type: "draft",
      event: draft,
    });
  };

  return { onDragStart, onDrag, onDragEnd, top, height, opacity, isPreviewPersistent };
}
