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
  hasLocationPermission: boolean;
  shouldAnimateLogo: boolean;
  hasSeenOnboarding: boolean;
};

export function Splash({ navigation }: SplashProps) {
  const splashStyles = useThemedStyles(splashStylesFactory);
  const { setLocation } = useLocation();
  const [
    { hasLocationPermission, shouldAnimateLogo, hasSeenOnboarding },
    setState,
  ] = useState<SplashState>({
    hasLocationPermission: false,
    shouldAnimateLogo: false,
    hasSeenOnboarding: false,
  });

  const onAnimationComplete = async () => {
    if (shouldAnimateLogo) {
      if (hasSeenOnboarding) {
        if (hasLocationPermission) {
          const notificationSettings =
            await Notifications.getPermissionsAsync();
          if (
            notificationSettings.status === "undetermined" &&
            Platform.OS === "ios"
          ) {
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
      LocationApi.getLocationPermissionStatus(),
      UserApi.hasSeenOnboarding(),
    ]).then(([permission, hasSeenOnboarding]) => {
      if (permission.status === "granted") {
        LocationApi.readDeviceLocation().then((location) => {
          setLocation(location);
          setState({
            hasLocationPermission: true,
            shouldAnimateLogo: true,
            hasSeenOnboarding,
          });
        });
      } else {
        setState({
          hasLocationPermission: false,
          shouldAnimateLogo: true,
          hasSeenOnboarding,
        });
      }
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
