import { Location } from "./location";
import * as Yoga from "./core/yoga";
import * as Tithi from "./core/tithi";
import * as Nakshatra from "./core/nakshatra";
import * as Vaara from "./core/vaara";
import * as Masa from "./core/masa";
import * as Festival from "./core/festival";
import { getSunrise } from "./util";
import { truncateToDay } from "../../util/date";

export type Panchanga = {
  tithi: Tithi.TithiInterval[];
  nakshatra: Nakshatra.NakshatraInterval[];
  yoga: Yoga.YogaInterval[];
  masa: Masa.Masa;
  vaara: Vaara.Vaara;
  festivals: Festival.Festival[];
  day: number;
  sunrise: number;
};

export function computePanchanga(day: number, location: Location): Panchanga {
  const sunrise = getSunrise(day, location);
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
  };
}

export function upcomingFestivals(day: number, location: Location) {
  const currentDate = new Date(day);
  const endDate = new Date(currentDate.getFullYear(), 11, 31);

  const festivals: Festival.Festival[] = [];

  while (currentDate < endDate) {
    const currentDateMs = truncateToDay(currentDate.getTime());
    const panchanga = computePanchanga(currentDateMs, location);
    festivals.push(...panchanga.festivals);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return festivals.sort((a, b) => a.date.getTime() - b.date.getTime());
}
