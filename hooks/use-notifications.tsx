import { useEffect } from "react";
import { useLocation } from "@/context/location";
import { NotificationApi } from "@/api/notification";
import { Location } from "@/api/location";

let scheduleNotificationsTimer: NodeJS.Timeout;

async function debouncedScheduleNotifications(location: Location) {
  if (scheduleNotificationsTimer) {
    clearTimeout(scheduleNotificationsTimer);
  }

  scheduleNotificationsTimer = setTimeout(async () => {
    await NotificationApi.scheduleFestivalNotifications(location);
  }, 500);
}

export function useNotifications() {
  const { location } = useLocation();

  useEffect(() => {
    if (location) {
      debouncedScheduleNotifications(location);
    }

    return () => {
      if (scheduleNotificationsTimer) {
        clearTimeout(scheduleNotificationsTimer);
      }
    };

  }, [location]);
}
