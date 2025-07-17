/**
 * UI Utilities
 *
 * This file contains utility functions for:
 * - UI state and appearance calculations
 * - Component styling helpers
 */

export function getContentPaddingClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  if (isFirstDay && isLastDay) {
    return "mx-0.5 w-[calc(100%-0.25rem)]";
  } else if (isFirstDay) {
    return "ml-0.5 w-[calc(100%-0.125rem)]";
  } else if (isLastDay) {
    return "mr-0.5 w-[calc(100%-0.125rem)]";
  } else {
    return "";
  }
}

export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean,
): string {
  if (isFirstDay && isLastDay) {
    return "rounded-sm"; // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l-sm rounded-r-none border-r-0"; // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r-sm rounded-l-none border-l-0"; // Only right end rounded
  } else {
    return "rounded-none"; // No rounded corners
  }
}

export function shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
  return (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    (event.target instanceof HTMLElement && event.target.isContentEditable)
  );
}
