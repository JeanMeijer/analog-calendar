import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(start: number, end: number, step = 1) {
  const output: number[] = [];

  for (let i = start; i <= end; i += step) {
    output.push(i);
  }

  return output;
}

export function groupArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getBrowserLocale() {
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages;
  }
  return [navigator.language];
}

export function getPrimaryBrowserLocale() {
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages[0];
  }
  return navigator.language;
}
