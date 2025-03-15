/**
 * simplified-panchanga.ts -- Streamlined TypeScript implementation for tithi calculation
 * using astronomy-engine
 */

import * as Astronomy from "astronomy-engine";

export enum Tithi {
  shukla_pratipada = 1,
  shukla_dwitiya = 2,
  shukla_tritiya = 3,
  shukla_chaturthi = 4,
  shukla_panchami = 5,
  shukla_shashthi = 6,
  shukla_saptami = 7,
  shukla_ashtami = 8,
  shukla_navami = 9,
  shukla_dashami = 10,
  shukla_ekadashi = 11,
  shukla_dwadashi = 12,
  shukla_trayodashi = 13,
  shukla_chaturdashi = 14,
  purnima = 15,
  krishna_pratipada = 16,
  krishna_dwitiya = 17,
  krishna_tritiya = 18,
  krishna_chaturthi = 19,
  krishna_panchami = 20,
  krishna_shashthi = 21,
  krishna_saptami = 22,
  krishna_ashtami = 23,
  krishna_navami = 24,
  krishna_dashami = 25,
  krishna_ekadashi = 26,
  krishna_dwadashi = 27,
  krishna_trayodashi = 28,
  krishna_chaturdashi = 29,
  amavasya = 30,
}

export enum Vaara {
  Adivaram = 0,    // Sunday
  Somavaram = 1,   // Monday
  Mangalavaram = 2, // Tuesday
  Budhavaram = 3,  // Wednesday
  Guruvaram = 4,   // Thursday
  Shukravaram = 5, // Friday
  Shanivaram = 6   // Saturday
}

export enum Masa {
  Chaitra = 1,
  Vaisakha = 2,
  Jyeshtha = 3,
  Ashadha = 4,
  Shravana = 5,
  Bhadrapada = 6,
  Ashwina = 7,
  Kartika = 8,
  Margashirsha = 9,
  Pausha = 10,
  Magha = 11,
  Phalguna = 12
}

// Define basic types
export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Place {
  latitude: number;
  longitude: number;
  timezone: number;
}

// Helper function to convert degrees to DMS
export const toDMS = (deg: number): [number, number, number] => {
  const d = Math.floor(deg);
  const mins = (deg - d) * 60;
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  return [d, m, s];
};

// Julian Day conversions
export const gregorianToJd = (date: Date): number => {
  // Create a JavaScript Date object and convert to AstroTime
  const jsDate = new Date(date.year, date.month - 1, date.day);
  return Astronomy.MakeTime(jsDate).tt;
};

/**
 * Calculate the lunar phase (angle between moon and sun)
 */
export const lunarPhase = (jd: number): number => {
  // Use the built-in moon phase calculation
  return Astronomy.MoonPhase(jd);
};

/**
 * Calculate sunrise time for a given date and place
 */
export const getSunrise = (jd: number, place: Place): number => {
  const { latitude, longitude } = place;
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const search = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    1,
    jd,
    1
  );

  if (!search) {
    return jd;
  }

  return search.tt;
};

/**
 * Find the time when lunar phase equals a specific value
 */
const findPhaseTime = (startJd: number, targetPhase: number): number => {
  // Lunar phase increases by about 12 degrees per day
  // So we can estimate the time when phase equals targetPhase
  const initialPhase = lunarPhase(startJd);

  // Calculate phase difference, handling the circular nature of phases
  let phaseDiff = targetPhase - initialPhase;
  if (phaseDiff < 0) phaseDiff += 360;

  // Estimate time based on moon's movement (~12 degrees per day)
  const estimatedJd = startJd + phaseDiff / 12;

  // Refine the estimate using binary search
  const MAX_ITERATIONS = 10;
  const TOLERANCE = 0.001; // about 1.5 minutes

  let low = startJd;
  let high = startJd + 1.5; // Maximum search window of 1.5 days
  let mid = estimatedJd;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const midPhase = lunarPhase(mid);

    // Calculate the smallest angle between midPhase and targetPhase
    let diff = Math.abs(midPhase - targetPhase);
    if (diff > 180) diff = 360 - diff;

    if (diff < TOLERANCE) {
      return mid;
    }

    // Determine which direction to search
    // We need to handle the circular nature of phases (0-360)
    let moveForward = false;
    if (targetPhase > midPhase) {
      moveForward = targetPhase - midPhase < 180;
    } else {
      moveForward = midPhase - targetPhase > 180;
    }

    if (moveForward) {
      low = mid;
    } else {
      high = mid;
    }

    mid = (low + high) / 2;
  }

  return mid; // Return best estimate after iterations
};

