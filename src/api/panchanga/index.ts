import { Location } from "./location";
import * as Yoga from "./core/yoga";
import * as Tithi from "./core/tithi";
import * as Nakshatra from "./core/nakshatra";
import * as Vaara from "./core/vaara";
import * as Masa from "./core/masa";
import { getSunrise } from "./util";

export type Panchanga = {
  tithi: Tithi.TithiInterval[];
  nakshatra: Nakshatra.NakshatraInterval[];
  yoga: Yoga.YogaInterval[];
  masa: Masa.Masa;
  vaara: string;
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

  return {
    tithi,
    nakshatra,
    yoga,
    vaara,
    day,
    masa,
    sunrise,
  };
}
