const VAARA_NAMES = [
    "Ravivaara",    // Sunday
    "Somavaara",    // Monday
    "Mangalavaara", // Tuesday
    "Budhavaara",   // Wednesday
    "Guruvaara",    // Thursday
    "Shukravaara",  // Friday
    "Shanivaara"    // Saturday
];


export function compute(day: number): string {
    const dayIndex = new Date(day).getDay();
    return VAARA_NAMES[dayIndex];
}