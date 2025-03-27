
import { AppColor } from "@/theme/color";
import { useGetColor } from "@/theme/color";
import { View } from "../theme";
import { StyleSheet } from "react-native";
import { SplashLogo } from "@/theme/icon";
import { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { getLocationPermissionStatus, readDeviceLocation } from "@/api/location";
import { StyleUtils } from "@/theme/style-utils";
import { useLocation } from "@/context/location";

const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleUtils.flexRowCenterAll(),
        backgroundColor: useGetColor(AppColor.background)
    }
})

type SplashProps = StackScreenProps<RootStackParamList, "splash">

type SplashState = {
    hasLocationPermission: boolean;
    shouldAnimateLogo: boolean;
}

export function Splash({ navigation }: SplashProps) {

    const { setLocation } = useLocation();
    const [{ hasLocationPermission, shouldAnimateLogo }, setState] = useState<SplashState>({
        hasLocationPermission: false,
        shouldAnimateLogo: false
    });


    const onAnimationComplete = () => {
        if (shouldAnimateLogo) {
            if (hasLocationPermission) {
                navigation.navigate("root");
            } else {
                navigation.navigate("location_permission");
            }
        }
    }

    useEffect(() => {
        getLocationPermissionStatus().then((permission) => {
            if (permission.status === "granted") {
                readDeviceLocation().then((location) => {
                    setLocation(location);
                    setState({ hasLocationPermission: true, shouldAnimateLogo: true });
                })
            } else {
                setState({ hasLocationPermission: false, shouldAnimateLogo: true });
            }
        });
    }, [])


    return (<View style={splashStyles.container}>
        <SplashLogo shouldAnimate={shouldAnimateLogo} onAnimationComplete={onAnimationComplete} />
    </View>)
}