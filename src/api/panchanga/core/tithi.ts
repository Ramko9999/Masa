import {
  getMoonPhaseOccurence,
  inverseLagrangianInterpolation,
  makeDecreasingAnglesNonCircular,
  makeIncreasingAnglesNonCircular,
  toArcSeconds,
  TOTAL_ARC_SECONDS,
} from "@/api/panchanga/util";
import * as Astronomy from "astronomy-engine";
import { addDays, generateHourlyOffsets } from "@/util/date";

export const enum TithiIndex {
  ShuklaPratipada = 0,
  ShuklaDwitiya = 1,
  ShuklaTritiya = 2,
  ShuklaChaturthi = 3,
  ShuklaPanchami = 4,
  ShuklaShashti = 5,
  ShuklaSaptami = 6,
  ShuklaAshtami = 7,
  ShuklaNavami = 8,
  ShuklaDashami = 9,
  ShuklaEkadashi = 10,
  ShuklaDwadashi = 11,
  ShuklaTrayodashi = 12,
  ShuklaChaturdashi = 13,
  Purnima = 14,
  KrishnaPratipada = 15,
  KrishnaDwitiya = 16,
  KrishnaTritiya = 17,
  KrishnaChaturthi = 18,
  KrishnaPanchami = 19,
  KrishnaShashti = 20,
  KrishnaSaptami = 21,
  KrishnaAshtami = 22,
  KrishnaNavami = 23,
  KrishnaDashami = 24,
  KrishnaEkadashi = 25,
  KrishnaDwadashi = 26,
  KrishnaTrayodashi = 27,
  KrishnaChaturdashi = 28,
  Amavasya = 29,
}

export const TITHI_NAMES = [
  "Shukla Pratipada",
  "Shukla Dwitiya",
  "Shukla Tritiya",
  "Shukla Chaturthi",
  "Shukla Panchami",
  "Shukla Shashti",
  "Shukla Saptami",
  "Shukla Ashtami",
  "Shukla Navami",
  "Shukla Dashami",
  "Shukla Ekadashi",
  "Shukla Dwadashi",
  "Shukla Trayodashi",
  "Shukla Chaturdashi",
  "Purnima",
  "Krishna Pratipada",
  "Krishna Dwitiya",
  "Krishna Tritiya",
  "Krishna Chaturthi",
  "Krishna Panchami",
  "Krishna Shashti",
  "Krishna Saptami",
  "Krishna Ashtami",
  "Krishna Navami",
  "Krishna Dashami",
  "Krishna Ekadashi",
  "Krishna Dwadashi",
  "Krishna Trayodashi",
  "Krishna Chaturdashi",
  "Amavasya",
];

const NON_RECURRING_KARANAS = {
  KIMSTUGHNA: "Kimstughna",
  CATUSHPADA: "Catushpada",
  NAGA: "Naga",
  SHAKUNI: "Shakuni",
};

const RECURRING_KARANAS = [
  "Bava",
  "Balava",
  "Kanlava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
];

const TITHI_INTERVAL_ARC_SECONDS = toArcSeconds(12);

type KaranaInterval = {
  startDate: number;
  endDate: number;
  name: string;
};

export type TithiInterval = {
  startDate: number;
  endDate: number;
  index: TithiIndex;
  name: string;
  karana: KaranaInterval[];
};

function getKarana(tithiIndex: number, forFirstHalf: boolean): string {
  if (tithiIndex === 0 && forFirstHalf) {
    return NON_RECURRING_KARANAS.KIMSTUGHNA;
  }

  if (tithiIndex === 29 && forFirstHalf) {
    return NON_RECURRING_KARANAS.CATUSHPADA;
  }

  if (tithiIndex === 29 && !forFirstHalf) {
    return NON_RECURRING_KARANAS.NAGA;
  }

  if (tithiIndex === 28 && !forFirstHalf) {
    return NON_RECURRING_KARANAS.SHAKUNI;
  }

  const karanaPosition = tithiIndex * 2 + (forFirstHalf ? 0 : 1) - 1;
  return RECURRING_KARANAS[karanaPosition % RECURRING_KARANAS.length];
}

function tithiFunc(offset: number) {
  return toArcSeconds(Astronomy.MoonPhase(new Date(offset)));
}

function getTithiStart(date: number, moonPhase: number) {
  const expectedMoonPhase =
    Math.floor(moonPhase / TITHI_INTERVAL_ARC_SECONDS) *
    TITHI_INTERVAL_ARC_SECONDS;

  const offsets = generateHourlyOffsets(date, -6, 6);
  const angles = makeDecreasingAnglesNonCircular(
    offsets.map((offset) => tithiFunc(offset))
  );
  return Math.floor(
    inverseLagrangianInterpolation(offsets, angles, expectedMoonPhase)
  );
}

function getTithiEnd(currentTithiIndex: number, currentTithiStartDate: number) {
  const tithiBeginPhase =
    (currentTithiIndex * TITHI_INTERVAL_ARC_SECONDS) % TOTAL_ARC_SECONDS;

  const nextOffsets = generateHourlyOffsets(currentTithiStartDate, 6, 5, true);
  const angles = makeIncreasingAnglesNonCircular([
    tithiBeginPhase,
    ...nextOffsets.map(tithiFunc),
  ]);
  const offsets = [currentTithiStartDate, ...nextOffsets];

  return Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      angles,
      tithiBeginPhase + TITHI_INTERVAL_ARC_SECONDS
    )
  );
}

function computeKarana(
  startDate: number,
  endDate: number,
  index: number
): KaranaInterval[] {
  const midMoonPhase = (index + 0.5) * TITHI_INTERVAL_ARC_SECONDS;
  const offsets = generateHourlyOffsets(startDate, 4, 4);
  const tithiMid = Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      offsets.map(tithiFunc),
      midMoonPhase
    )
  );

  return [
    {
      startDate: startDate,
      endDate: tithiMid,
      name: getKarana(index, true),
    },
    {
      startDate: tithiMid,
      endDate: endDate,
      name: getKarana(index, false),
    },
  ];
}

export function compute(day: number, sunrise: number): TithiInterval[] {
  const nextDay = addDays(day, 1);
  const moonPhase = tithiFunc(day);

  let currentTithiIndex =
    Math.floor(moonPhase / TITHI_INTERVAL_ARC_SECONDS) % 30;
  let currentTithiStart = getTithiStart(day, moonPhase);

  let currentTithi = getTithiInterval(currentTithiStart, currentTithiIndex);

  const tithis: TithiInterval[] = [currentTithi];

  while (currentTithi.endDate < nextDay) {
    currentTithi = getTithiInterval(
      currentTithi.endDate,
      (currentTithi.index + 1) % 30
    );
    tithis.push({ ...currentTithi });
  }

  return tithis.filter(({ endDate }) => endDate >= sunrise);
}

function getTithiInterval(startDate: number, tithiIndex: number): TithiInterval {
  const endDate = getTithiEnd(tithiIndex, startDate);
  return {
    startDate,
    endDate,
    index: tithiIndex,
    name: TITHI_NAMES[tithiIndex],
    karana: computeKarana(startDate, endDate, tithiIndex),
  };
}

export function searchForTithi(since: number, tithiIndex: number) {
  const tithiStart = getMoonPhaseOccurence(
    since,
    tithiIndex * TITHI_INTERVAL_ARC_SECONDS
  );
  return getTithiInterval(tithiStart, tithiIndex);
}
