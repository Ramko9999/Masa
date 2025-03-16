import { inverseLagrangianInterpolation, toArcSeconds } from "../util";
import * as Astronomy from "astronomy-engine";
import { addDays, generateHourlyOffsets } from "../../../util/date";

const TITHI_NAMES = [
  "Shukla Prathama",
  "Shukla Dwitiya",
  "Shukla Tritiya",
  "Shukla Chaturthi",
  "Shukla Panchami",
  "Shukla Sashti",
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
  "Krishna Sashti",
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
  SHAKUNI: "Shakuni"
}

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
const ARC_SECONDS_PADDING = 10;

type KaranaInterval = {
  startDate: number;
  endDate: number;
  name: string;
}

export type TithiInterval = {
  startDate: number;
  endDate: number;
  index: number;
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

  const karanaPosition = (tithiIndex * 2 + (forFirstHalf ? 0 : 1)) - 1;
  return RECURRING_KARANAS[karanaPosition % RECURRING_KARANAS.length];
}

function tithiFunc(offset: number) {
  return toArcSeconds(Astronomy.MoonPhase(new Date(offset)));
}

function getTithiStart(date: number, moonPhase: number) {
  const expectedMoonPhase = Math.floor(moonPhase / TITHI_INTERVAL_ARC_SECONDS) * TITHI_INTERVAL_ARC_SECONDS;
  return Math.floor(inverseLagrangianInterpolation(generateHourlyOffsets(date, -6, 6), tithiFunc, expectedMoonPhase));
}

function getTithiEnd(date: number, moonPhase: number) {
  const expectedMoonPhase = Math.ceil(moonPhase / TITHI_INTERVAL_ARC_SECONDS) * TITHI_INTERVAL_ARC_SECONDS;
  return Math.floor(inverseLagrangianInterpolation(generateHourlyOffsets(date, 6, 6), tithiFunc, expectedMoonPhase));
}

function computeKarana({ startDate, endDate, index }: { startDate: number, endDate: number, index: number }): KaranaInterval[] {
  const midMoonPhase = (index + 0.5) * TITHI_INTERVAL_ARC_SECONDS;
  const tithiMid = Math.floor(inverseLagrangianInterpolation(generateHourlyOffsets(startDate, 4, 6), tithiFunc, midMoonPhase));

  return [
    {
      startDate: startDate,
      endDate: tithiMid,
      name: getKarana(index, true)
    },
    {
      startDate: tithiMid,
      endDate: endDate,
      name: getKarana(index, false)
    }
  ];
}

// todo: might need to handle special case when moonphase is exactly that of a tithi start/end
export function compute(day: number, sunrise: number): TithiInterval[] {
  const nextDay = addDays(day, 1);
  const moonPhase = tithiFunc(day);

  let currentTithiIndex = (Math.floor(moonPhase / TITHI_INTERVAL_ARC_SECONDS)) % 30;
  let currentTithiStart = getTithiStart(day, moonPhase);
  let currentTithiEnd = getTithiEnd(day, moonPhase);

  const tithis = [
    {
      startDate: currentTithiStart,
      endDate: currentTithiEnd,
      index: currentTithiIndex,
      name: TITHI_NAMES[currentTithiIndex],
      karana: computeKarana({ startDate: currentTithiStart, endDate: currentTithiEnd, index: currentTithiIndex })
    },
  ];

  while (currentTithiEnd < nextDay) {
    currentTithiStart = currentTithiEnd;
    currentTithiIndex = (currentTithiIndex + 1) % 30;
    currentTithiEnd = getTithiEnd(currentTithiStart, currentTithiIndex * TITHI_INTERVAL_ARC_SECONDS + ARC_SECONDS_PADDING);
    tithis.push({
      startDate: currentTithiStart,
      endDate: currentTithiEnd,
      index: currentTithiIndex,
      name: TITHI_NAMES[currentTithiIndex],
      karana: computeKarana({ startDate: currentTithiStart, endDate: currentTithiEnd, index: currentTithiIndex })
    });
  }

  return tithis.filter(({ endDate }) => endDate >= sunrise);
}
