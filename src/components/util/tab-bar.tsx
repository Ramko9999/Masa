import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import {
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTab: {
    color: "#007AFF",
  },
  inactiveTab: {
    color: "#8E8E93",
  },
});

export function Tabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const currentRoute = state.routes[state.index];
  const middleTab = currentRoute.name === "home" ? "upcoming" : "home";

  const renderTab = (route: string, label: string) => {
    const isFocused = currentRoute.name === route;

    return (
      <TouchableOpacity
        key={route}
        style={styles.tab}
        onPress={() => {
          navigation.navigate(route);
        }}
      >
        <Text
          style={[
            styles.tabText,
            isFocused ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderTab(middleTab, middleTab === "home" ? "Home" : "Upcoming")}
      {renderTab("calendar", "Calendar")}
    </View>
  );
}

const tabBarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
});

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { height } = useWindowDimensions();
  const translation = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: translation.value }],
    }),
    []
  );

  return (
    <Animated.View style={[tabBarStyles.container, animatedStyle]}>
      <Tabs
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        insets={insets}
      />
    </Animated.View>
  );
}
