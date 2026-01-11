import { useEffect } from "react";
import { useLocation } from "@/context/location";
import { hydrateWidget, WIDGET_HYDRATION_TASK_IDENTIFIER } from "@/api/widget";
import { useDebounce } from "@/hooks/use-debounce";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

export function useWidgetUpdater() {
  const { location } = useLocation();

  const debouncedHydrateWidget = useDebounce(hydrateWidget, 500);

  useEffect(() => {
    if (!location) return;
    debouncedHydrateWidget(location);
  }, [location, debouncedHydrateWidget]);
}

export function useRegisterWidgetBackgroundTask() {
  useEffect(() => {
    const registerBackgroundTask = async () => {
      try {
        // Check if background tasks are available
        const status = await BackgroundTask.getStatusAsync();
        if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
          console.log(
            "[USE-REGISTER-WIDGET-BACKGROUND-TASK] Background tasks not available, status:",
            status
          );
          return;
        }

        // Check if the task is already registered
        const isRegistered = await TaskManager.isTaskRegisteredAsync(
          WIDGET_HYDRATION_TASK_IDENTIFIER
        );

        if (isRegistered) {
          console.log(
            "[USE-REGISTER-WIDGET-BACKGROUND-TASK] Background task already registered"
          );
          return;
        }

        // Register the background task with daily interval (1440 minutes = 24 hours)
        await BackgroundTask.registerTaskAsync(
          WIDGET_HYDRATION_TASK_IDENTIFIER,
          {
            minimumInterval: 1440, // 24 hours in minutes
          }
        );

        console.log(
          "[USE-REGISTER-WIDGET-BACKGROUND-TASK] Background task registered successfully"
        );
      } catch (error) {
        console.error(
          "[USE-REGISTER-WIDGET-BACKGROUND-TASK] Failed to register background task:",
          error
        );
      }
    };

    registerBackgroundTask();
  }, []);
}
