import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { useGetColor } from "../theme/color";
import { Tabs } from "../components/util/tab-bar";
import { Home } from "../components/home";
import { BlurView } from "expo-blur";
import { TithiInfoSheet } from "../components/sheets";
import { Upcoming } from "./upcoming";

const rootStyles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingBottom: 50,
  },
  tabs: {
    height: "10%",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export function Root() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [showTithiSheet, setShowTithiSheet] = useState(false);

  return (
    <>
      <ScrollView
        style={[
          { backgroundColor: useGetColor("background") },
          rootStyles.container,
        ]}
      >
        {currentRoute === "home" && (
          <Home actions={{ onTithiClick: () => setShowTithiSheet(true) }} />
        )}
        {currentRoute === "upcoming" && <Upcoming />}
      </ScrollView>

      <BlurView
        style={rootStyles.tabs}
        tint="light"
        intensity={50}
        experimentalBlurMethod="dimezisBlurView"
      >
        <Tabs
          currentRoute={currentRoute}
          onClick={(route) => setCurrentRoute(route)}
        />
      </BlurView>

      <TithiInfoSheet
        show={showTithiSheet}
        onHide={() => setShowTithiSheet(false)}
      />
    </>
  );
}
