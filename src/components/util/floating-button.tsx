import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "@/theme/index";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";

const floatingButtonStyles = StyleSheet.create({
    container: {
        ...StyleUtils.flexRowCenterAll(5),
        position: "absolute",
        bottom: "5%",
        right: "5%",
        backgroundColor: useGetColor(AppColor.primary),
        paddingHorizontal: "4%",
        paddingVertical: "2%",
        borderRadius: "2%",
    },
    text: {
        color: useGetColor(AppColor.background),
        fontSize: 16,
        fontWeight: "600",
    },
});

type FloatingButtonProps = {
    currentRoute: string;
    onClick: (route: string) => void;
};

export function FloatingButton({ currentRoute, onClick }: FloatingButtonProps) {
    return (
        <TouchableOpacity
            style={floatingButtonStyles.container}
            onPress={() => onClick(currentRoute)}
        >
            <Text style={floatingButtonStyles.text}>
                {currentRoute === "home" ? "Settings" : "Home"}
            </Text>
        </TouchableOpacity>
    );
}
