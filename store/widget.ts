import { ExtensionStorage } from "@bacons/apple-targets"
import { Panchanga } from "@/api/panchanga";
import { truncateToDay } from "@/util/date";

const store = new ExtensionStorage("group.com.anonymous.masa");

// Types for widget data
export type PanchangaDayData = {
  day: number;
  tithi: {
    index: number;
    name: string;
  };
  nakshatra: {
    index: number;
    name: string;
  };
  masa: {
    amanta: {
      index: number;
      name: string;
      isLeap: boolean;
    };
    purnimanta: {
      index: number;
      name: string;
      isLeap: boolean;
    };
  };
  vaara: {
    index: number;
    name: string;
  };
};

// Convert Panchanga to PanchangaDayData
function panchangaToDayData(panchanga: Panchanga): PanchangaDayData {
  // Get the current tithi (first one that's active)
  const currentTithi = panchanga.tithi[0];
  
  // Get the current nakshatra (first one that's active)
  const currentNakshatra = panchanga.nakshatra[0];
  
  return {
    day: panchanga.day,
    tithi: {
      index: currentTithi.index,
      name: currentTithi.name,
    },
    nakshatra: {
      index: currentNakshatra.index,
      name: currentNakshatra.name,
    },
    masa: {
      amanta: {
        index: panchanga.masa.amanta.index,
        name: panchanga.masa.amanta.name,
        isLeap: panchanga.masa.amanta.isLeap,
      },
      purnimanta: {
        index: panchanga.masa.purnimanta.index,
        name: panchanga.masa.purnimanta.name,
        isLeap: panchanga.masa.purnimanta.isLeap,
      },
    },
    vaara: {
      index: panchanga.vaara.index,
      name: panchanga.vaara.name,
    },
  };
}

// Store panchanga data for a single day
export async function setPanchangaDay(panchanga: Panchanga): Promise<void> {
  const dayData = panchangaToDayData(panchanga);
  const dayKey = String(truncateToDay(panchanga.day));
  
  const existingDataRaw = await store.get("panchanga_data");
  // ExtensionStorage returns a JSON string, so we need to parse it
  const existingData: Record<string, PanchangaDayData> = existingDataRaw 
    ? (typeof existingDataRaw === 'string' ? JSON.parse(existingDataRaw) : existingDataRaw)
    : {};
  existingData[dayKey] = dayData;
  
  // @ts-ignore - ExtensionStorage handles objects directly (will stringify internally)
  await store.set("panchanga_data", existingData);
  
  // Reload the widget to show the new data
  await ExtensionStorage.reloadWidget();
}

// Store panchanga data for multiple days (for syncing the entire year)
export async function setPanchangaDays(panchangas: Panchanga[]): Promise<void> {
  const dayDataMap: Record<string, PanchangaDayData> = {};
  
  for (const panchanga of panchangas) {
    const dayData = panchangaToDayData(panchanga);
    const dayKey = String(truncateToDay(panchanga.day));
    dayDataMap[dayKey] = dayData;
  }
  
  const existingDataRaw = await store.get("panchanga_data");
  // ExtensionStorage returns a JSON string, so we need to parse it
  const existingData: Record<string, PanchangaDayData> = existingDataRaw 
    ? (typeof existingDataRaw === 'string' ? JSON.parse(existingDataRaw) : existingDataRaw)
    : {};
  // Merge new data with existing data
  Object.assign(existingData, dayDataMap);
  
  // @ts-ignore - ExtensionStorage handles objects directly (will stringify internally)
  await store.set("panchanga_data", existingData);
  
  // Reload the widget to show the new data
  await ExtensionStorage.reloadWidget();
}

// Get panchanga data for a specific day
export async function getPanchangaDay(day: number): Promise<PanchangaDayData | null> {
  const dayKey = String(truncateToDay(day));
  const dataRaw = await store.get("panchanga_data");
  if (!dataRaw) return null;
  
  // ExtensionStorage returns a JSON string, so we need to parse it
  const data: Record<string, PanchangaDayData> = typeof dataRaw === 'string' 
    ? JSON.parse(dataRaw) 
    : dataRaw;
  
  return data[dayKey] || null;
}

// Get all panchanga data
export async function getAllPanchangaData(): Promise<Record<string, PanchangaDayData> | null> {
  const dataRaw = await store.get("panchanga_data");
  if (!dataRaw) return null;
  
  // ExtensionStorage returns a JSON string, so we need to parse it
  return typeof dataRaw === 'string' ? JSON.parse(dataRaw) : dataRaw;
}

// Clear all panchanga data
export async function clearPanchangaData(): Promise<void> {
  await store.remove("panchanga_data");
}

export default store;

