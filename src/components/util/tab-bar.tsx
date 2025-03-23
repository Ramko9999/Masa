import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { AppColor, useGetColor } from "@/theme/color";
import { LucideBolt, LucideCalendar, LucideHome } from "lucide-react-native";

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
          { backgroundColor: useGetColor(AppColor.primary) },
        ]}
      >
        <LucideBolt
          size={24}
          color={useGetColor(AppColor.background)}
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
          { backgroundColor: useGetColor(AppColor.primary) },
        ]}
      >
        <LucideCalendar
          size={24}
          color={useGetColor(AppColor.background)}
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
          { backgroundColor: useGetColor(AppColor.primary) },
        ]}
      >
        <LucideHome
          size={24}
          color={useGetColor(AppColor.background)}
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

type TabsProps = {
  currentRoute: string;
  onClick: (route: string) => void;
};

export function Tabs({ currentRoute, onClick }: TabsProps) {
  const renderTab = (route: string) => {
    if (route === "home") {
      return <UpcomingTab onPress={() => onClick("upcoming")} />;
    }

    if (route === "calendar") {
      return <CalendarTab onPress={() => onClick("calendar")} />;
    }

    if (route === "upcoming") {
      return <HomeTab onPress={() => onClick("home")} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderTab(currentRoute)}
      {renderTab("calendar")}
    </View>
  );
}
