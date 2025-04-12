import { getUpcomingFestivals } from "@/api/panchanga";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { truncateToDay } from "@/util/date";
import { Location } from "@/api/location";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationsPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  return true;
}

export async function scheduleFestivalNotifications(location: Location) {
  try {
    const festivals = getUpcomingFestivals(truncateToDay(Date.now()), location);

    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const festival of festivals) {
      const notificationDate = new Date(festival.date);

      if (notificationDate < new Date()) {
        continue;
      }

      const notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: festival.name,
          body: festival.caption,
          data: { festivalName: festival.name },
          sound: true,
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: notificationDate,
        },
      });
      console.log("Scheduled notification:", notification);
    }
  } catch (error) {
    console.error("Error scheduling festival notifications:", error);
    throw error;
  }
}