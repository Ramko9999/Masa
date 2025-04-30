import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import {
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  ColorSchemeName,
  useColorScheme,
} from "react-native";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { Bell } from "lucide-react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { NotificationApi } from "@/api/notification";
import { useState } from "react";

const NOTIFICATION_TITLE = "Festival Reminders";
const NOTIFICATION_SUBTEXT =
  "We use notifications to remind you when a festival begins. You can toggle them on or off anytime in the settings.";

const notificationPermissionStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    height: "100%",
    backgroundColor: useGetColor(AppColor.background, theme),
  },
  content: {
    ...StyleUtils.flexColumn(30),
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  actionButtonContainer: {
    marginTop: "auto",
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: useGetColor(AppColor.primary, theme),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
    ...StyleUtils.flexRow(5),
    alignItems: "center",
  },
});

type NotificationPermissionProps = StackScreenProps<
  RootStackParamList,
  "notification_permission"
>;

export function NotificationPermission({
  navigation,
}: NotificationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const notificationPermissionStyles = useThemedStyles(
    notificationPermissionStylesFactory
  );
  const theme = useColorScheme();
  const handleNotificationPermission = async () => {
    setIsLoading(true);
    await NotificationApi.getNotificationPermissionStatus();
    setIsLoading(false);
    navigation.replace("tabs", { screen: "home" });
  };

  return (
    <View style={notificationPermissionStyles.container}>
      <View
        style={[
          notificationPermissionStyles.content,
          { paddingTop: insets.top + height * 0.06 },
        ]}
      >
        <Text huge bold primary>
          {NOTIFICATION_TITLE}
        </Text>
        <Text big primary>
          {NOTIFICATION_SUBTEXT}
        </Text>

        <View
          style={[
            notificationPermissionStyles.actionButtonContainer,
            { marginBottom: insets.bottom },
          ]}
        >
          <TouchableOpacity
            style={notificationPermissionStyles.actionButton}
            onPress={handleNotificationPermission}
          >
            <Bell
              stroke={useGetColor(AppColor.background, theme)}
              fill={useGetColor(AppColor.background, theme)}
              width={20}
              height={20}
            />
            <Text large semibold background>
              Enable Festival Reminders
            </Text>
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color={useGetColor(AppColor.primary, theme)}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
