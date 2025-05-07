import {
  adjustForAyanamsa,
  getLunarLongitude,
  inverseLagrangianInterpolation,
  makeDecreasingAnglesNonCircular,
  makeIncreasingAnglesNonCircular,
  toArcSeconds,
  TOTAL_ARC_SECONDS,
} from "@/api/panchanga/util";
import { addDays, generateHourlyOffsets } from "@/util/date";

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

export const NAKSHATRA_NAMES = [
  "ashwini",
  "bharani",
  "krittika",
  "rohini",
  "mrigashira",
  "ardra",
  "punarvasu",
  "pushya",
  "ashlesha",
  "magha",
  "purva_phalguni",
  "uttara_phalguni",
  "hasta",
  "chitra",
  "swati",
  "vishakha",
  "anuradha",
  "jyeshtha",
  "mula",
  "purva_ashadha",
  "uttara_ashadha",
  "shravana",
  "dhanishta",
  "shatabhisha",
  "purva_bhadrapada",
  "uttara_bhadrapada",
  "revati",
];

export type NakshatraInterval = {
  startDate: number;
  endDate: number;
  index: NakshatraIndex;
  name: string;
};

const NAKSHATRA_INTERVAL_ARC_SECONDS = toArcSeconds(360 / 27);

function nakshatraFunc(offset: number) {
  return adjustForAyanamsa(offset, getLunarLongitude(offset));
}

function getNakshatraStart(date: number, lunarLongitude: number) {
  const expectedLongitude =
    Math.floor(lunarLongitude / NAKSHATRA_INTERVAL_ARC_SECONDS) *
    NAKSHATRA_INTERVAL_ARC_SECONDS;

  const offsets = generateHourlyOffsets(date, -6, 6);
  return Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      makeDecreasingAnglesNonCircular(offsets.map(nakshatraFunc)),
      expectedLongitude
    )
  );
}

function getNakshatraEnd(
  currentNakshatraIndex: number,
  currentNakshatraStartDate: number
) {
  const currentNakshatraBegin =
    (currentNakshatraIndex * NAKSHATRA_INTERVAL_ARC_SECONDS) %
    TOTAL_ARC_SECONDS;

  const nextOffsets = generateHourlyOffsets(
    currentNakshatraStartDate,
    6,
    5,
    true
  );
  const angles = makeIncreasingAnglesNonCircular([
    currentNakshatraBegin,
    ...nextOffsets.map(nakshatraFunc),
  ]);
  const offsets = [currentNakshatraStartDate, ...nextOffsets];
  return Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      angles,
      currentNakshatraBegin + NAKSHATRA_INTERVAL_ARC_SECONDS
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
  let currentNakshatra = getNakshatraInterval(
    currentNakshatraStart,
    currentNakshatraIndex
  );

  const nakshatras: NakshatraInterval[] = [currentNakshatra];

  while (currentNakshatra.endDate < nextDay || nakshatras.filter(({ endDate }) => endDate >= sunrise).length < 2) {
    currentNakshatra = getNakshatraInterval(
      currentNakshatra.endDate,
      (currentNakshatra.index + 1) % 27
    );
    nakshatras.push({ ...currentNakshatra });
  }

  return nakshatras.filter(({ endDate }) => endDate >= sunrise);
}

function getNakshatraInterval(startDate: number, nakshatraIndex: number) {
  const endDate = getNakshatraEnd(nakshatraIndex, startDate);
  return {
    startDate,
    endDate,
    index: nakshatraIndex,
    name: NAKSHATRA_NAMES[nakshatraIndex],
  };
}
