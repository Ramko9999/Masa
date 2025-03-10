import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions for notifications
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

// Schedule a local notification
export async function scheduleNotification({
  title,
  body,
  data = {},
  trigger,
}: {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger: Notifications.NotificationTriggerInput;
}) {
  // Ensure we have permissions first
  const hasPermission = await requestNotificationsPermissions();
  if (!hasPermission) return null;

  // Schedule the notification
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger,
  });

  return notificationId;
}

// Schedule a notification for a specific date
export async function scheduleEventNotification({
  title,
  body,
  date,
  data = {},
  reminderHours = 24,
}: {
  title: string;
  body: string;
  date: Date;
  data?: Record<string, any>;
  reminderHours?: number;
}) {
  // Calculate the notification time
  const notificationDate = new Date(date);
  notificationDate.setHours(notificationDate.getHours() - reminderHours);

  // Don't schedule if the date is in the past
  if (notificationDate <= new Date()) {
    return null;
  }

  return scheduleNotification({
    title,
    body,
    data,
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
    },
  });
}

// Cancel a specific notification
export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Set up notification listeners
export function setupNotificationListeners() {
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    async (notification) => {
      console.log('Received notification in foreground:', notification);
    }
  );

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      console.log('User interacted with notification:', response);
    }
  );

  return {
    foregroundSubscription,
    responseSubscription,
  };
}

// Helper function to send an immediate test notification
export async function sendTestNotification() {
  const hasPermission = await requestNotificationsPermissions();
  if (!hasPermission) {
    console.log('No notification permissions!');
    return null;
  }

  // Schedule notification for 1 minute from now
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Scheduled Test Notification",
      body: "This notification was scheduled for 1 minute after button press!",
      data: { test: true },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 20,
      repeats: false
    },
  });

  return notificationId;
}
