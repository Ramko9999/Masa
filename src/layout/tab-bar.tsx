import React from "react";
import { View, Text } from "@/theme/index";
import { ColorSchemeName, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  PartyPopper,
  Settings,
} from "lucide-react-native";
import { useColorScheme } from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { useTranslation } from "react-i18next";
import { convertHexToRGBA } from "@/util/color";
import { BlurView } from "expo-blur";

const stylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: convertHexToRGBA(useGetColor(AppColor.tint, theme), 0.1),
  },
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingTop: "2%",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: "center",
    gap: 4,
  },
  icon: {
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 0.9,
  },
  tabText: {
    opacity: 0.2,
    color: useGetColor(AppColor.primary, theme),
  },
  activeTabText: {
    opacity: 0.7,
    color: useGetColor(AppColor.primary, theme),
  },
});

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(stylesFactory);
  const theme = useColorScheme();
  const primaryColor = useGetColor(AppColor.primary, theme);
  const { t } = useTranslation();

  const getTabIcon = (routeName: string, isActive: boolean) => {
    switch (routeName) {
      case "home":
        return (
          <House
            size={24}
            color={primaryColor}
            style={isActive ? styles.activeIcon : styles.icon}
          />
        );
      case "festivals":
        return (
          <PartyPopper
            size={24}
            color={primaryColor}
            style={isActive ? styles.activeIcon : styles.icon}
          />
        );
      case "settings":
        return (
          <Settings
            size={24}
            color={primaryColor}
            style={isActive ? styles.activeIcon : styles.icon}
          />
        );
      default:
        return null;
    }
  };

  const getTabText = (routeName: string) => {
    switch (routeName) {
      case "home":
        return t("tabs.home");
      case "festivals":
        return t("tabs.festivals");
      default:
        return t("tabs.settings");
    }
  };

  return (
    <BlurView
      intensity={80}
      tint={theme === "dark" ? "dark" : "light"}
      style={[styles.wrapper, { paddingBottom: insets.bottom }]}
      experimentalBlurMethod="dimezisBlurView"
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <Pressable key={route.name} onPress={onPress} style={styles.tab}>
              <View style={styles.tabContent}>
                {getTabIcon(route.name, isFocused)}
                <Text
                  semibold
                  tiny
                  style={isFocused ? styles.activeTabText : styles.tabText}
                >
                  {getTabText(route.name)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
};
