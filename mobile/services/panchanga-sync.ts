import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { computePanchanga } from "@/api/panchanga";
import { Location } from "@/api/location";
import { truncateToDay, getDatesBetween } from "@/util/date";
import { setPanchangaDays } from "@/store/widget";

// Task identifier
export const PANCHANGA_SYNC_TASK = "panchanga-sync-task";

// Define the background task
// This needs to be called in the global scope (outside React components)
TaskManager.defineTask(PANCHANGA_SYNC_TASK, async () => {
  try {
    console.log(
      `[PanchangaSync] Background task started at: ${new Date().toISOString()}`
    );

    const AsyncStorage = require("@react-native-async-storage/async-storage").default;

    // TEST: Long running computation to verify background execution
    const totalIterations = 1000000000; // 1 billion iterations
    const logInterval = 1000000; // Log every 1 million
    let logs: string[] = [];
    
    logs.push(`Started at: ${new Date().toISOString()}`);
    await AsyncStorage.setItem("bg_task_debug", JSON.stringify(logs));

    for (let i = 0; i < totalIterations; i++) {
      // Do some computation
      Math.sqrt(i);
      
      if (i > 0 && i % logInterval === 0) {
        const progress = ((i / totalIterations) * 100).toFixed(2);
        const logMessage = `Progress: ${i.toLocaleString()} / ${totalIterations.toLocaleString()} (${progress}%) at ${new Date().toISOString()}`;
        console.log(`[PanchangaSync] ${logMessage}`);
        logs.push(logMessage);
        await AsyncStorage.setItem("bg_task_debug", JSON.stringify(logs));
      }
    }

    logs.push(`Completed at: ${new Date().toISOString()}`);
    await AsyncStorage.setItem("bg_task_debug", JSON.stringify(logs));

    console.log("[PanchangaSync] Background task completed successfully");
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("[PanchangaSync] Failed to run background task:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Register the background task
export async function registerPanchangaSyncTask(
  location?: Location
): Promise<void> {
  try {
    // Check if background tasks are available
    const status = await BackgroundTask.getStatusAsync();

    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.log(
        "[PanchangaSync] Background tasks are restricted on this device"
      );
      return;
    }

    // Check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      PANCHANGA_SYNC_TASK
    );

    if (isRegistered) {
      // Unregister first to update the location
      await unregisterPanchangaSyncTask();
    }

    // Register the task with location data
    // Note: We can't directly pass location in options, so we'll use a different approach
    // We'll store location in AsyncStorage and read it in the task
    if (location) {
      const AsyncStorage = require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.setItem(
        "panchanga_sync_location",
        JSON.stringify(location)
      );
    }

    await BackgroundTask.registerTaskAsync(PANCHANGA_SYNC_TASK, {
      minimumInterval: 60 * 24, // Once per day (in minutes)
    });

    console.log("[PanchangaSync] Background task registered successfully");
  } catch (error) {
    console.error("[PanchangaSync] Failed to register background task:", error);
  }
}

// Unregister the background task
export async function unregisterPanchangaSyncTask(): Promise<void> {
  try {
    await BackgroundTask.unregisterTaskAsync(PANCHANGA_SYNC_TASK);
    console.log("[PanchangaSync] Background task unregistered successfully");
  } catch (error) {
    console.error(
      "[PanchangaSync] Failed to unregister background task:",
      error
    );
  }
}

// Trigger the background task immediately (for testing/initial sync)
export async function triggerPanchangaSyncNow(): Promise<void> {
  try {
    if (__DEV__) {
      await BackgroundTask.triggerTaskWorkerForTestingAsync();
      console.log("[PanchangaSync] Background task triggered for testing");
    } else {
      console.log(
        "[PanchangaSync] Manual trigger only works in development mode"
      );
    }
  } catch (error) {
    console.error("[PanchangaSync] Failed to trigger background task:", error);
  }
}

// Check if the background task is registered
export async function isPanchangaSyncRegistered(): Promise<boolean> {
  return await TaskManager.isTaskRegisteredAsync(PANCHANGA_SYNC_TASK);
}

