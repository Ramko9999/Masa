import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "@/theme/index";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";

type FloatingButtonProps = {
  currentRoute: string;
  onClick: (route: string) => void;
};

export function FloatingButton({ currentRoute, onClick }: FloatingButtonProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            currentRoute === "upcoming" ? onClick("home") : onClick("upcoming");
          }}
        >
          <Text semibold background>
            {currentRoute === "upcoming" ? "Home" : "Upcoming Festivals"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    ...StyleUtils.flexRow(8),
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: useGetColor(AppColor.primary),
  },
});
