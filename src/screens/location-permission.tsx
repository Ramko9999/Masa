import * as Notifications from "expo-notifications";
import { useLocation } from "@/context/location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import {
  StyleSheet,
  useWindowDimensions,
  Platform,
  ColorSchemeName,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import * as ExpoLocation from "expo-location";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import {
  LocationApi,
  PrepopulatedLocation,
  PREPOPULATED_LOCATIONS,
} from "@/api/location";
import { useEffect, useState } from "react";
import { shadeColor, tintColor } from "@/util/color";
import { useTranslation } from "react-i18next";

const prepopulatedLocationSelectionStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(20),
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  title: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    ...StyleUtils.flexRowCenterAll(10),
    backgroundColor: (theme === "dark" ? shadeColor : tintColor)(
      useGetColor(AppColor.primary, theme),
      0.95
    ),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
  },
  selectedContainer: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  textContainer: {
    flex: 1,
  },
  selectedText: {
    color: useGetColor(AppColor.background, theme),
  },
  loadingIndicator: {
    marginBottom: "5%",
  },
});

type PrepopulatedLocationSelectionProps = {
  location: PrepopulatedLocation;
  isSelected: boolean;
  onSelect: () => void;
  isLoading?: boolean;
};

export function PrepopulatedLocationSelection({
  location,
  isSelected,
  onSelect,
  isLoading = false,
}: PrepopulatedLocationSelectionProps) {
  const prepopulatedLocationSelectionStyles = useThemedStyles(
    prepopulatedLocationSelectionStylesFactory
  );

  return (
    <View>
      <TouchableOpacity
        style={[
          prepopulatedLocationSelectionStyles.locationContainer,
          isSelected && prepopulatedLocationSelectionStyles.selectedContainer,
        ]}
        onPress={onSelect}
        disabled={isLoading}
      >
        <View style={prepopulatedLocationSelectionStyles.textContainer}>
          <Text large semibold primary={!isSelected} background={isSelected}>
            {`${location.city}, ${location.country}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const newLocationPermissionStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    height: "100%",
    backgroundColor: useGetColor(AppColor.background, theme),
  },
  content: {
    ...StyleUtils.flexColumn(30),
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  actionButtonContainer: {
    marginTop: "auto",
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: useGetColor(AppColor.primary, theme),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
    ...StyleUtils.flexRow(10),
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: useGetColor(AppColor.background, theme),
    opacity: 0.5,
    ...StyleUtils.flexRowCenterAll(),
  },
});

type LocationPermissionProps = StackScreenProps<
  RootStackParamList,
  "location_permission"
>;

export function LocationPermission({ navigation }: LocationPermissionProps) {
  const { setLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prepopulatedLocation, setPrepopulatedLocation] =
    useState<PrepopulatedLocation | null>(null);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const theme = useColorScheme();
  const newLocationPermissionStyles = useThemedStyles(
    newLocationPermissionStylesFactory
  );
  const { t } = useTranslation();

  const onHandleNext = async () => {
    setIsLoading(true);
    if (prepopulatedLocation) {
      await LocationApi.saveLocation({
        ...prepopulatedLocation,
        place: prepopulatedLocation.city,
      });
      setLocation({
        ...prepopulatedLocation,
        place: prepopulatedLocation.city,
      });
      const notificationSettings = await Notifications.getPermissionsAsync();
      if (
        notificationSettings.status === "undetermined" &&
        Platform.OS === "ios"
      ) {
        navigation.replace("notification_permission");
      } else {
        navigation.replace("tabs", { screen: "home" });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    ExpoLocation.requestForegroundPermissionsAsync().then(
      async (permission) => {
        if (permission.granted) {
          setIsLoading(true);
          const location = await LocationApi.readAndSaveDeviceLocation();
          setLocation(location);
          const notificationSettings =
            await Notifications.getPermissionsAsync();
          if (
            notificationSettings.status === "undetermined" &&
            Platform.OS === "ios"
          ) {
            navigation.replace("notification_permission");
          } else {
            navigation.replace("tabs", { screen: "home" });
          }
          setIsLoading(false);
        }
      }
    );
  }, []);

  return (
    <View style={newLocationPermissionStyles.container}>
      <View
        style={[
          newLocationPermissionStyles.content,
          { paddingTop: insets.top + height * 0.06 },
        ]}
      >
        <Text big primary>
          {t("intro.location_permission.subtext")}
        </Text>
        <View>
          {PREPOPULATED_LOCATIONS.map((location) => (
            <View key={location.city} style={{ marginBottom: "3%" }}>
              <PrepopulatedLocationSelection
                location={location}
                isSelected={prepopulatedLocation?.city === location.city}
                onSelect={() => setPrepopulatedLocation(location)}
              />
            </View>
          ))}
        </View>
        <View
          style={[
            newLocationPermissionStyles.actionButtonContainer,
            { marginBottom: insets.bottom },
          ]}
        >
          <TouchableOpacity
            style={[
              newLocationPermissionStyles.actionButton,
              prepopulatedLocation === null && { opacity: 0.5 },
            ]}
            onPress={onHandleNext}
            disabled={prepopulatedLocation === null}
          >
            <Text large semibold background>
              {t("intro.location_permission.button")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && (
        <View style={newLocationPermissionStyles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={useGetColor(AppColor.primary, theme)}
          />
        </View>
      )}
    </View>
  );
}
