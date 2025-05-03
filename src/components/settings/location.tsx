import { View, Text } from "@/theme";
import { StyleSheet, ColorSchemeName, TouchableOpacity, useColorScheme, Alert, Linking, ActivityIndicator } from "react-native";
import { useThemedStyles, useGetColor, AppColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { LocationApi, PrepopulatedLocation, PREPOPULATED_LOCATIONS } from "@/api/location";
import { useLocation } from "@/context/location";
import { useState, forwardRef, MutableRefObject, ForwardedRef } from "react";
import { PopupBottomSheet } from "@/components/util/sheet";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "lucide-react-native";
import { shadeColor, tintColor } from "@/util/color";
import * as ExpoLocation from "expo-location";
import { NotificationApi } from "@/api/notification";
import Animated, { LinearTransition } from "react-native-reanimated";

const initialLocationPromptStylesFactory = (
    theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
    container: {
        ...StyleUtils.flexColumn(20),
        paddingHorizontal: "5%",
        paddingTop: "10%"
    },
    title: {
        ...StyleUtils.flexRow(),
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttons: {
        ...StyleUtils.flexColumn(10),
    },
    button: {
        ...StyleUtils.flexRowCenterAll(10),
        backgroundColor: useGetColor(AppColor.primary, theme),
        paddingHorizontal: "4%",
        paddingVertical: "4%",
        borderRadius: 12,
    },
    secondaryButton: {
        ...StyleUtils.flexRowCenterAll(10),
        backgroundColor: (theme === "dark" ? shadeColor : tintColor)(useGetColor(AppColor.primary, theme), 0.95),
        paddingHorizontal: "4%",
        paddingVertical: "4%",
        borderRadius: 12,
    },
    buttonContent: {
        ...StyleUtils.flexRow(10),
        alignItems: "center"
    },
    loadingIndicator: {
        marginBottom: "5%",
    },
});

type InitialLocationPromptProps = {
    onUpdateCurrentLocationFinished: () => void;
    onSelectFromPrepopulatedLocations: () => void;
};

function InitialLocationPrompt({ onUpdateCurrentLocationFinished, onSelectFromPrepopulatedLocations }: InitialLocationPromptProps) {
    const { setLocation, location } = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const initialLocationPromptStyles = useThemedStyles(initialLocationPromptStylesFactory);
    const theme = useColorScheme();
    const insets = useSafeAreaInsets();

    const showLocationPermissionDisabledAlert = () => {
        Alert.alert(
            "Location Access Disabled",
            "The current location cannot be retrieved because location access is disabled. Please enable location access in your device settings.",
            [
                { text: "Not Now", style: "cancel" },
                { text: "Open Settings", onPress: Linking.openSettings },
            ]
        );
    };

    const handleUseCurrentLocation = async () => {
        setIsLoading(true);
        const status = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status.granted) {
            const savedLocation = await LocationApi.readAndSaveDeviceLocation()
            setLocation(savedLocation);
            await NotificationApi.scheduleFestivalNotifications(savedLocation);
            onUpdateCurrentLocationFinished();
        } else {
            showLocationPermissionDisabledAlert();
        }
        setIsLoading(false);
    }

    return (
        <BottomSheetView style={[initialLocationPromptStyles.container, { bottom: insets.bottom }]}>
            <View style={initialLocationPromptStyles.title}>
                <Text>
                    <Text larger semibold tint>
                        {"Your location was last set to "}
                    </Text>
                    <Text larger semibold>
                        {location?.place ?? "Unknown Place"}
                    </Text>
                </Text>
            </View>
            <Animated.View
                key={"buttons"}
                style={initialLocationPromptStyles.buttons}
                layout={LinearTransition.duration(300)}
            >
                <TouchableOpacity
                    style={initialLocationPromptStyles.button}
                    onPress={handleUseCurrentLocation}
                    disabled={isLoading}
                >
                    <View style={initialLocationPromptStyles.buttonContent}>
                        <Navigation size={20} color={useGetColor(AppColor.background, theme)} fill={useGetColor(AppColor.background, theme)} />
                        <Text large semibold background>
                            Use current location
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={initialLocationPromptStyles.secondaryButton}
                    onPress={onSelectFromPrepopulatedLocations}
                    disabled={isLoading}
                >
                    <View style={initialLocationPromptStyles.buttonContent}>
                        <Text large semibold primary>
                            Select a location
                        </Text>
                    </View>
                </TouchableOpacity>
                {isLoading && (
                    <ActivityIndicator
                        size="large"
                        color={useGetColor(AppColor.primary, theme)}
                        style={initialLocationPromptStyles.loadingIndicator}
                    />

                )}
            </Animated.View>
        </BottomSheetView>
    );
}

