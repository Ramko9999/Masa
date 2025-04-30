import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import {
  StyleSheet,
  ColorSchemeName,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { useLocation } from "@/context/location";
import { useGetColor, useThemedStyles } from "@/theme/color";
import { AppColor } from "@/theme/color";
import * as Notifications from "expo-notifications";
import { useCallback, useState } from "react";
import { useSettingsSheet } from "@/components/settings";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const settingsStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
    backgroundColor: useGetColor(AppColor.background, theme),
  },
  settingContent: {
    ...StyleUtils.flexRow(5),
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: "5%",
    borderColor: useGetColor(AppColor.border, theme),
    borderTopWidth: 1,
  },
  title: {
    paddingBottom: "2%",
  },
});

type SettingItemProps = {
  title: string;
  value: string;
  onClick?: () => void;
};

function SettingItem({ title, value, onClick }: SettingItemProps) {
  const settingsStyles = useThemedStyles(settingsStylesFactory);

  return (
    <TouchableOpacity style={settingsStyles.settingContent} onPress={onClick}>
      <Text large semibold>
        {title}
      </Text>
      <Text large tint semibold>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

export function Settings() {
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const settingsStyles = useThemedStyles(settingsStylesFactory);
  const { locationSettingSheet } = useSettingsSheet();
  const { t } = useTranslation();
  const [notificationStatus, setNotificationStatus] =
    useState<string>("Checking...");

  const showNotificationSettingsAlert = (isEnabled: boolean) => {
    Alert.alert(
      isEnabled
        ? t("settings.setting_items.notifications.disable_notifications")
        : t("settings.setting_items.notifications.enable_notifications"),
      isEnabled
        ? t("settings.setting_items.notifications.disable_notifications_alert")
        : t("settings.setting_items.notifications.enable_notifications_alert"),
      [
        {
          text: t("settings.setting_items.notifications.not_now_alert"),
          style: "cancel",
        },
        {
          text: t("settings.setting_items.notifications.open_settings_alert"),
          onPress: Linking.openSettings,
        },
      ]
    );
  };

  const handleNotificationClick = useCallback(() => {
    if (
      notificationStatus === t("settings.setting_items.notifications.checking")
    ) {
      return;
    }
    const isEnabled =
      notificationStatus === t("settings.setting_items.notifications.enabled");
    showNotificationSettingsAlert(isEnabled);
  }, [notificationStatus]);

  useFocusEffect(
    useCallback(() => {
      const checkNotificationStatus = async () => {
        const settings = await Notifications.getPermissionsAsync();
        setNotificationStatus(
          settings.granted
            ? t("settings.setting_items.notifications.enabled")
            : t("settings.setting_items.notifications.disabled")
        );
      };
      checkNotificationStatus();
    }, [])
  );

  return (
    <View style={[settingsStyles.container, { paddingTop: insets.top + 20 }]}>
      <View style={settingsStyles.title}>
        <Text huge bold primary>
          {t("tabs.settings")}
        </Text>
      </View>
      <SettingItem
        title={t("settings.setting_items.location.title")}
        value={location!.place}
        onClick={() => locationSettingSheet.open()}
      />
      {Platform.OS === "ios" && (
        <SettingItem
          title={t("settings.setting_items.notifications.title")}
          value={notificationStatus}
          onClick={handleNotificationClick}
        />
      )}
    </View>
  );
}
