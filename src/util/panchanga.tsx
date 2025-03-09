import { truncateToDay } from "./date";
import { Tithi } from "../components/moon-phase";
import { Platform } from "react-native";

// Type definitions for panchanga data
export type TithiData = {
  name: string;
  key: string;
  end_time: number;
  start_time: number;
};

export type VaaraData = {
  name: string;
  key: string;
  sub_text: string;
};

export type MasaData = {
  amanta: string;
  purnima: string;
};

export type PanchangaData = {
  tithi: TithiData[];
  vaara: VaaraData;
  masa: MasaData;
  paksha: string;
  // Add other fields as needed
};

export type PanchangaDataset = {
  metadata: {
    year: number;
    latitude: number;
    longitude: number;
    generated_at: number;
    last_updated: number;
  };
  daily_data: {
    [timestamp: string]: PanchangaData;
  };
};

// Cache the loaded data
let panchangaDataCache: PanchangaDataset | null = null;

/**
 * Load the panchanga data from the JSON file
 * @returns Promise that resolves to the panchanga dataset
 */
export async function loadPanchangaData(): Promise<PanchangaDataset> {
  if (panchangaDataCache) {
    return panchangaDataCache;
  }

  try {
    // For web or testing environments, use a direct import
    if (Platform.OS === 'web') {
      // This is a fallback for web environments
      const data = require('../assets/panchanga_2025.json');
      panchangaDataCache = data as PanchangaDataset;
      return panchangaDataCache;
    }
    
    // For native platforms, use the file system
    // This approach works better on native platforms
    const jsonModule = require('../assets/panchanga_2025.json');
    panchangaDataCache = jsonModule as PanchangaDataset;
    
    console.log("Panchanga data loaded successfully with keys:", 
      Object.keys(panchangaDataCache?.daily_data || {}).length);
    
    return panchangaDataCache;
  } catch (error) {
    console.error("Failed to load panchanga data:", error);
    throw new Error("Failed to load panchanga data");
  }
}

/**
 * Convert a date to midnight UTC timestamp
 * @param date Date to convert
 * @returns Unix timestamp for midnight UTC on the given date
 */
export function dateToMidnightUTC(date: Date): number {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0, 0
  ));
  return Math.floor(utcDate.getTime() / 1000);
}

/**
 * Find the closest timestamp in the panchanga data for a given date
 * @param dataset Panchanga dataset
 * @param timestamp Unix timestamp (milliseconds) for the date to find
 * @returns The closest timestamp key in the dataset
 */
export function findClosestTimestamp(dataset: PanchangaDataset, timestamp: number): string | null {
  // Convert milliseconds to seconds for comparison with dataset keys
  const targetTimestamp = Math.floor(timestamp / 1000);
  
  // Convert to midnight UTC for the given date
  const date = new Date(timestamp);
  const midnightUTC = dateToMidnightUTC(date);
  
  // First try exact match with midnight UTC
  const midnightKey = midnightUTC.toString();
  if (dataset.daily_data[midnightKey]) {
    return midnightKey;
  }
  
  // If no exact match, find the closest timestamp
  const timestamps = Object.keys(dataset.daily_data).map(Number);
  if (timestamps.length === 0) {
    return null;
  }
  
  // Sort timestamps and find the closest one
  timestamps.sort((a, b) => a - b);
  
  // Find the closest timestamp that is less than or equal to the target
  let closestTimestamp = timestamps[0];
  for (const ts of timestamps) {
    if (ts <= targetTimestamp && ts > closestTimestamp) {
      closestTimestamp = ts;
    }
  }
  
  return closestTimestamp.toString();
}

/**
 * Get panchanga data for a specific date
 * @param timestamp Unix timestamp (milliseconds) for the date to get data for
 * @returns Promise that resolves to the panchanga data for the given date
 */
export async function getPanchangaForDate(timestamp: number): Promise<PanchangaData | null> {
  try {
    const dataset = await loadPanchangaData();
    const closestTimestamp = findClosestTimestamp(dataset, timestamp);
    
    if (!closestTimestamp) {
      console.warn("No panchanga data found for timestamp:", timestamp);
      return null;
    }
    
    return dataset.daily_data[closestTimestamp];
  } catch (error) {
    console.error("Failed to get panchanga data for date:", error);
    return null;
  }
}

/**
 * Format the tithi change time in a user-friendly way
 * @param currentTithi Current tithi data
 * @param nextTithi Next tithi data (if available)
 * @returns Formatted string showing when the tithi changes
 */
export function formatTithiChangeTime(currentTithi: TithiData, nextTithi?: TithiData): string {
  if (!nextTithi) {
    return "";
  }
  
  // Convert end_time (seconds) to milliseconds for Date
  const endTime = new Date(currentTithi.end_time * 1000);
  
  // Format the time in 12-hour format with AM/PM
  const hours = endTime.getHours();
  const minutes = endTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `Changes to ${nextTithi.name} at ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Map tithi name to the appropriate Tithi enum value based on the paksha
 * @param tithiName Name of the tithi
 * @param paksha Paksha (lunar phase) - "Shukla Paksha" or "Krishna Paksha"
 * @returns The appropriate Tithi enum value
 */
export function mapTithiToEnum(tithiName: string, paksha: string): Tithi {
  const isShukla = paksha.toLowerCase().includes("shukla");
  
  // Map of tithi names to their respective enum values
  const tithiMap: Record<string, Record<string, Tithi>> = {
    shukla: {
      "Pratipada": Tithi.shukla_pratipada,
      "Dwitiya": Tithi.shukla_dwitiya,
      "Tritiya": Tithi.shukla_tritiya,
      "Chaturthi": Tithi.shukla_chaturthi,
      "Panchami": Tithi.shukla_panchami,
      "Shashthi": Tithi.shukla_shashthi,
      "Saptami": Tithi.shukla_saptami,
      "Ashtami": Tithi.shukla_ashtami,
      "Navami": Tithi.shukla_navami,
      "Dashami": Tithi.shukla_dashami,
      "Ekadashi": Tithi.shukla_ekadashi,
      "Dwadashi": Tithi.shukla_dwadashi,
      "Trayodashi": Tithi.shukla_trayodashi,
      "Chaturdashi": Tithi.shukla_chaturdashi,
      "Purnima": Tithi.purnima,
    },
    krishna: {
      "Pratipada": Tithi.krishna_pratipada,
      "Dwitiya": Tithi.krishna_dwitiya,
      "Tritiya": Tithi.krishna_tritiya,
      "Chaturthi": Tithi.krishna_chaturthi,
      "Panchami": Tithi.krishna_panchami,
      "Shashthi": Tithi.krishna_shashthi,
      "Saptami": Tithi.krishna_saptami,
      "Ashtami": Tithi.krishna_ashtami,
      "Navami": Tithi.krishna_navami,
      "Dashami": Tithi.krishna_dashami,
      "Ekadashi": Tithi.krishna_ekadashi,
      "Dwadashi": Tithi.krishna_dwadashi,
      "Trayodashi": Tithi.krishna_trayodashi,
      "Chaturdashi": Tithi.krishna_chaturdashi,
      "Amavasya": Tithi.amavasya,
    }
  };
  
  // Special cases for Purnima and Amavasya
  if (tithiName === "Purnima") {
    return Tithi.purnima;
  }
  
  if (tithiName === "Amavasya") {
    return Tithi.amavasya;
  }
  
  // Get the appropriate map based on the paksha
  const pakshaMap = isShukla ? tithiMap.shukla : tithiMap.krishna;
  
  // Return the enum value or default to purnima if not found
  return pakshaMap[tithiName] || Tithi.purnima;
} 