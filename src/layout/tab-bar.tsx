import React, { useEffect, useRef } from "react";
import { View, Text } from "@/theme/index";
import { Pressable, StyleSheet, Animated } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor } from "@/theme/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabBarVisibility } from "@/context/tab-bar-visibility";

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { isTabBarVisible } = useTabBarVisibility();
  
  // Animated value for opacity
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Simple, performant animation
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isTabBarVisible ? 1 : 0,
      duration: isTabBarVisible ? 100 : 150, // Fast show, slightly slower hide
      useNativeDriver: true, // Hardware acceleration
    }).start();
  }, [isTabBarVisible, opacity]);

  return (
    <Animated.View 
      style={[
        styles.wrapper, 
        { 
          paddingBottom: insets.bottom + 20,
          opacity,
          // Prevent interactions when hidden
          pointerEvents: isTabBarVisible ? 'auto' : 'none'
        }
      ]}
    >
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
                {route.name === "home" ? "Home" : "Upcoming Festivals"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
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
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: useGetColor(AppColor.tint),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
