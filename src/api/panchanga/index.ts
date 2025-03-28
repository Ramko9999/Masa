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

export type Panchanga = {
  tithi: Tithi.TithiInterval[];
  nakshatra: Nakshatra.NakshatraInterval[];
  yoga: Yoga.YogaInterval[];
  masa: Masa.Masa;
  vaara: Vaara.Vaara;
  festivals: Festival.Festival[];
  day: number;
  sunrise: number | null;
  sunset: number | null;
  moonrise: number | null;
  moonset: number | null;
};

export function computePanchanga(day: number, location: Location): Panchanga {
  const sunrise = getSunrise(day, location);
  const sunset = getSunset(day, location);
  const moonrise = getMoonrise(day, location);
  const moonset = getMoonset(day, location);
  const tithi = Tithi.compute(day, sunrise);
  const nakshatra = Nakshatra.compute(day, sunrise);
  const yoga = Yoga.compute(day, sunrise);
  const vaara = Vaara.compute(day);
  const masa = Masa.compute(sunrise);
  const festivals = Festival.compute(day, tithi, masa);

  return {
    tithi,
    nakshatra,
    yoga,
    vaara,
    day,
    masa,
    festivals,
    sunrise,
    sunset,
    moonrise,
    moonset,
  };
}

export function getUpcomingFestivals(anchorDay: number, location: Location) {
  return Festival.getLunarFestivals(anchorDay, location);
}
