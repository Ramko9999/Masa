import { getSolarLongitude, adjustForAyanamsa, toArcSeconds, getNewMoonOccurrence } from "../util";

const LAGNA_INTERVAL_ARC_SECONDS = toArcSeconds(30);

const MASA_NAMES = [
    "Chaitra",
    "Vaisakha",
    "Jyeshtha",
    "Ashadha",
    "Shravana",
    "Bhadrapada",
    "Ashwin",
    "Kartika",
    "Margashirsha",
    "Pausha",
    "Magha",
    "Phalguna"
];

export type Masa = {
    index: number;
    isLeap: boolean;
    name: string;
}

function getLagnaIndex(day: number): number {
    return Math.floor(adjustForAyanamsa(day, getSolarLongitude(day)) / LAGNA_INTERVAL_ARC_SECONDS) % 12;
}

function getMasaName(index: number, isLeap: boolean) {
    const name = MASA_NAMES[index];
    return isLeap ? `Adhika ${name}` : name;
}

export function compute(sunrise: number): Masa {
    const lastNewMoon = getNewMoonOccurrence(sunrise, true);
    const nextNewMoon = getNewMoonOccurrence(sunrise, false);

    const thisSolarMonth = getLagnaIndex(lastNewMoon);
    const nextSolarMonth = getLagnaIndex(nextNewMoon);

    const isLeap = thisSolarMonth === nextSolarMonth;

    const trueSolarMonth = (thisSolarMonth + 1) % 12;

    return {
        index: trueSolarMonth,
        name: getMasaName(trueSolarMonth, isLeap),
        isLeap: isLeap
    };
}