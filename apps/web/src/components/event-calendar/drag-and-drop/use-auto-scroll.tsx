import * as React from "react";

interface UseEdgeAutoScrollOptions {
  headerRef?: React.RefObject<HTMLElement | null>;

  active: boolean;
  /**
   * Top edge trigger zone is between topStart < y < topEnd (relative to the container).
   * Defaults: topStart = 0, topEnd = 48.
   */
  topStart?: number;
  topEnd?: number;
  topThreshold?: number;
  /**
   * Bottom edge trigger zone is when y is within bottomThreshold px from the bottom edge.
   * Default: 48.
   */
  bottomThreshold?: number;
  maxSpeed?: number;
}

export function useEdgeAutoScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseEdgeAutoScrollOptions,
) {
  const {
    active,
    topThreshold = 96,
    bottomThreshold = 48,
    maxSpeed = 2,
    headerRef,
  } = options;
  // Animation frame id
  const frame = React.useRef<number | null>(null);
  // Latest pointer Y position
  const pointerY = React.useRef(0);
  // Dynamic top trigger zone (depends on sticky header height)
  const topStart = React.useRef(0);
  const topEnd = React.useRef(0);

  // Direction the scroll should move once started: -1 (up), 1 (down), 0 (none)
  const dirRef = React.useRef(0);
  // Handle to the 1-second delay timer
  const delayTimeout = React.useRef<number | null>(null);
  // Whether the auto-scroll loop is currently running
  const isScrolling = React.useRef(false);

  React.useEffect(() => {
    const el = containerRef.current;

    if (!el || !active) {
      return;
    }

    const header = headerRef?.current;

    topStart.current = header?.clientHeight ?? 0;
    topEnd.current = topStart.current + topThreshold;

    const clearDelay = () => {
      if (delayTimeout.current !== null) {
        clearTimeout(delayTimeout.current);
        delayTimeout.current = null;
      }
    };

    const startLoop = () => {
      if (frame.current === null) {
        frame.current = requestAnimationFrame(step);
      }
    };

    const stopLoop = () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
      isScrolling.current = false;
      dirRef.current = 0;
      clearDelay();
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerY.current = e.clientY;
      const rect = el.getBoundingClientRect();

      // Abort if pointer is outside container horizontally
      if (e.clientX < rect.left || e.clientX > rect.right) {
        stopLoop();
        return;
      }

      const y = e.clientY - rect.top;

      // Determine desired direction based on the configured zones
      let desiredDir = 0;
      if (y > topStart.current && y < topEnd.current) {
        desiredDir = -1; // scroll up
      } else if (y > rect.height - bottomThreshold) {
        desiredDir = 1; // scroll down
      }

      // If direction changed, reset timers/scrolling state
      if (desiredDir !== dirRef.current) {
        clearDelay();

        // If we were already scrolling, stop it when leaving the zone
        if (isScrolling.current) {
          stopLoop();
        }

        dirRef.current = desiredDir;

        // Start the 1-second delay only if entering a trigger zone
        if (desiredDir !== 0) {
          delayTimeout.current = window.setTimeout(() => {
            isScrolling.current = true;
            startLoop();
          }, 1000);
        }
      }
    };

    const step = () => {
      if (dirRef.current !== 0) {
        const rect = el.getBoundingClientRect();

        // Distance inside the trigger zone (0 .. zoneSize)
        const distance =
          dirRef.current === -1
            ? topEnd.current - (pointerY.current - rect.top)
            : pointerY.current - (rect.bottom - bottomThreshold);

        const zoneSize =
          dirRef.current === -1
            ? topEnd.current - topStart.current
            : bottomThreshold;
        const ratio = Math.min(distance / zoneSize, 1);
        const delta = dirRef.current * ratio * maxSpeed;
        el.scrollBy({ top: delta });
        frame.current = requestAnimationFrame(step);
      } else {
        frame.current = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", stopLoop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", stopLoop);
      stopLoop();
    };
  }, [
    active,
    bottomThreshold,
    maxSpeed,
    containerRef,
    headerRef,
    topThreshold,
  ]);
}
