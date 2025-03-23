import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetColor } from "../theme/color";
import { Navigation } from "lucide-react-native";
import { Text } from "../theme/index";
import { StyleUtils } from "../theme/style-utils";

const LOCATION_STORAGE_KEY = "user_location";

export function LocationScreen({
  onLocationSet,
}: {
  onLocationSet: (location: { latitude: number; longitude: number }) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const openSettings = () => {
    Linking.openSettings();
  };

  const saveAndSetLocation = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    onLocationSet(location);
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);

    try {
      const { status: currentStatus } =
        await Location.getForegroundPermissionsAsync();

      if (currentStatus === "denied") {
        Alert.alert(
          "Location Access Needed",
          "It looks like location access is currently disabled. To get the most accurate calendar information for your area, please enable location access in your device settings.",
          [
            { text: "Not Now", style: "cancel" },
            { text: "Open Settings", onPress: openSettings },
          ]
        );
        setIsLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Access Needed",
          "We need your location to provide accurate Hindu calendar information for your area.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      await saveAndSetLocation({ latitude, longitude });
    } catch (error) {
      Alert.alert(
        "Error",
        "Sorry, unable to get your location. Please try again."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: useGetColor("background") }]}
    >
      <View style={styles.content}>
        <Text large bold>
          Welcome to Masa
        </Text>
        <Text small>
          To provide you with the most accurate calendar information for your
          area, we need to know your location.
        </Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Navigation
            stroke={useGetColor("background")}
            fill={useGetColor("background")}
            width={20}
            height={20}
          />
          <Text small semibold style={styles.locationButtonText}>
            Use Current Location
          </Text>
        </TouchableOpacity>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={useGetColor("primary")}
            style={styles.loader}
          />
        )}
        <Text small style={styles.infoText}>
          Your location helps us calculate the correct dates and times for
          important Hindu festivals, auspicious days, and other calendar
          elements specific to your region.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...StyleUtils.flexColumn(16),
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    flex: 1,
    padding: 16,
  },
  locationButton: {
    ...StyleUtils.flexRow(8),
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: useGetColor("primary"),
  },
  locationButtonText: {
    color: useGetColor("background"),
  },
  loader: {
    marginTop: 24,
  },
  infoText: {
    fontStyle: "italic",
  },
});
