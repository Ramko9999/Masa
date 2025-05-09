import { Location } from "@/api/location";
import * as Yoga from "@/api/panchanga/core/yoga";
import * as Tithi from "@/api/panchanga/core/tithi";
import * as Nakshatra from "@/api/panchanga/core/nakshatra";
import * as Vaara from "@/api/panchanga/core/vaara";
import * as Masa from "@/api/panchanga/core/masa";
import * as Festival from "@/api/panchanga/core/festival";
import {
  getMoonrise,
  getMoonset,
  getSunrise,
  getSunset,
} from "@/api/panchanga/util";
import * as Muhurtam from "./core/muhurtam";

export type Panchanga = {
  tithi: Tithi.TithiInterval[];
  nakshatra: Nakshatra.NakshatraInterval[];
  yoga: Yoga.YogaInterval[];
  masa: Masa.Masa;
  vaara: Vaara.Vaara;
  festivals: Festival.Festival[];
  muhurtam: Muhurtam.MuhurtamInterval[];
  day: number;
  sunrise: number | null;
  sunset: number | null;
  moonrise: number | null;
  moonset: number | null;
};

export function computePanchanga(day: number, location: Location): Panchanga {
  const startTime = performance.now();
  
  const sunrise = getSunrise(day, location);
  const sunset = getSunset(day, location);
  const moonrise = getMoonrise(day, location);
  const moonset = getMoonset(day, location);
  const tithi = Tithi.compute(day, sunrise);
  const nakshatra = Nakshatra.compute(day, sunrise);
  const yoga = Yoga.compute(day, sunrise);
  const vaara = Vaara.compute(day);
  const masa = Masa.compute(sunrise);
  const muhurtam = Muhurtam.compute(sunrise, sunset, day, nakshatra);
  const festivals = Festival.getFestivals(location).filter(
    (festival) => festival.date === day
  );

  const endTime = performance.now();
  console.log(`Total computePanchanga: ${endTime - startTime}ms`);

  return {
    tithi,
    nakshatra,
    yoga,
    vaara,
    day,
    masa,
    muhurtam,
    festivals,
    sunrise,
    sunset,
    moonrise,
    moonset,
  };
}

export function getFestivals(location: Location) {
  return Festival.getFestivals(location);
}
