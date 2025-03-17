import {
  adjustForAyanamsa,
  getLunarLongitude,
  inverseLagrangianInterpolation,
  toArcSeconds,
} from "../util";
import { addDays, generateHourlyOffsets } from "../../../util/date";

export const enum NakshatraIndex {
  Ashwini = 0,
  Bharani = 1,
  Krittika = 2,
  Rohini = 3,
  Mrigashira = 4,
  Ardra = 5,
  Punarvasu = 6,
  Pushya = 7,
  Ashlesha = 8,
  Magha = 9,
  PurvaPhalguni = 10,
  UttaraPhalguni = 11,
  Hasta = 12,
  Chitra = 13,
  Swati = 14,
  Vishakha = 15,
  Anuradha = 16,
  Jyeshtha = 17,
  Mula = 18,
  PurvaAshadha = 19,
  UttaraAshadha = 20,
  Shravana = 21,
  Dhanishta = 22,
  Shatabhisha = 23,
  PurvaBhadrapada = 24,
  UttaraBhadrapada = 25,
  Revati = 26,
}

const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

export type NakshatraInterval = {
  startDate: number;
  endDate: number;
  index: NakshatraIndex;
  name: string;
};

const NAKSHATRA_INTERVAL_ARC_SECONDS = toArcSeconds(360 / 27);
const ARC_SECONDS_PADDING = 10;

function nakshatraFunc(offset: number) {
  return adjustForAyanamsa(offset, getLunarLongitude(offset));
}

function getNakshatraStart(date: number, lunarLongitude: number) {
  const expectedLongitude =
    Math.floor(lunarLongitude / NAKSHATRA_INTERVAL_ARC_SECONDS) *
    NAKSHATRA_INTERVAL_ARC_SECONDS;
  return Math.floor(
    inverseLagrangianInterpolation(
      generateHourlyOffsets(date, -6, 6),
      nakshatraFunc,
      expectedLongitude
    )
  );
}

function getNakshatraEnd(date: number, lunarLongitude: number) {
  const expectedLongitude =
    Math.ceil(lunarLongitude / NAKSHATRA_INTERVAL_ARC_SECONDS) *
    NAKSHATRA_INTERVAL_ARC_SECONDS;
  return Math.floor(
    inverseLagrangianInterpolation(
      generateHourlyOffsets(date, 6, 6),
      nakshatraFunc,
      expectedLongitude
    )
  );
}

export function compute(day: number, sunrise: number): NakshatraInterval[] {
  const nextDay = addDays(day, 1);
  const lunarLongitude = nakshatraFunc(day);

  let currentNakshatraIndex = Math.floor(
    lunarLongitude / NAKSHATRA_INTERVAL_ARC_SECONDS
  );
  let currentNakshatraStart = getNakshatraStart(day, lunarLongitude);
  let currentNakshatraEnd = getNakshatraEnd(day, lunarLongitude);

  const nakshatras: NakshatraInterval[] = [
    {
      startDate: currentNakshatraStart,
      endDate: currentNakshatraEnd,
      index: currentNakshatraIndex,
      name: NAKSHATRA_NAMES[currentNakshatraIndex],
    },
  ];

  while (currentNakshatraEnd < nextDay) {
    currentNakshatraStart = currentNakshatraEnd;
    currentNakshatraIndex = (currentNakshatraIndex + 1) % 27;
    currentNakshatraEnd = getNakshatraEnd(
      currentNakshatraStart,
      currentNakshatraIndex * NAKSHATRA_INTERVAL_ARC_SECONDS +
        ARC_SECONDS_PADDING
    );
    nakshatras.push({
      startDate: currentNakshatraStart,
      endDate: currentNakshatraEnd,
      index: currentNakshatraIndex,
      name: NAKSHATRA_NAMES[currentNakshatraIndex],
    });
  }

  return nakshatras.filter(({ endDate }) => endDate >= sunrise);
}
