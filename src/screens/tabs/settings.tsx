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
  }
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
  const [notificationStatus, setNotificationStatus] = useState<string>("Checking...");

  const showNotificationSettingsAlert = (isEnabled: boolean) => {
    Alert.alert(
      isEnabled ? "Disable Notifications" : "Enable Notifications",
      isEnabled
        ? "Please disable notifications by turning them off in the settings."
        : "Please enable notifications by turning them on in the settings.",
      [
        { text: "Not Now", style: "cancel" },
        { text: "Open Settings", onPress: Linking.openSettings },
      ]
    );
  };

  const handleNotificationClick = useCallback(() => {
    if (notificationStatus === "Checking...") {
      return;
    }
    const isEnabled = notificationStatus === "Enabled";
    showNotificationSettingsAlert(isEnabled);
  }, [notificationStatus]);

  useFocusEffect(
    useCallback(() => {
      const checkNotificationStatus = async () => {
        const settings = await Notifications.getPermissionsAsync();
        setNotificationStatus(settings.granted ? "Enabled" : "Disabled");
      };
      checkNotificationStatus();
    }, [])
  );

  return (
    <View style={[settingsStyles.container, { paddingTop: insets.top + 20 }]}>
      <View style={settingsStyles.title}>
        <Text huge bold primary>
          Settings
        </Text>
      </View>
      <SettingItem
        title="Location"
        value={location!.place}
        onClick={() => locationSettingSheet.open()}
      />
      {Platform.OS === "ios" && (
        <SettingItem
          title="Notifications"
          value={notificationStatus}
          onClick={handleNotificationClick}
        />
      )}
    </View>
  );
} 