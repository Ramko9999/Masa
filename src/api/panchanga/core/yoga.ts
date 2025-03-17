import {
  adjustForAyanamsa,
  getLunarLongitude,
  getSolarLongitude,
  inverseLagrangianInterpolation,
  toArcSeconds,
  TOTAL_ARC_SECONDS,
} from "../util";
import { addDays, generateHourlyOffsets } from "../../../util/date";

const enum YogaIndex {
  Vishkambha = 0,
  Preeti = 1,
  Ayushman = 2,
  Saubhagya = 3,
  Shobhana = 4,
  Atiganda = 5,
  Sukarma = 6,
  Dhriti = 7,
  Shoola = 8,
  Ganda = 9,
  Vriddhi = 10,
  Dhruva = 11,
  Vyaghata = 12,
  Harshana = 13,
  Vajra = 14,
  Siddhi = 15,
  Vyatipata = 16,
  Variyan = 17,
  Parigha = 18,
  Shiva = 19,
  Siddha = 20,
  Sadhya = 21,
  Shubha = 22,
  Shukla = 23,
  Brahmana = 24,
  Indra = 25,
  Vaidhriti = 26,
}

const YOGA_NAMES = [
  "Vishkambha",
  "Preeti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

export type YogaInterval = {
  startDate: number;
  endDate: number;
  index: YogaIndex;
  name: string;
};

const YOGA_INTERVAL_ARC_SECONDS = toArcSeconds(360 / 27);
const ARC_SECONDS_PADDING = 10;

function yogaFunc(date: number) {
  const lunarLongitude = adjustForAyanamsa(date, getLunarLongitude(date));
  const solarLongitude = adjustForAyanamsa(date, getSolarLongitude(date));
  return (lunarLongitude + solarLongitude) % TOTAL_ARC_SECONDS;
}

function getYogaStart(date: number, yogaLongitude: number) {
  const expectedYogaLongitude =
    Math.floor(yogaLongitude / YOGA_INTERVAL_ARC_SECONDS) *
    YOGA_INTERVAL_ARC_SECONDS;
  return Math.floor(
    inverseLagrangianInterpolation(
      generateHourlyOffsets(date, -6, 6),
      yogaFunc,
      expectedYogaLongitude
    )
  );
}

function getYogaEnd(date: number, yogaLongitude: number) {
  const expectedYogaLongitude =
    Math.ceil(yogaLongitude / YOGA_INTERVAL_ARC_SECONDS) *
    YOGA_INTERVAL_ARC_SECONDS;
  return Math.floor(
    inverseLagrangianInterpolation(
      generateHourlyOffsets(date, 6, 6),
      yogaFunc,
      expectedYogaLongitude
    )
  );
}

// running into issues with yoga
export function compute(day: number, sunrise: number): YogaInterval[] {
  const nextDay = addDays(day, 1);
  const yogaLongitude = yogaFunc(day);

  let currentYogaIndex = Math.floor(yogaLongitude / YOGA_INTERVAL_ARC_SECONDS);
  let currentYogaStart = getYogaStart(day, yogaLongitude);
  let currentYogaEnd = getYogaEnd(day, yogaLongitude);

  const yogas: YogaInterval[] = [
    {
      startDate: currentYogaStart,
      endDate: currentYogaEnd,
      index: currentYogaIndex,
      name: YOGA_NAMES[currentYogaIndex],
    },
  ];

  while (currentYogaEnd < nextDay) {
    currentYogaStart = currentYogaEnd;
    currentYogaIndex = (currentYogaIndex + 1) % 27;
    const expectedLongitude =
      currentYogaIndex * YOGA_INTERVAL_ARC_SECONDS + ARC_SECONDS_PADDING;
    currentYogaEnd = getYogaEnd(currentYogaStart, expectedLongitude);
    yogas.push({
      startDate: currentYogaStart,
      endDate: currentYogaEnd,
      index: currentYogaIndex,
      name: YOGA_NAMES[currentYogaIndex],
    });
  }

  return yogas.filter(({ endDate }) => endDate >= sunrise);
}
