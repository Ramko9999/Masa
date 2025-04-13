import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/theme/index";
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
      <Text background semibold neutral>
        {currentRoute === "home" ? "Settings" : "Home"}
      </Text>
    </TouchableOpacity>
  );
}
