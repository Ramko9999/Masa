import { ExtensionStorage } from "@bacons/apple-targets";
import { Panchanga, getFestivals } from "@/api/panchanga";
import { truncateToDay, addDays } from "@/util/date";
import { computePanchanga } from "@/api/panchanga";
import { Location, LocationApi } from "@/api/location";
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";

const STORE = new ExtensionStorage("group.com.anonymous.masa");
const PANCHANGA_DAYS_KEY = "panchanga_days";
const FESTIVALS_KEY = "festivals";

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

export type FestivalData = {
  name: string;
  date: number;
};

function panchangaToDayData(panchanga: Panchanga): PanchangaDayData {
  const currentTithi = panchanga.tithi[0];
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

export function computeFestivals(location: Location): FestivalData[] {
  const festivals = getFestivals(location);
  return festivals.map((festival) => ({
    name: festival.name,
    date: festival.date,
  }));
}

// Async chunked computation function
export async function computePanchangaDataChunked(
  startDay: number,
  location: Location,
  totalDays: number,
  chunkSize: number = 15
): Promise<PanchangaDayData[]> {
  const results: PanchangaDayData[] = [];

  for (let i = 0; i <= totalDays; i += chunkSize) {
    // Process chunk
    const endIndex = Math.min(i + chunkSize, totalDays + 1);
    for (let j = i; j < endIndex; j++) {
      const day = addDays(startDay, j);
      const panchanga = computePanchanga(day, location);
      const dayData = panchangaToDayData(panchanga);
      results.push(dayData);
    }

    // Yield control (except on last chunk)
    if (endIndex <= totalDays) {
      await new Promise((resolve) => Promise.resolve().then(resolve));
    }
  }

  return results;
}

// Main hydration function
export async function hydrateWidget(location: Location): Promise<void> {
  console.log("[WIDGET-API] Starting widget hydration...");
  try {
    const start = performance.now();
    const today = truncateToDay(Date.now());

    // Compute panchanga data in chunks
    const panchangaDays = await computePanchangaDataChunked(
      today,
      location,
      30,
      5
    );
    console.log(
      `[WIDGET-API] Computed ${panchangaDays.length} days in ${performance.now() - start}ms`
    );

    // Compute festivals (relatively fast, so no chunking needed)
    const festivalData = computeFestivals(location);

    const end = performance.now();
    console.log(
      `[WIDGET-API] Computation complete: ${end - start}ms`
    );

    // Store data and reload widget
    // @ts-ignore - ExtensionStorage handles objects directly (will stringify internally)
    STORE.set(PANCHANGA_DAYS_KEY, panchangaDays);
    // @ts-ignore - ExtensionStorage handles objects directly (will stringify internally)
    STORE.set(FESTIVALS_KEY, festivalData);
    ExtensionStorage.reloadWidget();
    console.log("[WIDGET-API] Widget hydration complete");
  } catch (error) {
    console.error("[WIDGET-API] Failed to hydrate widget:", error);
    throw error;
  }
}

export const WIDGET_HYDRATION_TASK_IDENTIFIER = "widget-hydration-task";

TaskManager.defineTask(
  WIDGET_HYDRATION_TASK_IDENTIFIER,
  async () => {
    try {
      console.log(
        `[WIDGET-API] Background task started at: ${new Date().toISOString()}`
      );

      // Read location from AsyncStorage
      const location = await LocationApi.getSavedLocation();
      if (!location) {
        console.log("[WIDGET-API] No location found, skipping widget hydration");
        return BackgroundTask.BackgroundTaskResult.Failed;
      }

      // Hydrate widget with location
      await hydrateWidget(location);
      console.log("[WIDGET-API] Background task completed successfully");
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
      console.error("[WIDGET-API] Failed to execute background task:", error);
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  }
);
