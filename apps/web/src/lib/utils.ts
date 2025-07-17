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

export function getConferencingProviderId(uri?: string) {
  try {
    if (!uri) {
      return "none";
    }

    const url = new URL(uri);
    const hostname = url.hostname.toLowerCase();

    if (
      hostname.includes("meet.google.com") ||
      hostname.includes("hangouts.google.com")
    ) {
      return "google";
    }

    if (hostname.includes("zoom.us") || hostname.includes("zoom.com")) {
      return "zoom";
    }

    return "none";
  } catch {
    // Fallback to string matching for non-URL strings
    const lowerUri = uri?.toLowerCase();
    if (lowerUri?.includes("google")) return "google";
    if (lowerUri?.includes("zoom")) return "zoom";
    return "none";
  }
}
