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
} from "react-native";
import { View } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { NotificationApi } from "@/api/notification";
import { useLocation } from "@/context/location";

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
});

export function Home({ navigation }: HomeProps) {
  const { selection } = useCalendar();
  const { location } = useLocation();
  const homeStyles = useThemedStyles(homeStylesFactory);

  useEffect(() => {
    NotificationApi.scheduleFestivalNotifications(location!);
  }, []);

  return (
    <View style={homeStyles.container}>
      <WeekCalendar />
      <ScrollView>
        <Pachanga
          onTithiClick={() => navigation.navigate("tithi_info")}
          onVaaraClick={() => navigation.navigate("vaara_info")}
          onMasaClick={() => navigation.navigate("masa_info")}
          onNakshatraClick={() => navigation.navigate("nakshatra_info")}
          selectedDay={selection.date}
        />
      </ScrollView>
    </View>
  );
}
