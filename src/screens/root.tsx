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
import { LocationScreen } from "@/screens/location-permission";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const LOCATION_STORAGE_KEY = "user_location";

export function Root() {
  const [currentRoute, setCurrentRoute] = useState("location");
  const [showTithiSheet, setShowTithiSheet] = useState(false);
  const [showYogaSheet, setShowYogaSheet] = useState(false);
  const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSavedLocation = async () => {
      try {
        const savedLocationJson = await AsyncStorage.getItem(
          LOCATION_STORAGE_KEY
        );

        if (savedLocationJson) {
          const savedLocation = JSON.parse(savedLocationJson);
          setUserLocation(savedLocation);
          setCurrentRoute("home");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedLocation();
  }, []);

  const handleLocationSet = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setUserLocation(location);
    setCurrentRoute("home");
  };

  const navigateToFestivalDetails = (festival: Festival) => {
    setSelectedFestival(festival);
    setCurrentRoute("festival-details");
  };

  const goBackFromFestivalDetails = () => {
    setCurrentRoute("upcoming");
    setSelectedFestival(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {currentRoute === "location" && (
        <LocationScreen onLocationSet={handleLocationSet} />
      )}

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
