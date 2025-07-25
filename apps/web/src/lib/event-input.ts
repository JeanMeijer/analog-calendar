export type DateSuggestion = {
  type: "date";
  label: string;
  value: string;
};

// Helper function to parse potential dates from query
export const parseDateFromQuery = (query: string): Date[] => {
  const dates: Date[] = [];
  const now = new Date();

  const patterns = [
    // Today, tomorrow, yesterday
    /^(today|tomorrow|yesterday)$/i,
    // Day names (monday, tuesday, etc.)
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)$/i,
    // Relative dates (next monday, this friday, etc.)
    /^(next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)$/i,
    // Month day (jan 15, january 15, 1/15, 01/15, etc.)
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}$/i,
    /^\d{1,2}\/\d{1,2}$/,
    /^\d{1,2}-\d{1,2}$/,
  ];

  const lowerQuery = query.toLowerCase().trim();

  // Handle today, tomorrow, yesterday
  if (/^today$/i.test(lowerQuery)) {
    dates.push(new Date(now));
  } else if (/^tomorrow$/i.test(lowerQuery)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    dates.push(tomorrow);
  } else if (/^yesterday$/i.test(lowerQuery)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    dates.push(yesterday);
  }

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const shortDayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  // Handle day names with modifiers (next/this)
  const dayMatchWithModifier = lowerQuery.match(/^(next|this)\s+(.+)$/i);
  if (
    dayMatchWithModifier &&
    dayMatchWithModifier[1] &&
    dayMatchWithModifier[2]
  ) {
    const modifier = dayMatchWithModifier[1].toLowerCase();
    const dayQuery = dayMatchWithModifier[2].toLowerCase();

    // Find matching day names (partial matching)
    const matchingDaysSet = new Set([
      ...dayNames.filter((day) => day.startsWith(dayQuery)),
    ]);

    matchingDaysSet.forEach((dayName) => {
      const targetDayIndex = dayNames.indexOf(dayName);

      if (targetDayIndex !== -1) {
        const currentDay = now.getDay();
        let daysToAdd = targetDayIndex - currentDay;

        if (modifier === "next") {
          if (daysToAdd <= 0) daysToAdd += 7;
        } else if (modifier === "this") {
          if (daysToAdd < 0) daysToAdd += 7;
        }

        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysToAdd);
        dates.push(targetDate);
      }
    });
  } else {
    // Handle day names without modifiers (partial matching)
    const matchingDaysSet = new Set([
      ...dayNames.filter((day) => day.startsWith(lowerQuery)),
    ]);

    matchingDaysSet.forEach((dayName) => {
      const targetDayIndex = dayNames.indexOf(dayName);

      if (targetDayIndex !== -1) {
        const currentDay = now.getDay();
        let daysToAdd = targetDayIndex - currentDay;

        // No modifier - next occurrence
        if (daysToAdd <= 0) daysToAdd += 7;

        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysToAdd);
        dates.push(targetDate);
      }
    });
  }

  // handle numeric dates (basic parsing for now)
  const numericMatch = lowerQuery.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (numericMatch && numericMatch[1] && numericMatch[2]) {
    const month = parseInt(numericMatch[1]) - 1;
    const day = parseInt(numericMatch[2]);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const targetDate = new Date(now.getFullYear(), month, day);
      if (targetDate < now) {
        targetDate.setFullYear(now.getFullYear() + 1);
      }
      dates.push(targetDate);
    }
  }

  return dates;
};

export const formatDateLabel = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (date.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString("en-US", options);
};

export const generateDateSuggestions = (query: string): DateSuggestion[] => {
  const detectedDates = parseDateFromQuery(query);
  return detectedDates.map((date) => ({
    type: "date" as const,
    label: formatDateLabel(date),
    value: date.toISOString().split("T")[0]!, // YYYY-MM-DD format
  }));
};
