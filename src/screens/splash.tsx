import { AppColor } from "@/theme/color";
import { useGetColor } from "@/theme/color";
import { View } from "../theme";
import { StyleSheet } from "react-native";
import { SplashLogo } from "@/theme/icon";
import { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { LocationApi } from "@/api/location";
import { StyleUtils } from "@/theme/style-utils";
import { useLocation } from "@/context/location";
import { UserApi } from "@/api/user";

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    backgroundColor: useGetColor(AppColor.background),
  },
});

type SplashProps = StackScreenProps<RootStackParamList, "splash">;

type SplashState = {
  hasLocationPermission: boolean;
  shouldAnimateLogo: boolean;
  hasSeenOnboarding: boolean;
};

export function Splash({ navigation }: SplashProps) {
  const { setLocation } = useLocation();
  const [{ hasLocationPermission, shouldAnimateLogo, hasSeenOnboarding }, setState] =
    useState<SplashState>({
      hasLocationPermission: false,
      shouldAnimateLogo: false,
      hasSeenOnboarding: false,
    });

  const onAnimationComplete = () => {
    if (shouldAnimateLogo) {
      if (hasSeenOnboarding) {
        if (hasLocationPermission) {
          navigation.replace("tabs", { screen: "home" });
        } else {
          navigation.replace("location_permission");
        }
      } else {
        navigation.replace("intro");
      }
    }
  };


  useEffect(() => {
    Promise.all([LocationApi.getLocationPermissionStatus(), UserApi.hasSeenOnboarding()]).then(([permission, hasSeenOnboarding]) => {
      if (permission.status === "granted") {
        LocationApi.readDeviceLocation().then((location) => {
          setLocation(location);
          setState({ hasLocationPermission: true, shouldAnimateLogo: true, hasSeenOnboarding });
        });
      } else {
        setState({ hasLocationPermission: false, shouldAnimateLogo: true, hasSeenOnboarding });
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
