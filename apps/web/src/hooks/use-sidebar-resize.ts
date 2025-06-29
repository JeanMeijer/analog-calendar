import * as React from "react";

export interface UseSidebarResizeProps {
  direction?: "left" | "right";
  currentWidth: string;
  onResize: (width: string) => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  minResizeWidth?: string;
  maxResizeWidth?: string;
  enableAutoCollapse?: boolean;
  autoCollapseThreshold?: number;
  expandThreshold?: number;
  enableDrag?: boolean;
  setIsDraggingRail?: (isDragging: boolean) => void;
  widthCookieName?: string;
  widthCookieMaxAge?: number;
  isNested?: boolean;
  enableToggle?: boolean;
}

interface WidthUnit {
  value: number;
  unit: "rem" | "px";
}

function parseWidth(width: string): WidthUnit {
  const unit = width.endsWith("rem") ? "rem" : "px";
  const value = Number.parseFloat(width);
  return { value, unit };
}

export function mergeButtonRefs<T extends HTMLButtonElement>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

function toPx(width: string): number {
  const { value, unit } = parseWidth(width);
  return unit === "rem" ? value * 16 : value;
}

function formatWidth(value: number, unit: "rem" | "px"): string {
  return `${unit === "rem" ? value.toFixed(1) : Math.round(value)}${unit}`;
}

