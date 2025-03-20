import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { useGetColor } from "../theme/color";
import { Tabs } from "../components/util/tab-bar";
import { Home } from "../components/home";
import { BlurView } from "expo-blur";
import { TithiInfoSheet } from "../components/sheets";
import { Upcoming } from "./upcoming";
import { FestivalDetails } from "./festival-details";
import { Festival } from "../api/panchanga/core/festival";

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
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Function to navigate to festival details
  const navigateToFestivalDetails = (festival: Festival) => {
    setSelectedFestival(festival);
    setCurrentRoute("festival-details");
  };

  // Function to go back from festival details
  const goBackFromFestivalDetails = () => {
    setCurrentRoute("upcoming");
    setSelectedFestival(null);
  };

  return (
    <>
      {currentRoute === "home" && (
        <ScrollView
          style={[
            { backgroundColor: useGetColor("background") },
            rootStyles.container,
          ]}
        >
          <Home actions={{ onTithiClick: () => setShowTithiSheet(true) }} />
        </ScrollView>
      )}

      {currentRoute === "upcoming" && (
        <Upcoming onFestivalPress={navigateToFestivalDetails} />
      )}

      {currentRoute === "festival-details" && selectedFestival && (
        <FestivalDetails 
          festival={selectedFestival} 
          onGoBack={goBackFromFestivalDetails} 
        />
      )}

      {currentRoute !== "festival-details" && (
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
      )}

      <TithiInfoSheet
        show={showTithiSheet}
        onHide={() => setShowTithiSheet(false)}
      />
    </>
  );
}