/**
 * Calculate tithi (lunar day) for a given date and place
 * Simplified version that avoids complex interpolation
 *
 * @param jd Julian day number
 * @param place Location information
 * @returns Array containing tithi number and end time in DMS format
 */
export const tithi = (
  jd: number,
  place: Place
): Array<number | [number, number, number]> => {
  const { timezone } = place;

  // 1. Find time of sunrise
  const sunrise = getSunrise(jd, place);

  // 2. Find tithi at sunrise
  const moonPhase = lunarPhase(sunrise);
  const tithiNumber = Math.ceil(moonPhase / 12) % 30;

  // 3. Calculate when the current tithi ends (next tithi begins)
  const endPhase = ((tithiNumber + 1) % 30) * 12;
  const tithiEndJd = findPhaseTime(sunrise, endPhase);

  // Convert end time to local time
  const endTimeHours = (tithiEndJd - jd) * 24 + timezone;
  const endTimeDMS = toDMS(endTimeHours);

  const result: Array<number | [number, number, number]> = [
    tithiNumber,
    endTimeDMS,
  ];

  // 4. Check for skipped tithi
  // If the next tithi also ends within 24 hours of sunrise, we have a skipped tithi
  const nextTithiNumber = (tithiNumber + 1) % 30;
  const nextEndPhase = ((nextTithiNumber + 1) % 30) * 12;
  const nextTithiEndJd = findPhaseTime(tithiEndJd, nextEndPhase);

  // If next tithi also ends within the same day (before next sunrise)
  const nextSunrise = getSunrise(jd + 1, place);
  if (nextTithiEndJd < nextSunrise) {
    const nextEndTimeHours = (nextTithiEndJd - jd) * 24 + timezone;
    const nextEndTimeDMS = toDMS(nextEndTimeHours);
    result.push(nextTithiNumber, nextEndTimeDMS);
  }

  return result;
};

/**
 * Format time from DMS array to string
 */
const formatTime = (dms: [number, number, number]): string => {
  return `${String(dms[0]).padStart(2, "0")}:${String(dms[1]).padStart(
    2,
    "0"
  )}:${String(dms[2]).padStart(2, "0")}`;
};

/**
 * Get tithi name from tithi number
 */
