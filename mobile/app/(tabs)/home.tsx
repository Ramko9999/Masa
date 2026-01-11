import { WeekCalendar } from "@/components/calendar/week";
import React, { useEffect } from "react";
import { Pachanga } from "@/components/panchanga";
import { useCalendar } from "@/components/calendar/context";
import {
  ColorSchemeName,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { View } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { NotificationApi } from "@/api/notification";
import { useLocation } from "@/context/location";
import { CalendarDays } from "lucide-react-native";
import { StyleUtils } from "@/theme/style-utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Host, Button, Image } from "@expo/ui/swift-ui";
import { isLiquidGlassAvailable } from "expo-glass-effect";

const homeStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background, theme),
  },
  liquidGlassFloatingButton: {
    position: "absolute",
    right: "3%",
  },
  floatingButton: {
    position: "absolute",
    right: "3%",
    backgroundColor: useGetColor(AppColor.primary, theme),
    borderRadius: 32,
    padding: "2.5%",
    aspectRatio: 1,
    ...StyleUtils.flexRowCenterAll(),
    shadowColor: useGetColor(AppColor.primary, theme),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default function Home() {
  const { selection, openMonthCalendar } = useCalendar();
  const { location } = useLocation();
  const homeStyles = useThemedStyles(homeStylesFactory);
  const router = useRouter();

  useEffect(() => {
    NotificationApi.scheduleFestivalNotifications(location!);
  }, []);

  return (
    <View style={homeStyles.container}>
      <WeekCalendar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pachanga
          onTithiClick={() => router.push("/tithi-info")}
          onVaaraClick={() => router.push("/vaara-info")}
          onMasaClick={() => router.push("/masa-info")}
          onNakshatraClick={() => router.push("/nakshatra-info")}
          onMuhurtamClick={() => router.push("/muhurtam-info")}
          selectedDay={selection.date}
        />
      </ScrollView>
      <FloatingButton onPress={openMonthCalendar} />
    </View>
  );
}

interface FloatingButtonProps {
  onPress: () => void;
}

function FloatingButton({ onPress }: FloatingButtonProps) {
  const theme = useColorScheme();
  const homeStyles = useThemedStyles(homeStylesFactory);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  if (isLiquidGlassAvailable()) {
    return (
      <Host
        matchContents
        style={[
          homeStyles.liquidGlassFloatingButton,
          { bottom: insets.bottom + height * 0.08 },
        ]}
      >
        <Button
          variant="glassProminent"
          controlSize="extraLarge"
          color={useGetColor(AppColor.primary, theme)}
          systemImage="calendar"
          onPress={onPress}
        />
      </Host>
    );
  }

  return (
    <TouchableOpacity
      style={[
        homeStyles.floatingButton,
        { bottom: insets.bottom + height * 0.11 },
      ]}
      onPress={onPress}
    >
      <CalendarDays size={24} color={useGetColor(AppColor.background, theme)} />
    </TouchableOpacity>
  );
}
