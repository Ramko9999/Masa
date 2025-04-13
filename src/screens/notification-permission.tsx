import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import {
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { Bell } from "lucide-react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { NotificationApi } from "@/api/notification";
import { useState } from "react";
import { useLocation } from "@/context/location";

const NOTIFICATION_TITLE = "Festival Reminders";
const NOTIFICATION_SUBTEXT =
  "We'll send you a notification on the day of each festival.";

const notificationPermissionStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: useGetColor(AppColor.background),
  },
  content: {
    ...StyleUtils.flexColumn(30),
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  actionButtonContainer: {
    marginTop: "auto",
    marginBottom: "10%",
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: useGetColor(AppColor.primary),
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

        <View style={notificationPermissionStyles.actionButtonContainer}>
          <TouchableOpacity
            style={notificationPermissionStyles.actionButton}
            onPress={handleNotificationPermission}
          >
            <Bell
              stroke={useGetColor(AppColor.background)}
              fill={useGetColor(AppColor.background)}
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
              color={useGetColor(AppColor.primary)}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
