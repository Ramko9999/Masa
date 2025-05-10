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
import { LANGUAGE_OPTIONS } from "@/components/settings/language";

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
  const { locationSettingSheet, languageSettingSheet } = useSettingsSheet();
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasEnabledNotifications, setHasEnabledNotifications] = useState(false);

  const showNotificationSettingsAlert = (isEnabled: boolean) => {
    Alert.alert(
      isEnabled
        ? t("settings.settings_items.notifications.enabled.alert")
        : t("settings.settings_items.notifications.disabled.alert"),
      isEnabled
        ? t("settings.settings_items.notifications.enabled.settings_alert")
        : t("settings.settings_items.notifications.disabled.settings_alert"),
      [
        {
          text: t("settings.not_now"),
          style: "cancel",
        },
        {
          text: t("settings.open_settings"),
          onPress: Linking.openSettings,
        },
      ]
    );
  };

  const handleNotificationClick = useCallback(() => {
    if (isLoading) {
      return;
    }
    showNotificationSettingsAlert(hasEnabledNotifications);
  }, [hasEnabledNotifications, isLoading]);

  useFocusEffect(
    useCallback(() => {
      Notifications.getPermissionsAsync()
        .then(({ granted }) => {
          setHasEnabledNotifications(granted);
        })
        .finally(() => setIsLoading(false));
    }, [])
  );

  const notificationStatus = isLoading
    ? t("settings.settings_items.notifications.checking")
    : hasEnabledNotifications
    ? t("settings.settings_items.notifications.enabled.title")
    : t("settings.settings_items.notifications.disabled.title");

  return (
    <View style={[settingsStyles.container, { paddingTop: insets.top + 20 }]}>
      <View style={settingsStyles.title}>
        <Text huge bold primary>
          {t("tabs.settings")}
        </Text>
      </View>
      <SettingItem
        title={t("settings.settings_items.location.title")}
        value={location!.place}
        onClick={() => locationSettingSheet.open()}
      />
      <SettingItem
        title={t("settings.settings_items.language.title")}
        value={LANGUAGE_OPTIONS[i18n.language as keyof typeof LANGUAGE_OPTIONS]}
        onClick={() => languageSettingSheet.open()}
      />
      {Platform.OS === "ios" && (
        <SettingItem
          title={t("settings.settings_items.notifications.title")}
          value={notificationStatus}
          onClick={handleNotificationClick}
        />
      )}
    </View>
  );
}
