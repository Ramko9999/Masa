import {
  getSolarLongitude,
  adjustForAyanamsa,
  toArcSeconds,
  getNewMoonOccurrence,
  getFullMoonOccurrence,
} from "@/api/panchanga/util";

const LAGNA_INTERVAL_ARC_SECONDS = toArcSeconds(30);

export const enum MasaIndex {
  Chaitra = 0,
  Vaisakha = 1,
  Jyeshtha = 2,
  Ashadha = 3,
  Shravana = 4,
  Bhadrapada = 5,
  Ashwin = 6,
  Kartika = 7,
  Margashirsha = 8,
  Pausha = 9,
  Magha = 10,
  Phalguna = 11,
}

const MASA_NAMES = [
  "Chaitra",
  "Vaisakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwin",
  "Kartika",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
];

type CalendarUnawareMasa = {
  index: MasaIndex;
  name: string;
  isLeap: boolean;
};

export type Masa = {
  amanta: CalendarUnawareMasa;
  purnimanta: CalendarUnawareMasa;
};

function getLagnaIndex(day: number): number {
  return (
    Math.floor(
      adjustForAyanamsa(day, getSolarLongitude(day)) /
        LAGNA_INTERVAL_ARC_SECONDS
    ) % 12
  );
}

function getMasaName(index: number, isLeap: boolean) {
  const name = MASA_NAMES[index];
  return isLeap ? `Adhika ${name}` : name;
}

function computeAmantaMasa(sunrise: number): CalendarUnawareMasa {
  const lastNewMoon = getNewMoonOccurrence(sunrise, true);
  const nextNewMoon = getNewMoonOccurrence(sunrise, false);

  const lastSolarMonth = getLagnaIndex(lastNewMoon);
  const nextSolarMonth = getLagnaIndex(nextNewMoon);

  const isLeap = lastSolarMonth === nextSolarMonth;
  const masaIndex = (lastSolarMonth + 1) % 12;

  return {
    index: masaIndex,
    name: getMasaName(masaIndex, isLeap),
    isLeap: isLeap,
  };
}

function computePurnimantaMasa(sunrise: number): CalendarUnawareMasa {
  const lastFullMoon = getFullMoonOccurrence(sunrise, true);
  const nextFullMoon = getFullMoonOccurrence(sunrise, false);

  const lastSolarMonth = getLagnaIndex(lastFullMoon);
  const nextSolarMonth = getLagnaIndex(nextFullMoon);

  const isLeap = lastSolarMonth === nextSolarMonth;
  const masaIndex = (lastSolarMonth + 2) % 12;

  return {
    index: masaIndex,
    name: getMasaName(masaIndex, isLeap),
    isLeap: isLeap,
  };
}

export function compute(sunrise: number): Masa {
  const amanta = computeAmantaMasa(sunrise);
  const purnimanta = computePurnimantaMasa(sunrise);

  return {
    amanta,
    purnimanta
  };
}
