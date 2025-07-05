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

export function getBrowserDateFormat(): "DMY" | "MDY" | "YMD" {
  const parts = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(new Date(2020, 0, 1));
  const order = parts
    .filter((p) => p.type === "day" || p.type === "month" || p.type === "year")
    .map((p) => p.type)
    .join("");
  switch (order) {
    case "daymonthyear":
      return "DMY";
    case "monthdayyear":
      return "MDY";
    case "yeardaymonth":
    case "yearmonthday":
      return "YMD";
    default:
      return "MDY";
  }
}

export function getWeekStartsOn(): number {
  try {
    // @ts-ignore
    const info = new Intl.Locale(navigator.language).weekInfo;
    if (info && typeof info.firstDay === "number") {
      return info.firstDay;
    }
  } catch (e) {
    // ignore
  }
  return 1;
}

export function uses24HourClock(): boolean {
  const hourCycle = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).resolvedOptions().hourCycle;
  return hourCycle === "h23" || hourCycle === "h24";
}
