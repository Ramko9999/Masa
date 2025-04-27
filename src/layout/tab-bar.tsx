import React from "react";
import { View, Text } from "@/theme/index";
import { ColorSchemeName, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const stylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
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
    backgroundColor: useGetColor(AppColor.tint, theme),
  },
  tab: {
    borderRadius: 30,
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  activeTab: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  tabText: {
    color: useGetColor(AppColor.background, theme),
  },
  activeTabText: {
    color: useGetColor(AppColor.background, theme),
  },
});

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(stylesFactory);

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
