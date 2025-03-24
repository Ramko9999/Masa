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

export function getHumanReadableDate(timestamp: number) {
  const today = truncateToDay(Date.now());
  const truncatedTime = truncateToDay(timestamp);

  const time = new Date(timestamp).toLocaleTimeString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let date;
  if (today === truncatedTime) {
    date = "Today";
  } else if (today === removeDays(truncatedTime, 1)) {
    date = "Tommorrow";
  } else {
    date = new Date(truncatedTime).toLocaleDateString("default", {
      month: "long",
      day: "numeric",
    });
  }

  return `${date} ${time}`;
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
