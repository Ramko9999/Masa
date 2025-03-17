export const enum VaaraIndex {
  Ravivaara = 0,
  Somavaara = 1,
  Mangalavaara = 2,
  Budhavaara = 3,
  Guruvaara = 4,
  Shukravaara = 5,
  Shanivaara = 6,
}

const VAARA_NAMES = [
  "Ravivaara", // Sunday
  "Somavaara", // Monday
  "Mangalavaara", // Tuesday
  "Budhavaara", // Wednesday
  "Guruvaara", // Thursday
  "Shukravaara", // Friday
  "Shanivaara", // Saturday
];

export type Vaara = {
  index: VaaraIndex;
  name: string;
};

export function compute(day: number): Vaara {
  const dayIndex = (new Date(day).getDay() + 1) % 7;
  return {
    index: dayIndex,
    name: VAARA_NAMES[dayIndex],
  };
}
