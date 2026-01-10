import React, { useCallback, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type NotificationProviderProps = {
  children: React.ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const setup = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") {
      // Set up notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: false,
          shouldShowList: false,
        }),
      });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
      console.log("[NOTIFICATION] setup");
    }
  }, []);

  useEffect(() => {
    setup();
  }, [setup]);

  return <>{children}</>;
}
