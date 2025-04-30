import * as Notifications from "expo-notifications";
import { AppColor, useThemedStyles, useGetColor } from "@/theme/color";
import { View } from "../theme";
import { ColorSchemeName, Platform, StyleSheet } from "react-native";
import { SplashLogo } from "@/theme/icon";
import { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { LocationApi } from "@/api/location";
import { StyleUtils } from "@/theme/style-utils";
import { useLocation } from "@/context/location";
import { UserApi } from "@/api/user";

const splashStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    backgroundColor: useGetColor(AppColor.background, theme),
  },
});

type SplashProps = StackScreenProps<RootStackParamList, "splash">;

type SplashState = {
  hasLocation: boolean;
  shouldAnimateLogo: boolean;
  hasSeenOnboarding: boolean;
  needsToAskForNotificationPermission: boolean;
};

export function Splash({ navigation }: SplashProps) {
  const splashStyles = useThemedStyles(splashStylesFactory);
  const { setLocation } = useLocation();
  const [
    { hasLocation, shouldAnimateLogo, hasSeenOnboarding, needsToAskForNotificationPermission },
    setState,
  ] = useState<SplashState>({
    hasLocation: false,
    needsToAskForNotificationPermission: false,
    shouldAnimateLogo: false,
    hasSeenOnboarding: false,
  });

  const onAnimationComplete = async () => {
    if (shouldAnimateLogo) {
      if (hasSeenOnboarding) {
        if (hasLocation) {
          if (needsToAskForNotificationPermission) {
            navigation.replace("notification_permission");
          } else {
            navigation.replace("tabs", { screen: "home" });
          }
        } else {
          navigation.replace("location_permission");
        }
      } else {
        navigation.replace("intro");
      }
    }
  };

  useEffect(() => {
    Promise.all([
      LocationApi.getSavedLocation(),
      UserApi.hasSeenOnboarding(),
      Notifications.getPermissionsAsync(),
    ]).then(([savedLocation, hasSeenOnboarding, notificationSettings]) => {
      const splashState = {
        shouldAnimateLogo: true,
        hasSeenOnboarding,
        needsToAskForNotificationPermission: notificationSettings.status === "undetermined" && Platform.OS === "ios",
        hasLocation: savedLocation !== undefined,
      }
      if (savedLocation) {
        setLocation(savedLocation);
      }
      setState(splashState);
    });
  }, []);

  return (
    <View style={splashStyles.container}>
      <SplashLogo
        shouldAnimate={shouldAnimateLogo}
        onAnimationComplete={onAnimationComplete}
      />
    </View>
  );
}