const getTithiNameFromNumber = (tithiNumber: number): string => {
  const tithiNames = [
    "Amavasya",
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

  return tithiNames[tithiNumber % 30];
};

/**
 * Get the name of the tithi for a given Julian day and place
 */
export const getTithiName = (jd: number, place: Place): string => {
  const tithiResult = tithi(jd, place);
  const tithiNumber = tithiResult[0] as number;
  const tithiEnum = mapTithiNumberToEnum(tithiNumber);
  const endTime = tithiResult[1] as [number, number, number];

  let result = `${tithiNames[tithiEnum]} till ${formatTime(endTime)}`;

  // If there's a skipped tithi
  if (tithiResult.length > 2) {
    const leapTithiNumber = tithiResult[2] as number;
    const leapTithiEnum = mapTithiNumberToEnum(leapTithiNumber);
    const leapEndTime = tithiResult[3] as [number, number, number];
    result += ` & ${tithiNames[leapTithiEnum]} till ${formatTime(leapEndTime)}`;
  }

  return result;
};

export interface PanchangaData {
  tithi: Array<{
    name: string;
    number: number;
    end_time?: [number, number, number];
    enum: Tithi;
  }>;
  paksha: "shukla" | "krishna";
  vaara: {
    name: string;
    sub_text: string;
    enum: Vaara;
  };
  masa: {
    purnima: string;
    enum: Masa;
    isLeap: boolean;
  };
}

/**
 * Map tithi number (1-30) directly to Tithi enum
 */
export const mapTithiNumberToEnum = (tithiNumber: number): Tithi => {
  // Handle special case for Amavasya (can be 0 or 30)
  if (tithiNumber === 0 || tithiNumber === 30) return Tithi.amavasya;

  // Direct mapping from tithi number to enum
  return tithiNumber as Tithi;
};

export const formatTithiChangeTime = (
  currentTithi: { end_time?: [number, number, number] },
  nextTithi: { name: string }
): string => {
  if (!currentTithi.end_time) return "";

  const [hours, minutes, _] = currentTithi.end_time;
  let formattedTime = "";

  if (hours >= 24) {
    formattedTime = `${hours - 24}:${minutes
      .toString()
      .padStart(2, "0")} tomorrow`;
  } else {
    formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} today`;
  }

  return `Changes to ${nextTithi.name} at ${formattedTime}`;
};

/**
 * Calculate vaara (weekday) for a given Julian day
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export const vaara = (jd: number): number => {
  return Math.floor((jd + 1) % 7);
};

/**
 * Get the name of the vaara (weekday)
 */
export const getVaaraName = (vaaraNumber: number): string => {
  const vaaraNames = [
    "Adivaram",
    "Somavaram", 
    "Mangalavaram",
    "Budhavaram",
    "Guruvaram",
    "Shukravaram",
    "Shanivaram"
  ];
  
  return vaaraNames[vaaraNumber];
};

/**
 * Calculate masa (lunar month) for a given Julian day and place
 * 1 = Chaitra, 2 = Vaisakha, ..., 12 = Phalguna
 * Returns [masaNumber, isLeapMonth]
 */
export const masa = (jd: number, place: Place): [number, boolean] => {
  // Get the current tithi
  const tithiResult = tithi(jd, place);
  const tithiNumber = tithiResult[0] as number;
  
  // Get sunrise time
  const sunriseJd = getSunrise(jd, place);
  
  // Find the last new moon (amavasya)
  const lastNewMoon = findNewMoon(sunriseJd, tithiNumber, -1);
  
  // Find the next new moon
  const nextNewMoon = findNewMoon(sunriseJd, tithiNumber, 1);
  
  // Get solar month (raasi) at these times
  const thisSolarMonth = raasi(lastNewMoon);
  const nextSolarMonth = raasi(nextNewMoon);
  
  // If solar month doesn't change between consecutive new moons, it's a leap month
  const isLeapMonth = thisSolarMonth === nextSolarMonth;
  
  // Masa is solar month + 1 (Chaitra starts when sun enters Pisces)
  let masaNumber = thisSolarMonth + 1;
  if (masaNumber > 12) masaNumber = masaNumber % 12;
  
  return [masaNumber, isLeapMonth];
};

/**
 * Find time of new moon (amavasya)
 * opt = -1: Find previous new moon
 * opt = +1: Find next new moon
 */
const findNewMoon = (jd: number, tithiNumber: number, opt: number): number => {
  let start: number;
  
  if (opt === -1) {
    // Previous new moon: go back by current tithi
    start = jd - tithiNumber / 30;
  } else {
    // Next new moon: go forward by remaining tithis
    start = jd + (30 - tithiNumber) / 30;
  }
  
  // Search within a span of ±2 days
  const searchStart = start - 2;
  const searchEnd = start + 2;
  
  // Use binary search to find when lunar phase is 0 (new moon)
  let low = searchStart;
  let high = searchEnd;
  const TOLERANCE = 0.01;
  
  while (high - low > TOLERANCE) {
    const mid = (low + high) / 2;
    const phase = lunarPhase(mid);
    
    if (Math.abs(phase) < TOLERANCE || Math.abs(phase - 360) < TOLERANCE) {
      return mid;
    }
    
    if (phase < 180) {
      high = mid;
    } else {
      low = mid;
    }
  }
  
  return (low + high) / 2;
};

/**
 * Calculate raasi (zodiac sign) for a given Julian day
 * 1 = Mesha (Aries), ..., 12 = Meena (Pisces)
 */
export const raasi = (jd: number): number => {
  // Get the sun's longitude
  const solarLong = solarLongitude(jd);
  
  // Apply ayanamsa correction (Lahiri ayanamsa is approximately 24 degrees)
  const ayanamsa = 24.0;
  let solarNirayana = (solarLong - ayanamsa) % 360;
  if (solarNirayana < 0) solarNirayana += 360;
  
  // Each raasi spans 30 degrees
  return Math.ceil(solarNirayana / 30);
};

/**
 * Get solar longitude at given Julian day
 */
export const solarLongitude = (jd: number): number => {
  // Use EquatorFromEcliptic to convert from ecliptic to equatorial coordinates
  const sunPos = Astronomy.SunPosition(jd);
  return sunPos.elon;
};

// Replace getVaaraName with a mapping object
export const vaaraNames: Record<Vaara, string> = {
  [Vaara.Adivaram]: "Adivaram",
  [Vaara.Somavaram]: "Somavaram",
  [Vaara.Mangalavaram]: "Mangalavaram",
  [Vaara.Budhavaram]: "Budhavaram",
  [Vaara.Guruvaram]: "Guruvaram",
  [Vaara.Shukravaram]: "Shukravaram",
  [Vaara.Shanivaram]: "Shanivaram"
};

// Replace getMasaName with a mapping object
export const masaNames: Record<Masa, string> = {
  [Masa.Chaitra]: "Chaitra",
  [Masa.Vaisakha]: "Vaisakha",
  [Masa.Jyeshtha]: "Jyeshtha",
  [Masa.Ashadha]: "Ashadha",
  [Masa.Shravana]: "Shravana",
  [Masa.Bhadrapada]: "Bhadrapada",
  [Masa.Ashwina]: "Ashwina",
  [Masa.Kartika]: "Kartika",
  [Masa.Margashirsha]: "Margashirsha",
  [Masa.Pausha]: "Pausha",
  [Masa.Magha]: "Magha",
  [Masa.Phalguna]: "Phalguna"
};

// Add tithiNames mapping similar to vaaraNames and masaNames
export const tithiNames: Record<Tithi, string> = {
  [Tithi.amavasya]: "Amavasya",
  [Tithi.shukla_pratipada]: "Shukla Prathama",
  [Tithi.shukla_dwitiya]: "Shukla Dwitiya",
  [Tithi.shukla_tritiya]: "Shukla Tritiya",
  [Tithi.shukla_chaturthi]: "Shukla Chaturthi",
  [Tithi.shukla_panchami]: "Shukla Panchami",
  [Tithi.shukla_shashthi]: "Shukla Sashti",
  [Tithi.shukla_saptami]: "Shukla Saptami",
  [Tithi.shukla_ashtami]: "Shukla Ashtami",
  [Tithi.shukla_navami]: "Shukla Navami",
  [Tithi.shukla_dashami]: "Shukla Dashami",
  [Tithi.shukla_ekadashi]: "Shukla Ekadashi",
  [Tithi.shukla_dwadashi]: "Shukla Dwadashi",
  [Tithi.shukla_trayodashi]: "Shukla Trayodashi",
  [Tithi.shukla_chaturdashi]: "Shukla Chaturdashi",
  [Tithi.purnima]: "Purnima",
  [Tithi.krishna_pratipada]: "Krishna Pratipada",
  [Tithi.krishna_dwitiya]: "Krishna Dwitiya",
  [Tithi.krishna_tritiya]: "Krishna Tritiya",
  [Tithi.krishna_chaturthi]: "Krishna Chaturthi",
  [Tithi.krishna_panchami]: "Krishna Panchami",
  [Tithi.krishna_shashthi]: "Krishna Sashti",
  [Tithi.krishna_saptami]: "Krishna Saptami",
  [Tithi.krishna_ashtami]: "Krishna Ashtami",
  [Tithi.krishna_navami]: "Krishna Navami",
  [Tithi.krishna_dashami]: "Krishna Dashami",
  [Tithi.krishna_ekadashi]: "Krishna Ekadashi",
  [Tithi.krishna_dwadashi]: "Krishna Dwadashi",
  [Tithi.krishna_trayodashi]: "Krishna Trayodashi",
  [Tithi.krishna_chaturdashi]: "Krishna Chaturdashi",
};

// Update getPanchangaForDate to use the mappings directly
export const getPanchangaForDate = async (timestamp: number): Promise<PanchangaData> => {
  // Get device location and timezone
  const place = await getCurrentPlace();

  // Convert timestamp to our Date format
  const date = new Date(timestamp);
  const ourDate = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };

  // Calculate Julian day
  const jd = gregorianToJd(ourDate);

  // Get tithi information
  const tithiResult = tithi(jd, place);
  const tithiNumber = tithiResult[0] as number;
  const endTime = tithiResult[1] as [number, number, number];

  // Determine paksha based on tithi number
  const paksha = tithiNumber >= 15 && tithiNumber < 30 ? "krishna" : "shukla";

  // Map tithi number to enum
  const tithiEnum = mapTithiNumberToEnum(tithiNumber);
  
  // Create tithi array with direct enum mapping
  const tithiArray = [
    {
      name: tithiNames[tithiEnum],
      number: tithiNumber,
      end_time: endTime,
      enum: tithiEnum,
    },
  ];

  // If there's a skipped tithi
  if (tithiResult.length > 2) {
    const leapTithiNumber = tithiResult[2] as number;
    const leapTithiEnum = mapTithiNumberToEnum(leapTithiNumber);
    const leapEndTime = tithiResult[3] as [number, number, number];
    tithiArray.push({
      name: tithiNames[leapTithiEnum],
      number: leapTithiNumber,
      end_time: leapEndTime,
      enum: leapTithiEnum,
    });
  }

  // Calculate vaara (weekday) as enum
  const vaaraNumber = vaara(jd);
  const vaaraEnum = vaaraNumber as Vaara;
  
  // Calculate masa (lunar month) as enum
  const [masaNumber, isLeapMasa] = masa(jd, place);
  const masaEnum = masaNumber as Masa;
  
  return {
    tithi: tithiArray,
    paksha,
    vaara: {
      name: vaaraNames[vaaraEnum],
      sub_text: `${new Date(timestamp).toLocaleDateString("en-US", { weekday: "long" })}`,
      enum: vaaraEnum
    },
    masa: {
      purnima: isLeapMasa ? `Adhika ${masaNames[masaEnum]}` : masaNames[masaEnum],
      enum: masaEnum,
      isLeap: isLeapMasa
    },
  };
};

// Helper function to get current location and timezone
const getCurrentPlace = async (): Promise<Place> => {
  // Default to Bangalore if location services are unavailable
  const defaultPlace: Place = {
    latitude: 12.972,
    longitude: 77.594,
    timezone: 5.5,
  };

  try {
    // In a real app, you would use React Native's Geolocation API
    // For now, we'll return the default
    return defaultPlace;

    /* 
    // This is how you would implement it with Geolocation:
    
    // Get timezone offset in hours
    const timezoneOffset = new Date().getTimezoneOffset() / -60;
    
    // Get location (requires permission)
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject);
    });
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timezone: timezoneOffset
    };
    */
  } catch (error) {
    console.warn("Could not get device location, using default", error);
    return defaultPlace;
  }
};