export function useSidebarResize({
  direction = "right",
  currentWidth,
  onResize,
  onToggle,
  isCollapsed = false,
  minResizeWidth = "14rem",
  maxResizeWidth = "24rem",
  enableToggle = true,
  enableAutoCollapse = true,
  autoCollapseThreshold = 1.5,
  expandThreshold = 0.2,
  enableDrag = true,
  setIsDraggingRail = () => {},
  widthCookieName,
  widthCookieMaxAge = 60 * 60 * 24 * 7, // 1 week default
  isNested = false,
}: UseSidebarResizeProps) {
  const dragRef = React.useRef<HTMLButtonElement>(null);
  const startWidth = React.useRef(0);
  const startX = React.useRef(0);
  const isDragging = React.useRef(false);
  const isInteractingWithRail = React.useRef(false);
  const lastWidth = React.useRef(0);
  const lastLoggedWidth = React.useRef(0);
  const dragStartPoint = React.useRef(0);
  const lastDragDirection = React.useRef<"expand" | "collapse" | null>(null);
  const lastTogglePoint = React.useRef(0);
  const lastToggleWidth = React.useRef(0);
  const toggleCooldown = React.useRef(false);
  const lastToggleTime = React.useRef(0);
  const dragDistanceFromToggle = React.useRef(0);
  const dragOffset = React.useRef(0);
  const railRect = React.useRef<DOMRect | null>(null);
  const autoCollapseThresholdPx = React.useRef(0);

  const minWidthPx = React.useMemo(
    () => toPx(minResizeWidth),
    [minResizeWidth],
  );
  const maxWidthPx = React.useMemo(
    () => toPx(maxResizeWidth),
    [maxResizeWidth],
  );

  const isIncreasingWidth = React.useCallback(
    (currentX: number, referenceX: number): boolean => {
      return direction === "left"
        ? currentX < referenceX
        : currentX > referenceX;
    },
    [direction],
  );

  const calculateWidth = React.useCallback(
    (
      e: MouseEvent,
      initialX: number,
      initialWidth: number,
      currentRailRect: DOMRect | null,
    ): number => {
      if (isNested && currentRailRect) {
        const deltaX = e.clientX - initialX;

        if (direction === "left") {
          return initialWidth - deltaX;
        }
        return initialWidth + deltaX;
      }
      if (direction === "left") {
        return window.innerWidth - e.clientX;
      }
      return e.clientX;
    },
    [direction, isNested],
  );

  React.useEffect(() => {
    autoCollapseThresholdPx.current = enableAutoCollapse
      ? minWidthPx * autoCollapseThreshold
      : 0;
  }, [minWidthPx, enableAutoCollapse, autoCollapseThreshold]);

  const persistWidth = React.useCallback(
    (width: string) => {
      if (widthCookieName) {
        document.cookie = `${widthCookieName}=${width}; path=/; max-age=${widthCookieMaxAge}`;
      }
    },
    [widthCookieName, widthCookieMaxAge],
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      isInteractingWithRail.current = true;

      if (!enableDrag) {
        return;
      }

      const currentWidthPx = isCollapsed ? 0 : toPx(currentWidth);
      startWidth.current = currentWidthPx;
      startX.current = e.clientX;
      dragStartPoint.current = e.clientX;
      lastWidth.current = currentWidthPx;
      lastLoggedWidth.current = currentWidthPx;
      lastTogglePoint.current = e.clientX;
      lastToggleWidth.current = currentWidthPx;
      lastDragDirection.current = null;
      toggleCooldown.current = false;
      lastToggleTime.current = 0;
      dragDistanceFromToggle.current = 0;

      dragOffset.current = 0;

      if (isNested && dragRef.current) {
        railRect.current = dragRef.current.getBoundingClientRect();
      } else {
        railRect.current = null;
      }

      e.preventDefault();
    },
    [enableDrag, isCollapsed, currentWidth, isNested],
  );

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractingWithRail.current) return;

      const deltaX = Math.abs(e.clientX - startX.current);
      if (!isDragging.current && deltaX > 5) {
        isDragging.current = true;
        setIsDraggingRail(true);
      }

      if (isDragging.current) {
        const { unit } = parseWidth(currentWidth);

        let currentRailRect = railRect.current;
        if (isNested && dragRef.current) {
          currentRailRect = dragRef.current.getBoundingClientRect();
        }

        const currentDragDirection = isIncreasingWidth(
          e.clientX,
          lastTogglePoint.current,
        )
          ? "expand"
          : "collapse";

        if (lastDragDirection.current !== currentDragDirection) {
          lastDragDirection.current = currentDragDirection;
        }

        dragDistanceFromToggle.current = Math.abs(
          e.clientX - lastTogglePoint.current,
        );

        const now = Date.now();
        if (toggleCooldown.current && now - lastToggleTime.current > 200) {
          toggleCooldown.current = false;
        }

        if (!toggleCooldown.current) {
          if (enableAutoCollapse && onToggle && !isCollapsed) {
            const currentDragWidth = calculateWidth(
              e,
              startX.current,
              startWidth.current,
              currentRailRect,
            );

            let shouldCollapse = false;

            if (autoCollapseThreshold <= 1.0) {
              shouldCollapse =
                currentDragWidth <= minWidthPx * autoCollapseThreshold;
            } else {
              if (currentDragWidth <= minWidthPx) {
                const extraDragNeeded =
                  minWidthPx * (autoCollapseThreshold - 1.0);

                const distanceBeyondMin = minWidthPx - currentDragWidth;

                shouldCollapse = distanceBeyondMin >= extraDragNeeded;
              }
            }

            if (currentDragDirection === "collapse" && shouldCollapse) {
              onToggle();
              lastTogglePoint.current = e.clientX;
              lastToggleWidth.current = 0;
              toggleCooldown.current = true;
              lastToggleTime.current = now;
              return;
            }
          }

          if (
            onToggle &&
            isCollapsed &&
            currentDragDirection === "expand" &&
            dragDistanceFromToggle.current > minWidthPx * expandThreshold
          ) {
            onToggle();

            const initialWidth = calculateWidth(
              e,
              startX.current,
              startWidth.current,
              currentRailRect,
            );

            const clampedWidth = Math.max(
              minWidthPx,
              Math.min(maxWidthPx, initialWidth),
            );

            const formattedWidth = formatWidth(
              unit === "rem" ? clampedWidth / 16 : clampedWidth,
              unit,
            );
            onResize(formattedWidth);
            persistWidth(formattedWidth);

            lastTogglePoint.current = e.clientX;
            lastToggleWidth.current = clampedWidth;
            toggleCooldown.current = true;
            lastToggleTime.current = now;
            return;
          }
        }

        if (isCollapsed) {
          return;
        }

        const newWidthPx = calculateWidth(
          e,
          startX.current,
          startWidth.current,
          currentRailRect,
        );

        const clampedWidthPx = Math.max(
          minWidthPx,
          Math.min(maxWidthPx, newWidthPx),
        );

        const newWidth = unit === "rem" ? clampedWidthPx / 16 : clampedWidthPx;

        const formattedWidth = formatWidth(newWidth, unit);
        onResize(formattedWidth);
        persistWidth(formattedWidth);

        lastWidth.current = clampedWidthPx;
      }
    };

    const handleMouseUp = () => {
      if (!isInteractingWithRail.current) return;

      if (!isDragging.current && onToggle && enableToggle) {
        onToggle();
      }

      isDragging.current = false;
      isInteractingWithRail.current = false;
      lastWidth.current = 0;
      lastLoggedWidth.current = 0;
      lastDragDirection.current = null;
      lastTogglePoint.current = 0;
      lastToggleWidth.current = 0;
      toggleCooldown.current = false;
      lastToggleTime.current = 0;
      dragDistanceFromToggle.current = 0;
      dragOffset.current = 0;
      railRect.current = null;
      setIsDraggingRail(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    onResize,
    onToggle,
    isCollapsed,
    currentWidth,
    persistWidth,
    setIsDraggingRail,
    minWidthPx,
    maxWidthPx,
    isIncreasingWidth,
    calculateWidth,
    isNested,
    enableAutoCollapse,
    autoCollapseThreshold,
    expandThreshold,
    enableToggle,
  ]);

  return {
    dragRef,
    isDragging,
    handleMouseDown,
  };
}
