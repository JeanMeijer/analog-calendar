// Focused logic hooks
export { useCalendarNavigation } from "./use-calendar-navigation";
export { useEventDialog } from "./use-event-dialog";
export { useEventOperations } from "./use-event-operations";
export { useCalendarActions } from "./use-calendar-actions";

// View-specific hooks
export {
  useEventCollection,
  type EventCollectionForMonth,
  type EventCollectionForWeek,
} from "./use-event-collection";
export { useGridLayout } from "./use-grid-layout";

// Utility hooks
export { useCurrentTimeIndicator } from "./use-current-time-indicator";
export { useEventVisibility } from "./use-event-visibility";
