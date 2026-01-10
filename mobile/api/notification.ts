import { getFestivals } from "@/api/panchanga";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Location } from "@/api/location";
import i18n from "@/i18n";
import { FestivalInfo } from "@/api/panchanga/core/festival";
import { Platform } from "react-native";

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

// todo: investigate why notfications aren't always scheduled
async function scheduleFestivalNotifications(location: Location) {
  const festivals = getFestivals(location);

  await Notifications.cancelAllScheduledNotificationsAsync();

  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted" && Platform.OS === "ios") {
    return;
  }

  for (const festival of festivals) {
    const notificationDate = new Date(festival.date);

    if (notificationDate < new Date()) {
      continue;
    }
    // Get festival info from translations
    const festivalInfo = i18n.t(`festivals.${festival.name}`, {
      returnObjects: true,
    }) as FestivalInfo;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: festivalInfo.title,
        body: festivalInfo.caption,
        data: { festivalName: festival.name },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
        channelId: "default",
      },
    });
    console.log(
      `[NOTIFICATION] Scheduled notification ${notificationId} for festival ${festival.name} at ${notificationDate}`
    );
  }
}

export const NotificationApi = {
  getNotificationPermissionStatus,
  scheduleFestivalNotifications,
};