const prepopulatedLocationSelectionStylesFactory = (
    theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
    container: {
        ...StyleUtils.flexColumn(20),
        paddingHorizontal: "5%",
        paddingTop: "10%"
    },
    title: {
        ...StyleUtils.flexRow(),
        justifyContent: "space-between",
        alignItems: "center",
    },
    locationContainer: {
        ...StyleUtils.flexRowCenterAll(10),
        backgroundColor: (theme === "dark" ? shadeColor : tintColor)(useGetColor(AppColor.primary, theme), 0.95),
        paddingHorizontal: "4%",
        paddingVertical: "4%",
        borderRadius: 12,
    },
    selectedContainer: {
        backgroundColor: useGetColor(AppColor.primary, theme),
    },
    textContainer: {
        flex: 1,
    },
    selectedText: {
        color: useGetColor(AppColor.background, theme),
    },
    locationScrollContent: {
        ...StyleUtils.flexColumn(10)
    },
    loadingIndicator: {
        marginBottom: "5%",
    },
    loadingIndicatorContainer: {
        marginTop: "5%",
    }
});

type PrepopulatedLocationSelectionProps = {
    onSelectFromPrepopulatedRoutinesFinished: () => void;
};

function PrepopulatedLocationSelection({
    onSelectFromPrepopulatedRoutinesFinished,
}: PrepopulatedLocationSelectionProps) {
    const { setLocation } = useLocation();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<PrepopulatedLocation | null>(null);
    const prepopulatedLocationSelectionStyles = useThemedStyles(prepopulatedLocationSelectionStylesFactory);
    const theme = useColorScheme();

    const handleLocationSelect = async (location: PrepopulatedLocation) => {
        setIsLoading(true);
        setSelectedLocation(location);
        const locationWithPlace = {
            ...location,
            place: location.city,
        };
        await LocationApi.saveLocation(locationWithPlace);
        setLocation(locationWithPlace);
        await NotificationApi.scheduleFestivalNotifications(locationWithPlace);
        onSelectFromPrepopulatedRoutinesFinished();
        setIsLoading(false);
    };

    return (
        <BottomSheetView style={[prepopulatedLocationSelectionStyles.container, { bottom: insets.bottom }]}>
            <View style={prepopulatedLocationSelectionStyles.title}>
                <Text larger semibold tint>
                    Select from the following cities
                </Text>
            </View>
            <Animated.View
                key="locations"
                style={prepopulatedLocationSelectionStyles.locationScrollContent}
                layout={LinearTransition.duration(300)}
            >
                {PREPOPULATED_LOCATIONS.map((location) => (
                    <View key={`${location.city}-${location.country}`}>
                        <TouchableOpacity
                            style={[
                                prepopulatedLocationSelectionStyles.locationContainer,
                                selectedLocation?.city === location.city && prepopulatedLocationSelectionStyles.selectedContainer,
                            ]}
                            onPress={() => handleLocationSelect(location)}
                            disabled={isLoading}
                        >
                            <View style={prepopulatedLocationSelectionStyles.textContainer}>
                                <Text
                                    large semibold primary
                                    style={[
                                        selectedLocation?.city === location.city && prepopulatedLocationSelectionStyles.selectedText,
                                    ]}
                                >
                                    {`${location.city}, ${location.country}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {isLoading && selectedLocation?.city === location.city && (
                            <View style={prepopulatedLocationSelectionStyles.loadingIndicatorContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color={useGetColor(AppColor.primary, theme)}
                                    style={prepopulatedLocationSelectionStyles.loadingIndicator}
                                />
                            </View>
                        )}
                    </View>
                ))}
            </Animated.View>
        </BottomSheetView>
    );
}

type LocationSettingSheetProps = {
    show: boolean;
    onHide: () => void;
};

export const LocationSettingSheet = forwardRef(
    ({ show, onHide }: LocationSettingSheetProps, ref: ForwardedRef<BottomSheet>) => {
        const [showPrepoulatedRoutines, setShowPrepopulatedRoutines] = useState(false);

        const onSheetHide = () => {
            setShowPrepopulatedRoutines(false);
            onHide();
        }

        return (
            <PopupBottomSheet
                ref={ref}
                show={show}
                onHide={onSheetHide}
            >
                {
                    showPrepoulatedRoutines ? (
                        <PrepopulatedLocationSelection
                            onSelectFromPrepopulatedRoutinesFinished={() => (ref as MutableRefObject<BottomSheet>).current?.close()} />
                    ) : (
                        <InitialLocationPrompt
                            onUpdateCurrentLocationFinished={() => (ref as MutableRefObject<BottomSheet>).current?.close()}
                            onSelectFromPrepopulatedLocations={() => setShowPrepopulatedRoutines(true)} />
                    )
                }
            </PopupBottomSheet>
        );
    }
);
