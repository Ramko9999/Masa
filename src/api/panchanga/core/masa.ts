import {
  getSolarLongitude,
  adjustForAyanamsa,
  toArcSeconds,
  getNewMoonOccurrence,
  getFullMoonOccurrence,
  getSunrise,
} from "@/api/panchanga/util";
import { Location } from "@/api/location";
import { addDays } from "@/util/date";

const LAGNA_INTERVAL_ARC_SECONDS = toArcSeconds(30);

export const enum MasaIndex {
  Chaitra = 0,
  Vaisakha = 1,
  Jyeshtha = 2,
  Ashadha = 3,
  Shravana = 4,
  Bhadrapada = 5,
  Ashwina = 6,
  Kartika = 7,
  Margashirsha = 8,
  Pausha = 9,
  Magha = 10,
  Phalguna = 11,
}

export const MASA_NAMES = [
  "Chaitra",
  "Vaisakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwina",
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

function getPurnimantaMasaFromMoonOccurence(
  lastFullMoonOccuredAt: number,
  nextFullMoonOccuredAt: number
): CalendarUnawareMasa {
  const lastSolarMonth = getLagnaIndex(lastFullMoonOccuredAt);
  const nextSolarMonth = getLagnaIndex(nextFullMoonOccuredAt);

  const isLeap = lastSolarMonth === nextSolarMonth;
  const index = (lastSolarMonth + 2) % 12;
  return {
    index,
    isLeap,
    name: getMasaName(index, isLeap),
  };
}

function computePurnimantaMasa(sunrise: number): CalendarUnawareMasa {
  const lastFullMoon = getFullMoonOccurrence(sunrise, true);
  const nextFullMoon = getFullMoonOccurrence(sunrise, false);
  return getPurnimantaMasaFromMoonOccurence(lastFullMoon, nextFullMoon);
}

export function compute(sunrise: number): Masa {
  const amanta = computeAmantaMasa(sunrise);
  const purnimanta = computePurnimantaMasa(sunrise);

  return {
    amanta,
    purnimanta,
  };
}

export function getPurnimantaMasaCalendarForYear(
  year: number,
  location: Location
) {
  const firstDay = new Date(year, 0, 1);
  const nextYear = new Date(year + 1, 0, 1);
  const firstSunrise = getSunrise(firstDay.valueOf(), location);

  const lastFullMoon = getFullMoonOccurrence(firstSunrise, true);
  const nextFullMoon = getFullMoonOccurrence(firstSunrise, false);
  const masa = getPurnimantaMasaFromMoonOccurence(lastFullMoon, nextFullMoon);

  let currentMasaInterval = {
    startDate: lastFullMoon,
    endDate: nextFullMoon,
    ...masa,
  };
  const masaIntervals = [currentMasaInterval];

  while (currentMasaInterval.endDate < nextYear.valueOf()) {
    const nextFullMoon = getFullMoonOccurrence(
      addDays(currentMasaInterval.endDate, 3), // padding to get the next full moon
      false
    );
    currentMasaInterval = {
      startDate: currentMasaInterval.endDate,
      endDate: nextFullMoon,
      ...getPurnimantaMasaFromMoonOccurence(
        currentMasaInterval.endDate,
        nextFullMoon
      ),
    };
    masaIntervals.push(currentMasaInterval);
  }

  return masaIntervals;
}
