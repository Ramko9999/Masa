import { addDays } from "@/util/date";
import {
  getPreviousNakshatra,
  NakshatraIndex,
  NakshatraInterval,
} from "./nakshatra";

export const enum MuhurtamType {
    RahuKalam = "rahu_kalam",
    YamaGandam = "yama_gandam",
    Abhijit = "abhijit",
    GulikaKalam = "gulika_kalam",
    Varjyam = "varjyam",
}

export type MuhurtamInterval = {
  muhurtham: MuhurtamType;
  isPositive: boolean;
  startTime: number; // epoch millis
  endTime: number; // epoch millis
};

export const ThyajaGhatiByNakshatra: Partial<Record<NakshatraIndex, number>> = {
  [NakshatraIndex.Ashwini]: 50,
  [NakshatraIndex.Bharani]: 4,
  [NakshatraIndex.Krittika]: 30,
  [NakshatraIndex.Rohini]: 40,
  [NakshatraIndex.Mrigashira]: 14,
  [NakshatraIndex.Ardra]: 21,
  [NakshatraIndex.Punarvasu]: 30,
  [NakshatraIndex.Pushya]: 20,
  [NakshatraIndex.Ashlesha]: 32,
  [NakshatraIndex.Magha]: 30,
  [NakshatraIndex.PurvaPhalguni]: 20,
  [NakshatraIndex.UttaraPhalguni]: 1,
  [NakshatraIndex.Hasta]: 21,
  [NakshatraIndex.Chitra]: 20,
  [NakshatraIndex.Swati]: 14,
  [NakshatraIndex.Vishakha]: 14,
  [NakshatraIndex.Anuradha]: 10,
  [NakshatraIndex.Jyeshtha]: 14,
  [NakshatraIndex.Mula]: 20,
  [NakshatraIndex.PurvaAshadha]: 20,
  [NakshatraIndex.UttaraAshadha]: 20,
  [NakshatraIndex.Shravana]: 10,
  [NakshatraIndex.Dhanishta]: 10,
  [NakshatraIndex.Shatabhisha]: 18,
  [NakshatraIndex.PurvaBhadrapada]: 16,
  [NakshatraIndex.UttaraBhadrapada]: 30,
  [NakshatraIndex.Revati]: 30,
};

function getRahuKalam(
  sunrise: number,
  sunset: number,
  date: number
): MuhurtamInterval {
  const dayOfWeek = new Date(date).getDay();
  const daylightDuration = sunset - sunrise;
  const partDuration = daylightDuration / 8;

  const rahuKalamSegment = [7, 1, 6, 4, 5, 3, 2];
  const segment = rahuKalamSegment[dayOfWeek];

  const startTime = sunrise + segment * partDuration;
  const endTime = startTime + partDuration;

  return {
    muhurtham: MuhurtamType.RahuKalam,
    isPositive: false,
    startTime,
    endTime,
  };
}

export function getAbhijitMuhurtam(
  sunrise: number,
  sunset: number
): MuhurtamInterval {
  const daylightDuration = sunset - sunrise;
  const partDuration = daylightDuration / 15;
  const startTime = sunrise + 7 * partDuration;
  const endTime = sunrise + 8 * partDuration;
  return {
    muhurtham: MuhurtamType.Abhijit,
    isPositive: true,
    startTime,
    endTime,
  };
}

export function getYamaGandam(
  sunrise: number,
  sunset: number,
  date: number
): MuhurtamInterval {
  const dayOfWeek = new Date(date).getDay();
  const daylightDuration = sunset - sunrise;
  const partDuration = daylightDuration / 8;

  const yamaGandamSegment = [4, 3, 2, 1, 0, 6, 5];
  const segment = yamaGandamSegment[dayOfWeek];

  const startTime = sunrise + segment * partDuration;
  const endTime = startTime + partDuration;

  return {
    muhurtham: MuhurtamType.YamaGandam,
    isPositive: false,
    startTime,
    endTime,
  };
}

export function getGulikaKalam(
  sunrise: number,
  sunset: number,
  date: number
): MuhurtamInterval {
  const dayOfWeek = new Date(date).getDay();
  const daylightDuration = sunset - sunrise;
  const partDuration = daylightDuration / 8;

  const gulikaKalamSegment = [6, 5, 4, 3, 2, 1, 0];
  const segment = gulikaKalamSegment[dayOfWeek];

  const startTime = sunrise + segment * partDuration;
  const endTime = startTime + partDuration;

  return {
    muhurtham: MuhurtamType.GulikaKalam,
    isPositive: false,
    startTime,
    endTime,
  };
}

export function getVarjyams(
  day: number,
  nakshatra: NakshatraInterval[]
): MuhurtamInterval[] {
  const nextDay = addDays(day, 1);

  const allNakshatras = [getPreviousNakshatra(nakshatra[0]), ...nakshatra];
  const varjyamIntervals = allNakshatras
    .filter(({ index }) => ThyajaGhatiByNakshatra[index] !== undefined)
    .map(({ index, startDate, endDate }) => {
      const duration = endDate - startDate;
      const ghatiStart = ThyajaGhatiByNakshatra[index] as number;
      const varjyamStart = Math.floor((ghatiStart * duration) / 60 + startDate);
      const varjyamEnd = varjyamStart + duration / 15;
      return {
        startTime: varjyamStart,
        endTime: varjyamEnd,
      };
    });

  const varjyamsForDay = varjyamIntervals.flatMap(({ startTime, endTime }) => {
    if (day > endTime || nextDay < startTime) {
      return [];
    }

    const varjyamStart = Math.max(startTime, day);
    const varjyamEnd = Math.min(endTime, nextDay);
    return [
      {
        startTime: varjyamStart,
        endTime: varjyamEnd,
      },
    ];
  });

  return varjyamsForDay.map((varjyam) => ({
    muhurtham: MuhurtamType.Varjyam,
    isPositive: false,
    ...varjyam,
  }));
}

export function compute(
  sunrise: number,
  sunset: number,
  date: number,
  nakshatra: NakshatraInterval[]
): MuhurtamInterval[] {
  const muhurtams = [
    getRahuKalam(sunrise, sunset, date),
    getAbhijitMuhurtam(sunrise, sunset),
    getYamaGandam(sunrise, sunset, date),
    getGulikaKalam(sunrise, sunset, date),
    ...getVarjyams(date, nakshatra),
  ].sort((a, b) => a.startTime - b.startTime);

  // handle conflicts between positive/negative muhurtams
  for (let i = 0; i < muhurtams.length - 1; i++) {
    const current = muhurtams[i];
    const next = muhurtams[i + 1];
    if (current.endTime > next.startTime) {
      if (current.isPositive) {
        current.endTime = next.startTime;
      } else {
        next.startTime = current.endTime;
      }
    }
  }

  return muhurtams.filter(({ startTime, endTime }) => startTime < endTime);
}
