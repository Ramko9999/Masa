import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import {
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleUtils } from "../../theme/style-utils";
import { useGetColor } from "../../theme/color";
import { LucideBolt, LucideCalendar, LucideHome, LucideList } from "lucide-react-native";

const tabStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    ...StyleUtils.flexRowCenterAll(),
  },
});

type TabProps = {
  onPress: () => void;
};

function UpcomingTab({ onPress }: TabProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tabStyles.container,
          { backgroundColor: useGetColor("button-background") },
        ]}
      >
        <LucideBolt
          size={24}
          color={useGetColor("button-text")}
          strokeWidth={2}
        />
      </View>
    </TouchableOpacity>
  );
}

function CalendarTab({ onPress }: TabProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tabStyles.container,
          { backgroundColor: useGetColor("button-background") },
        ]}
      >
        <LucideCalendar
          size={24}
          color={useGetColor("button-text")}
          strokeWidth={2}
        />
      </View>
    </TouchableOpacity>
  );
}

function HomeTab({ onPress }: TabProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tabStyles.container,
          { backgroundColor: useGetColor("button-background") },
        ]}
      >
        <LucideHome
          size={24}
          color={useGetColor("button-text")}
          strokeWidth={2}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(12),
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    height: "100%",
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
  const { width } = useWindowDimensions();

  const renderTab = (route: string, label: string) => {
    const isFocused = currentRoute.name === route;

    if (route === "upcoming") {
      return <UpcomingTab onPress={() => navigation.navigate("upcoming")} />;
    }

    if (route === "calendar") {
      return <CalendarTab onPress={() => navigation.navigate("calendar")} />;
    }

    if (route === "home") {
      return <HomeTab onPress={() => navigation.navigate("home")} />;
    }

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
    flexDirection: "row",
    height: "10%",
    bottom: 0,
    width: "100%",
  },
});
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      tint="light"
      intensity={50}
      style={tabBarStyles.container}
      experimentalBlurMethod="dimezisBlurView"
    >
      <Tabs
        state={state}
        descriptors={descriptors}
        navigation={navigation}
        insets={insets}
      />
    </BlurView>
  );
}
