import { useState } from "react";
import { BottomSheet } from "../components/util/sheet";
import { View, Text } from "../theme";
import { StyleUtils } from "../theme/style-utils";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { WeekCalendar } from "../components/calendar";
import { truncateToDay } from "../util/date";
import { Card } from "../components/card";
import { useGetColor } from "../theme/color";
import { MoonPhase, Tithi } from "../components/moon-phase";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(truncateToDay(Date.now()));
  return (
    <>
      <View style={{ flex: 1, backgroundColor: useGetColor("background") }}>
        <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        <View style={styles.container}>
          <Card 
            title="TITHI—LUNAR DAY"
            icon={<MoonPhase tithi={Tithi.trayodashi} width={28} height={28} />}
            mainText="Navami"
            caption="Changes to Amavasya at 4:45 PM"
          />

          <Card 
            title="VARA—DAY OF THE WEEK"
            mainText="Sanivaram"
            caption="Saturday"
          />

          <Card 
            title="MASA-MONTH"
            mainText="Phaalgunamu"
            caption="March"
          />
        </View>
      </View>
      <Dialog show={showDialog} onHide={() => setShowDialog(false)} />
    </>
  );
}

const dialogStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    backgroundColor: "white",
  },
});

type DialogProps = {
  show: boolean;
  onHide: () => void;
};

function Dialog({ show, onHide }: DialogProps) {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet
      show={show}
      onHide={onHide}
      contentHeight={height * 0.4}
      contentStyle={dialogStyles.container}
    >
      <Text>Dialog</Text>
    </BottomSheet>
  );
}
