import { WeekCalendar } from "@/components/calendar/week";
import React, { useEffect } from "react";
import { Pachanga } from "@/components/panchanga";
import { useCalendar } from "@/components/calendar/context";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "@/layout/types";
import { RootStackParamList } from "@/layout/types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
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

type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "home">,
  StackScreenProps<RootStackParamList>
>;

const homeStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background, theme),
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

export function Home({ navigation }: HomeProps) {
  const { selection, openMonthCalendar } = useCalendar();
  const { location } = useLocation();
  const theme = useColorScheme();
  const homeStyles = useThemedStyles(homeStylesFactory);
  const insets = useSafeAreaInsets();
  
  const {height} = useWindowDimensions();

  useEffect(() => {
    NotificationApi.scheduleFestivalNotifications(location!);
  }, []);

  return (
    <View style={homeStyles.container}>
      <WeekCalendar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pachanga
          onTithiClick={() => navigation.navigate("tithi_info")}
          onVaaraClick={() => navigation.navigate("vaara_info")}
          onMasaClick={() => navigation.navigate("masa_info")}
          onNakshatraClick={() => navigation.navigate("nakshatra_info")}
          selectedDay={selection.date}
        />
      </ScrollView>
      <TouchableOpacity style={[homeStyles.floatingButton, { bottom: insets.bottom + height * 0.09 }]} onPress={openMonthCalendar}>
        <CalendarDays size={24} color={useGetColor(AppColor.background, theme)} />
      </TouchableOpacity>
    </View>
  );
}
