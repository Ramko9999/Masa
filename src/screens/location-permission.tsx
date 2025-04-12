import { useLocation } from "@/context/location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, getFontSize } from "@/theme";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { Navigation } from "lucide-react-native";
import * as ExpoLocation from "expo-location";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { LocationApi } from "@/api/location";
import { useState } from "react";

const LOCATION_TITLE = "Location permission";
const LOCATION_SUBTEXT =
  "We need your location to calculate the correct calendar elements and festival timings for your region.";

const newLocationPermissionStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: useGetColor(AppColor.background),
  },
  content: {
    ...StyleUtils.flexColumn(30),
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  actionButtonContainer: {
    marginTop: "auto",
    marginBottom: "10%",
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: useGetColor(AppColor.primary),
    paddingHorizontal: "8%",
    paddingVertical: "4%",
    borderRadius: 12,
  }
});

type LocationPermissionProps = StackScreenProps<
  RootStackParamList,
  "location_permission"
>;

export function LocationPermission({ navigation }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const openSettings = () => {
    Linking.openSettings();
  };

  const showLocationPermissionDisabledAlert = () => {
    Alert.alert(
      "Location Access Needed",
      "It looks like location access is currently disabled. Please enable location access in your device settings to use the app.",
      [
        { text: "Not Now", style: "cancel" },
        { text: "Open Settings", onPress: openSettings },
      ]
    );
  };

  const handleLocationPermission = async () => {
    setIsLoading(true);
    const permission = await ExpoLocation.requestForegroundPermissionsAsync();
    if (permission.granted) {
      const location = await LocationApi.readDeviceLocation();
      setLocation(location);
      navigation.replace("notification_permission");
    } else {
      showLocationPermissionDisabledAlert();
    }
    setIsLoading(false);
  };

  return (
    <View style={newLocationPermissionStyles.container}>
      <View
        style={[
          newLocationPermissionStyles.content,
          { paddingTop: insets.top + height * 0.06 },
        ]}
      >
        <Text huge bold primary>
          {LOCATION_TITLE}
        </Text>
        <Text big primary>
          {LOCATION_SUBTEXT}
        </Text>

        <View style={newLocationPermissionStyles.actionButtonContainer}>
          <TouchableOpacity
            style={newLocationPermissionStyles.actionButton}
            onPress={handleLocationPermission}
          >
            <View style={StyleUtils.flexRow(8)}>
              <Navigation
                stroke={useGetColor(AppColor.background)}
                fill={useGetColor(AppColor.background)}
                width={20}
                height={20}
              />
              <Text large semibold background>
                Use Current Location
              </Text>
            </View>
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color={useGetColor(AppColor.primary)}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
