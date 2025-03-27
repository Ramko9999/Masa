import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { AppColor, useGetColor } from "@/theme/color";
import { FloatingButton } from "@/components/util/floating-button";
import { Home } from "@/components/home";
import {
  NakshatraInfoSheet,
  TithiInfoSheet,
  YogaInfoSheet,
} from "@/components/sheets";
import { UpcomingFestivals } from "@/screens/upcoming-festivals";
import { Festival } from "@/api/panchanga/core/festival";
import { FestivalDetails } from "./festival-details";
import { useLocation } from "@/context/location";

const rootStyles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: useGetColor(AppColor.background),
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Root() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [showTithiSheet, setShowTithiSheet] = useState(false);
  const [showYogaSheet, setShowYogaSheet] = useState(false);
  const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(
    null
  );
  const { location } = useLocation();

  const navigateToFestivalDetails = (festival: Festival) => {
    setSelectedFestival(festival);
    setCurrentRoute("festival-details");
  };

  const goBackFromFestivalDetails = () => {
    setCurrentRoute("upcoming-festivals");
    setSelectedFestival(null);
  };

  return (
    <>
      <ScrollView style={rootStyles.container}>
        {currentRoute === "home" && (
          <Home
            actions={{
              onTithiClick: () => setShowTithiSheet(true),
              onYogaClick: () => setShowYogaSheet(true),
              onNakshatraClick: () => setShowNakshatraSheet(true),
            }}
          />
        )}

        {currentRoute === "upcoming-festivals" && (
          <UpcomingFestivals
            onFestivalPress={navigateToFestivalDetails}
            location={location!}
          />
        )}

        {currentRoute === "festival-details" && selectedFestival !== null && (
          <FestivalDetails
            festival={selectedFestival}
            onGoBack={goBackFromFestivalDetails}
          />
        )}
      </ScrollView>

      {currentRoute !== "festival-details" && currentRoute !== "location" && (
        <FloatingButton
          onClick={(newRoute) => {
            setCurrentRoute(newRoute);
          }}
          currentRoute={currentRoute}
        />
      )}

      <TithiInfoSheet
        show={showTithiSheet}
        onHide={() => setShowTithiSheet(false)}
      />
      <YogaInfoSheet
        show={showYogaSheet}
        onHide={() => setShowYogaSheet(false)}
      />
      <NakshatraInfoSheet
        show={showNakshatraSheet}
        onHide={() => setShowNakshatraSheet(false)}
      />
    </>
  );
}
