import { StyleSheet } from "react-native";
import { View } from "../../theme";
import { Card } from "../card";
import { MoonPhase, Tithi } from "../moon-phase";
import { truncateToDay } from "../../util/date";
import { useState } from "react";
import { WeekCalendar } from "../calendar";
import React from "react";

const panchangaStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

type PachangaProps = {
  onTithiClick?: () => void;
  onVaraClick?: () => void;
  onMasaClick?: () => void;
};

function Pachanga({ onTithiClick, onVaraClick, onMasaClick }: PachangaProps) {
  return (
    <View style={panchangaStyles.container}>
      <Card
        title="TITHI—LUNAR DAY"
        icon={<MoonPhase tithi={Tithi.trayodashi} width={28} height={28} />}
        mainText="Navami"
        caption="Changes to Amavasya at 4:45 PM"
        onClick={onTithiClick}
      />

      <Card
        title="VARA—DAY OF THE WEEK"
        mainText="Sanivaram"
        caption="Saturday"
      />

      <Card title="MASA-MONTH" mainText="Phaalgunamu" caption="March" />
    </View>
  );
}

type HomeActions = {
  onTithiClick?: () => void;
  onVaraClick?: () => void;
  onMasaClick?: () => void;
};

type HomeProps = {
  actions: HomeActions;
};

export function Home({ actions }: HomeProps) {
  const [selectedDay, setSelectedDay] = useState(truncateToDay(Date.now()));

  return (
    <>
      <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <Pachanga onTithiClick={actions.onTithiClick} />
    </>
  );
}
