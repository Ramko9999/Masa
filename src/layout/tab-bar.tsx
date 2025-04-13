import React from "react";
import { View, Text } from "@/theme/index";
import { Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor } from "@/theme/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={index}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              <Text
                semibold
                small
                style={[styles.tabText, isFocused && styles.activeTabText]}
              >
                {route.name === "home" ? "Home" : "Festivals"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: useGetColor(AppColor.tint),
  },
  tab: {
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: useGetColor(AppColor.primary),
  },
  tabText: {
    color: useGetColor(AppColor.background),
  },
  activeTabText: {
    color: useGetColor(AppColor.background),
  },
});
