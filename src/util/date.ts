export function addDays(timestamp: number, days: number) {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.valueOf();
}

export function addHours(timestamp: number, hours: number) {
  const date = new Date(timestamp);
  date.setHours(date.getHours() + hours);
  return date.valueOf();
}

export function generateHourlyOffsets(
  timestamp: number,
  offset: number,
  total: number,
  excludeFirst: boolean = false
): number[] {
  let offsets = [];
  for (let i = 0; i < total; i++) {
    const currentOffset = (i + (excludeFirst ? 1 : 0)) * offset;
    offsets.push(addHours(timestamp, currentOffset));
  }
  return offsets;
}

export function generateEnclosingWeek(timestamp: number) {
  const date = new Date(timestamp);
  let week = [];
  for (let i = 0; i < 7; i++) {
    week.push(addDays(timestamp, i - date.getDay()));
  }
  return week;
}

export function truncateToDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
}

export function removeDays(timestamp: number, days: number) {
  return addDays(timestamp, -1 * days);
}

export function getDatesBetween(startTimestamp: number, endTimestamp: number) {
  const dates = [];
  const startTruncated = truncateToDay(startTimestamp);
  const endTruncated = truncateToDay(endTimestamp);
  for (let i = startTruncated; i <= endTruncated; i = addDays(i, 1)) {
    dates.push(i);
  }
  return dates;
}

export function getHumanReadableDate(
  language: string,
  timestamp: number,
  t: (key: string) => string
) {
  const today = truncateToDay(Date.now());
  const truncatedTime = truncateToDay(timestamp);

  const time = new Date(timestamp).toLocaleTimeString(language, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let date;
  if (today === truncatedTime) {
    return time;
  } else if (today === removeDays(truncatedTime, 1)) {
    const tomorrow = t("home.cards.tomorrow");
    return `${tomorrow} ${time}`;
  } else {
    date = new Date(truncatedTime).toLocaleDateString(language, {
      month: "long",
      day: "numeric",
    });
    return `${date}, ${time}`;
  }
}

export function getHumanReadableDateWithWeekday(
  language: string,
  timestamp: number
) {
  const date = new Date(timestamp);
  const weekday = date
    .toLocaleDateString(language, { weekday: "long" })
    .toUpperCase();
  const month = date
    .toLocaleDateString(language, { month: "short" })
    .toUpperCase();
  const day = date.getDate();
  return `${weekday} — ${month} ${day}`;
}

export function dayOfWeekShort(language: string, timestamp: number) {
  return new Date(timestamp)
    .toLocaleDateString(language, { weekday: "short" })
    .toUpperCase();
}

export function dayOfWeekFull(language: string, timestamp: number) {
  return new Date(timestamp).toLocaleDateString(language, { weekday: "long" });
}

export function monthFull(language: string, timestamp: number) {
  return new Date(timestamp).toLocaleDateString(language, { month: "long" });
}

export function daysOfWeekShort(language: string): string[] {
  const formatter = new Intl.DateTimeFormat(language, { weekday: "short" });

  // Jan 7, 2024 is a known Sunday
  const start = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return formatter.format(date).toUpperCase();
  });
}

export function getHumanReadableTime(timestamp: number | null) {
  if (timestamp === null) {
    return "N/A";
  }

  return new Date(timestamp).toLocaleTimeString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of the week for the first day of a month (0-6, 0 = Sunday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Format a date as "Month Year"
 */
export function formatMonthYear(language: string, date: Date): string {
  return date.toLocaleDateString(language, { month: "long", year: "numeric" });
}

export function formatDate(language: string, date: Date): string {
  return date.toLocaleDateString(language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
/**
 * Generate an array representing days in a month with proper padding for calendar display
 */
export function generateCalendarDays(
  year: number,
  month: number
): (number | null)[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const firstDay = new Date(year, month, 1).valueOf();

  const days: (number | null)[] = [];

  // Add empty cells for days before the start of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 0; i < daysInMonth; i++) {
    days.push(addDays(firstDay, i));
  }

  // Add empty cells to complete grid if needed
  const totalCells = Math.ceil(days.length / 7) * 7;
  for (let i = days.length; i < totalCells; i++) {
    days.push(null);
  }

  return days;
}

/**
 * Group an array of days into weeks for calendar display
 */
export function groupIntoWeeks(
  daysArray: (number | null)[]
): (number | null)[][] {
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }
  return weeks;
}

export const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
