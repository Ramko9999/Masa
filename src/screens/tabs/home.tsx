import { WeekCalendar } from "@/components/calendar/week";
import React, { useState } from "react";
import { Pachanga } from "@/components/panchanga";
import {
  NakshatraInfoSheet,
  TithiInfoSheet,
  YogaInfoSheet,
} from "@/components/sheets";
import { useCalendar } from "@/components/calendar/context";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabParamList } from "@/layout/types";
import { RootStackParamList } from "@/layout/types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";

type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "home">,
  StackScreenProps<RootStackParamList>
>;

export function Home({ navigation }: HomeProps) {
  const { selection } = useCalendar();
  const [showYogaSheet, setShowYogaSheet] = useState(false);
  const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);

  return (
    <>
      <WeekCalendar />
      <Pachanga
        onTithiClick={() => navigation.navigate("tithi_info")}
        onVaaraClick={() => {}}
        onYogaClick={() => setShowYogaSheet(true)}
        onMasaClick={() => {}}
        onNakshatraClick={() => setShowNakshatraSheet(true)}
        selectedDay={selection.date}
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
