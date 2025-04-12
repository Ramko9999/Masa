import { WeekCalendar } from "@/components/calendar/week";
import React, { useState } from "react";
import { Pachanga } from "@/components/panchanga";
import { useCalendar } from "@/components/calendar/context";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "@/layout/types";
import { RootStackParamList } from "@/layout/types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView } from "react-native";

type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "home">,
  StackScreenProps<RootStackParamList>
>;

export function Home({ navigation }: HomeProps) {
  const { selection } = useCalendar();

  return (
    <>
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
    </>
  );
}
