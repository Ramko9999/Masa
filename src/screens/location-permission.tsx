import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ExpoLocation from "expo-location";
import { Location } from "@/api/panchanga/location";
import { AppColor, useGetColor } from "@/theme/color";
import { Navigation } from "lucide-react-native";
import { Text, View } from "@/theme/index";
import { StyleUtils } from "@/theme/style-utils";
import { setLocation } from "@/store/location";

type LocationPermissionProps = {
  onLocationSet: (location: Location) => void;
};

export function LocationPermission({ onLocationSet }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const openSettings = () => {
    Linking.openSettings();
  };

  const showLocationPermissionAlert = () => {
    Alert.alert(
      "Location Access Needed",
      "It looks like location access is currently disabled. Please enable location access in your device settings to use the app.",
      [
        { text: "Not Now", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ]
    );
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);

    try {
      const { status: currentStatus } =
        await ExpoLocation.getForegroundPermissionsAsync();

      if (currentStatus === ExpoLocation.PermissionStatus.DENIED) {
        showLocationPermissionAlert();
        setIsLoading(false);
        return;
      }

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

      if (status !== ExpoLocation.PermissionStatus.GRANTED) {
        showLocationPermissionAlert();
        setIsLoading(false);
        return;
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      await setLocation({ latitude, longitude });
      onLocationSet({ latitude, longitude });
    } catch (error) {
      Alert.alert(
        "Error",
        "Sorry, unable to get your location. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Navigation
            stroke={useGetColor(AppColor.background)}
            fill={useGetColor(AppColor.background)}
            width={20}
            height={20}
          />
          <Text neutral semibold background>
            Use Current Location
          </Text>
        </TouchableOpacity>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={useGetColor(AppColor.primary)}
            style={styles.loader}
          />
        )}
        <Text neutral style={styles.infoText}>
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
    backgroundColor: useGetColor(AppColor.background),
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
    backgroundColor: useGetColor(AppColor.primary),
  },
  loader: {
    marginTop: 24,
  },
  infoText: {
    fontStyle: "italic",
  },
});
