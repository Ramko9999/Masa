import { truncateToDay } from "@/util/date";
import { useEffect, useState } from "react";
import { WeekCalendar } from "@/components/calendar";
import React from "react";
import { Pachanga } from "@/components/panchanga";
import {
  NakshatraInfoSheet,
  TithiInfoSheet,
  YogaInfoSheet,
} from "@/components/sheets";
import GeocentricModel from "@/components/geocentric-model";
import { Dimensions, View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Home() {
  const [selectedDay, setSelectedDay] = useState(truncateToDay(Date.now()));
  const [showTithiSheet, setShowTithiSheet] = useState(false);
  const [showYogaSheet, setShowYogaSheet] = useState(false);
  const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <View style={styles.modelContainer}>
          {/* Let the model take its natural size without a fixed height constraint */}
          <GeocentricModel />
        </View>
        <Pachanga
          onTithiClick={() => setShowTithiSheet(true)}
          onVaaraClick={() => {}}
          onYogaClick={() => setShowYogaSheet(true)}
          onMasaClick={() => {}}
          onNakshatraClick={() => setShowNakshatraSheet(true)}
          selectedDay={selectedDay}
        />
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modelContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
