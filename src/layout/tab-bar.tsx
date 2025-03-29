import React from "react";
import { View, Text } from "@/theme/index";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const customTabBarStyles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'transparent',
        width: "100%",
    },
    container: {
        ...StyleUtils.flexRow(8),
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: useGetColor(AppColor.primary),
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    tabText: {
        fontSize: 14,
        color: useGetColor(AppColor.background),
    },
});

export function CustomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const currentRoute = state.routes[state.index].name;

    const getTargetRoute = () => {
        return currentRoute === "home" ? "upcoming_festivals" : "home";
    };

    const handlePress = () => {
        navigation.navigate(getTargetRoute());
    };

    const getButtonText = () => {
        return currentRoute === "home" ? "Upcoming Festivals" : "Home";
    };

    return (
        <View
            style={[
                customTabBarStyles.wrapper,
                { paddingBottom: insets.bottom + 20 }
            ]}
        >
            <View style={customTabBarStyles.container}>
                <TouchableOpacity
                    onPress={handlePress}
                    style={customTabBarStyles.tab}
                >
                    <Text
                        semibold
                        background
                        style={customTabBarStyles.tabText}
                    >
                        {getButtonText()}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
