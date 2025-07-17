const EventHeight = 24;

// Vertical gap between events in pixels - controls spacing in month view
const EventGap = 4;

// Height of hour cells in week and day views - controls the scale of time display
const WeekCellsHeight = 64;

// Number of days to show in the agenda view
const AgendaDaysToShow = 30;

// Start and end hours for the week and day views
const StartHour = 0;
const EndHour = 24;

// Default start and end times
const DefaultStartHour = 9;
const DefaultEndHour = 10;

const CALENDAR_CONFIG = {
  TIME_RANGE_DAYS_PAST: 30,
  TIME_RANGE_DAYS_FUTURE: 60,
  WEEK_STARTS_ON: 0, // Sunday
} as const;

const TIME_INTERVALS = {
  SNAP_TO_MINUTES: 15,
  SNAP_THRESHOLD: 7.5,
  DEFAULT_EVENT_DURATION_HOURS: 1,
} as const;

const TOAST_CONFIG = {
  POSITION: "bottom-left",
} as const;

export {
  EventHeight,
  EventGap,
  WeekCellsHeight,
  AgendaDaysToShow,
  StartHour,
  EndHour,
  DefaultStartHour,
  DefaultEndHour,
  CALENDAR_CONFIG,
  TIME_INTERVALS,
  TOAST_CONFIG,
};
