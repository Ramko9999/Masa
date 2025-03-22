import {
  adjustForAyanamsa,
  getLunarLongitude,
  getSolarLongitude,
  inverseLagrangianInterpolation,
  makeDecreasingAnglesNonCircular,
  makeIncreasingAnglesNonCircular,
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

function yogaFunc(date: number) {
  const lunarLongitude = adjustForAyanamsa(date, getLunarLongitude(date));
  const solarLongitude = adjustForAyanamsa(date, getSolarLongitude(date));
  return (lunarLongitude + solarLongitude) % TOTAL_ARC_SECONDS;
}

function getYogaStart(date: number, yogaLongitude: number) {
  const expectedYogaLongitude =
    Math.floor(yogaLongitude / YOGA_INTERVAL_ARC_SECONDS) *
    YOGA_INTERVAL_ARC_SECONDS;
  const offsets = generateHourlyOffsets(date, -6, 6);
  return Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      makeDecreasingAnglesNonCircular(offsets.map(yogaFunc)),
      expectedYogaLongitude
    )
  );
}

function getYogaEnd(currentYogaIndex: number, currentYogaStartDate: number) {

  const currentYogaBegin = currentYogaIndex * YOGA_INTERVAL_ARC_SECONDS;
  const nextOffsets = generateHourlyOffsets(currentYogaStartDate, 6, 5, true);
  const angles = makeIncreasingAnglesNonCircular([
    currentYogaBegin,
    ...nextOffsets.map(yogaFunc),
  ]);
  const offsets = [currentYogaStartDate, ...nextOffsets];

  return Math.floor(
    inverseLagrangianInterpolation(
      offsets,
      angles,
      currentYogaBegin + YOGA_INTERVAL_ARC_SECONDS
    )
  );
}

// running into issues with yoga
export function compute(day: number, sunrise: number): YogaInterval[] {
  const nextDay = addDays(day, 1);
  const yogaLongitude = yogaFunc(day);

  const currentYogaIndex = Math.floor(yogaLongitude / YOGA_INTERVAL_ARC_SECONDS);
  const currentYogaStart = getYogaStart(day, yogaLongitude);

  let currentYoga = getYogaInterval(currentYogaStart, currentYogaIndex);

  const yogas: YogaInterval[] = [currentYoga];

  while (currentYoga.endDate < nextDay) {
    currentYoga = getYogaInterval(
      currentYoga.endDate,
      (currentYoga.index + 1) % 27
    );
    yogas.push({ ...currentYoga });
  }

  return yogas.filter(({ endDate }) => endDate >= sunrise);
}

function getYogaInterval(startDate: number, yogaIndex: number) {
  const endDate = getYogaEnd(yogaIndex, startDate);
  return {
    startDate,
    endDate,
    index: yogaIndex,
    name: YOGA_NAMES[yogaIndex],
  };
}
