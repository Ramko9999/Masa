import React from "react";
import { View, Text } from "@/theme/index";
import { ColorSchemeName, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarDays, PartyPopper, Settings } from "lucide-react-native";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  FadeInRight,
  FadeOutRight,
  withSpring,
  LinearTransition
} from "react-native-reanimated";
import { StyleUtils } from "@/theme/style-utils";

const stylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...StyleUtils.flexRowCenterAll(),
  },
  container: {
    ...StyleUtils.flexRow(),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: useGetColor(AppColor.tint, theme),
  },
  tab: {
    ...StyleUtils.flexRowCenterAll(8),
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  icon: {
    color: useGetColor(AppColor.background, theme),
  },
  tabText: {
    color: useGetColor(AppColor.background, theme),
  }
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(stylesFactory);
  const theme = useColorScheme();
  const activeTabIndex = useSharedValue(state.index);
  const primaryColor = useGetColor(AppColor.primary, theme);
  const backgroundColor = useGetColor(AppColor.background, theme);

  React.useEffect(() => {
    activeTabIndex.value = state.index;
  }, [state.index]);

  const getTabIcon = (routeName: string) => {
    switch (routeName) {
      case "home":
        return <CalendarDays size={24} color={backgroundColor} />;
      case "festivals":
        return <PartyPopper size={24} color={backgroundColor} />;
      case "settings":
        return <Settings size={24} color={backgroundColor} />;
      default:
        return null;
    }
  };

  const getTabText = (routeName: string) => {
    switch (routeName) {
      case "home":
        return "Home";
      case "festivals":
        return "Festivals";
      default:
        return "Settings";
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          const animatedStyle = useAnimatedStyle(() => {
            const isActive = activeTabIndex.value === index;
            return {
              backgroundColor: withSpring(
                isActive ? primaryColor : "transparent",
                { damping: 80, stiffness: 200 }
              ),
            };
          });

          return (
            <Animated.View
              key={route.name}
              layout={LinearTransition.springify().damping(80).stiffness(200)}
            >
              <AnimatedPressable
                onPress={onPress}
                style={[styles.tab, animatedStyle]}
              >
                {getTabIcon(route.name)}
                {isFocused && (
                  <Animated.View
                    entering={FadeInRight.springify().damping(80).stiffness(200)}
                    exiting={FadeOutRight.springify().damping(80).stiffness(200)}
                  >
                    <Text semibold small style={styles.tabText}>
                      {getTabText(route.name)}
                    </Text>
                  </Animated.View>
                )}
              </AnimatedPressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};
