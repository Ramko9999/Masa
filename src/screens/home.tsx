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
          <Card title="TITHI—LUNAR DAY">
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <MoonPhase tithi={Tithi.trayodashi} />
              <View>
                <Text style={{ fontSize: 24, lineHeight: 24 }}>Navami</Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: useGetColor("text-primary-tint-1"),
                  }}
                >
                  Changes to Amavasya at 4:45 PM
                </Text>
              </View>
            </View>
          </Card>
          <Card title="VARA—DAY OF THE WEEK">
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View>
                <Text style={{ fontSize: 24, lineHeight: 24 }}>Sanivaram</Text>
              </View>
            </View>
          </Card>
          <Card title="MASA-MONTH">
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View>
                <Text style={{ fontSize: 24, lineHeight: 24 }}>
                  Phaalgunamu
                </Text>
              </View>
            </View>
          </Card>
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
