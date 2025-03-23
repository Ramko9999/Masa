import { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { AppColor, useGetColor } from "@/theme/color";
import { Tabs } from "@/components/util/tab-bar";
import { Home } from "@/components/home";
import { BlurView } from "expo-blur";
import {
  NakshatraInfoSheet,
  TithiInfoSheet,
  YogaInfoSheet,
} from "@/components/sheets";
import { Upcoming } from "@/screens/upcoming";
import { FestivalDetails } from "@/screens/festival-details";
import { Festival } from "@/api/panchanga/core/festival";
import { Location } from "@/api/panchanga/location";
import { LocationPermission } from "@/screens/location-permission";
import { getLocation } from "@/store/location";

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
  const [showYogaSheet, setShowYogaSheet] = useState(false);
  const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(
    null
  );
  const [location, setLocation] = useState<Location | null>(null);

  const navigateToFestivalDetails = (festival: Festival) => {
    setSelectedFestival(festival);
    setCurrentRoute("festival-details");
  };

  const goBackFromFestivalDetails = () => {
    setCurrentRoute("upcoming");
    setSelectedFestival(null);
  };

  const onLocationSet = (location: Location) => {
    setLocation(location);
    setCurrentRoute("home");
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getLocation();
        setLocation(location);
      } catch (error) {
        setLocation(null);
      }
    };
    fetchLocation();
  }, []);

  if (location === null) {
    return <LocationPermission onLocationSet={onLocationSet} />;
  }

  return (
    <>
      {currentRoute === "home" && (
        <ScrollView
          style={[
            { backgroundColor: useGetColor(AppColor.background) },
            rootStyles.container,
          ]}
        >
          <Home
            actions={{
              onTithiClick: () => setShowTithiSheet(true),
              onYogaClick: () => setShowYogaSheet(true),
              onNakshatraClick: () => setShowNakshatraSheet(true),
            }}
          />
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

      {currentRoute !== "festival-details" && currentRoute !== "location" && (
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
