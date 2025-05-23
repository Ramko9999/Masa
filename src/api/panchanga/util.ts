import * as Astronomy from "astronomy-engine";
import { Location } from "@/api/location";
import { positiveModulo } from "@/util/math";

export const TOTAL_ARC_SECONDS = 3600 * 360;
const MOON_SEARCH_DAYS = 30;

function approximateAyanamsa(day: number) {
  const yearInProgress =
    (day - new Date(new Date(day).getFullYear(), 0, 0).valueOf()) /
    (1000 * 3600 * 24 * 365);
  const year = new Date(day).getFullYear() + yearInProgress;
  return Math.floor((year - 285) * 50);
}

export function getSunrise(
  day: number,
  { latitude, longitude }: Location
): number {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const search = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    1,
    new Date(day),
    1
  );

  if (!search) {
    throw new Error(
      `Sunrise not found for ${new Date(
        day
      ).toLocaleDateString()}, location: ${latitude}, ${longitude}`
    );
  }

  return search.date.valueOf();
}

export function getSunset(
  day: number,
  { latitude, longitude }: Location
): number {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const search = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    -1,
    new Date(day),
    1
  );

  if (!search) {
    throw new Error("Unexpected: failed to find sunset");
  }

  return search.date.valueOf();
}

export function getSunLongitudeMoment(
  niryanaLongitude: number,
  anchorDay: number,
  limit: number
) {
  const longitude =
    niryanaLongitude + toDegrees(approximateAyanamsa(anchorDay));
  const moment = Astronomy.SearchSunLongitude(
    longitude,
    new Date(anchorDay),
    limit
  );
  if (!moment) {
    throw new Error(
      `Could not find sun longitude ${longitude} on ${new Date(
        anchorDay
      )}. This is unexpected.`
    );
  }
  return moment.date.valueOf();
}

export function getMoonrise(
  day: number,
  { latitude, longitude }: Location
): number | null {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const search = Astronomy.SearchRiseSet(
    Astronomy.Body.Moon,
    observer,
    1,
    new Date(day),
    1
  );

  if (!search) {
    return null;
  }

  return search.date.valueOf();
}

export function getMoonset(
  day: number,
  { latitude, longitude }: Location
): number | null {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const search = Astronomy.SearchRiseSet(
    Astronomy.Body.Moon,
    observer,
    -1,
    new Date(day),
    1
  );

  if (!search) {
    return null;
  }

  return search.date.valueOf();
}

export function inverseLagrangianInterpolation(
  offsets: number[],
  yPoints: number[],
  expectedY: number
): number {
  const xPoints = offsets;

  if (xPoints.length !== yPoints.length || xPoints.length < 2) {
    throw new Error(
      "Input arrays must have same length and contain at least 2 points"
    );
  }

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < xPoints.length; i++) {
    let term = 1;
    for (let j = 0; j < xPoints.length; j++) {
      if (i !== j) {
        term *= (expectedY - yPoints[j]) / (yPoints[i] - yPoints[j]);
      }
    }
    numerator += xPoints[i] * term;
    denominator += term;
  }

  return numerator / denominator;
}

export function getSolarLongitude(day: number) {
  return toArcSeconds(Astronomy.SunPosition(new Date(day)).elon);
}

export function getLunarLongitude(day: number) {
  const phase = toArcSeconds(Astronomy.MoonPhase(new Date(day)));
  return (getSolarLongitude(day) + phase) % TOTAL_ARC_SECONDS;
}

export function getNewMoonOccurrence(
  anchorDay: number,
  lookForPreviousNewMoon: boolean
): number {
  const newMoonPhase = 0;

  // Search for the new moon in the specified direction
  const newMoonTime = Astronomy.SearchMoonPhase(
    newMoonPhase,
    new Date(anchorDay),
    lookForPreviousNewMoon ? -1 * MOON_SEARCH_DAYS : MOON_SEARCH_DAYS
  );

  if (!newMoonTime) {
    throw new Error(
      `Could not find ${
        lookForPreviousNewMoon ? "previous" : "next"
      } new moon from ${new Date(anchorDay)}. This is unexpected.`
    );
  }

  return newMoonTime.date.valueOf();
}

export function getFullMoonOccurrence(
  anchorDay: number,
  lookForPreviousFullMoon: boolean
): number {
  const fullMoonPhase = 180;
  const fullMoonTime = Astronomy.SearchMoonPhase(
    fullMoonPhase,
    new Date(anchorDay),
    lookForPreviousFullMoon ? -1 * MOON_SEARCH_DAYS : MOON_SEARCH_DAYS
  );

  if (!fullMoonTime) {
    throw new Error(
      `Could not find ${
        lookForPreviousFullMoon ? "previous" : "next"
      } full moon from ${new Date(anchorDay)}. This is unexpected.`
    );
  }

  return fullMoonTime.date.valueOf();
}

export function getMoonPhaseOccurence(
  anchorDay: number,
  phaseInArcSeconds: number
) {
  const phaseDegrees = toDegrees(phaseInArcSeconds);
  const moonPhase = Astronomy.SearchMoonPhase(
    phaseDegrees,
    new Date(anchorDay),
    MOON_SEARCH_DAYS
  );

  if (!moonPhase) {
    throw new Error(
      `Could not find moon phase ${phaseDegrees} on ${new Date(
        anchorDay
      )}. This is unexpected.`
    );
  }

  return moonPhase.date.valueOf();
}

export function adjustForAyanamsa(day: number, longitudeInArcSeconds: number) {
  return positiveModulo(
    longitudeInArcSeconds - approximateAyanamsa(day),
    TOTAL_ARC_SECONDS
  );
}

export function toArcSeconds(degree: number) {
  return degree * 3600;
}

export function toDegrees(arcSeconds: number) {
  return arcSeconds / 3600;
}

export function makeIncreasingAnglesNonCircular(angles: number[]) {
  for (let i = 0; i < angles.length - 1; i++) {
    if (angles[i + 1] < angles[i]) {
      angles[i + 1] += toArcSeconds(360);
    }
  }
  return angles;
}

export function makeDecreasingAnglesNonCircular(angles: number[]) {
  for (let i = 0; i < angles.length - 1; i++) {
    if (angles[i + 1] > angles[i]) {
      angles[i + 1] -= toArcSeconds(360);
    }
  }
  return angles;
}
