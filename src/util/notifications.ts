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
  const festivals = getUpcomingFestivals(truncateToDay(Date.now()), location);

  // Cancel all existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const [index, festival] of festivals.entries()) {
    const notificationDate = new Date(festival.date);

    const notification = await Notifications.scheduleNotificationAsync({
      content: {
        title: festival.name,
        body: festival.caption,
        data: {
          festivalName: festival.name,
          festivalId: `festival-${index}`,
        },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
      identifier: `festival-notification-${index}`,
    });

    console.log(
      `Scheduled notification for ${
        festival.name
      } at ${notificationDate.toLocaleString()}:`,
      notification
    );
  }
}
