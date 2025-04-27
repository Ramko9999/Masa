import { getFestivals } from "@/api/panchanga";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { truncateToDay } from "@/util/date";
import { Location } from "@/api/location";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function getNotificationPermissionStatus() {
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

async function scheduleFestivalNotifications(location: Location) {
  const festivals = getFestivals(location);

  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted" && Platform.OS === "ios") {
    return;
  }

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
  }
}

export const NotificationApi = {
  getNotificationPermissionStatus,
  scheduleFestivalNotifications,
};
