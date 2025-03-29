import { useLocation } from "@/context/location";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { Navigation } from "lucide-react-native";
import * as ExpoLocation from "expo-location";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { readDeviceLocation } from "@/api/location";
import { useState } from "react";

const locationPermissionStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: useGetColor(AppColor.background),
    },
    content: {
        ...StyleUtils.flexColumn(16),
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: 16,
    },
    locationButton: {
        ...StyleUtils.flexRow(8),
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: useGetColor(AppColor.primary),
    },
    loader: {
        marginTop: 24,
    },
    infoText: {
        fontStyle: "italic",
    },
});

type LocationPermissionProps = StackScreenProps<RootStackParamList, "location_permission">

export function LocationPermission({ navigation }: LocationPermissionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { setLocation } = useLocation();

    const openSettings = () => {
        Linking.openSettings();
    };

    const showLocationPermissionDisabledAlert = () => {
        Alert.alert(
            "Location Access Needed",
            "It looks like location access is currently disabled. Please enable location access in your device settings to use the app.",
            [
                { text: "Not Now", style: "cancel" },
                { text: "Open Settings", onPress: openSettings },
            ]
        );
    };

    const handleLocationPermission = async () => {
        setIsLoading(true);
        const permission = await ExpoLocation.requestForegroundPermissionsAsync();
        if (permission.granted) {
            const location = await readDeviceLocation();
            setLocation(location);
            navigation.replace("tabs", { screen: "home" });
        } else {
            showLocationPermissionDisabledAlert();
        }
        setIsLoading(false);
    }

    return (
        <SafeAreaView style={locationPermissionStyles.container}>
            <View style={locationPermissionStyles.content}>
                <TouchableOpacity
                    style={locationPermissionStyles.locationButton}
                    onPress={handleLocationPermission}
                >
                    <Navigation
                        stroke={useGetColor(AppColor.background)}
                        fill={useGetColor(AppColor.background)}
                        width={20}
                        height={20}
                    />
                    <Text neutral semibold background>
                        Use Current Location
                    </Text>
                </TouchableOpacity>
                {isLoading && (
                    <ActivityIndicator
                        size="large"
                        color={useGetColor(AppColor.primary)}
                        style={locationPermissionStyles.loader}
                    />
                )}
                <Text neutral style={locationPermissionStyles.infoText}>
                    Your location helps us calculate the correct dates and times for
                    important Hindu festivals, auspicious days, and other calendar
                    elements specific to your region.
                </Text>
            </View>
        </SafeAreaView>
    );
}
