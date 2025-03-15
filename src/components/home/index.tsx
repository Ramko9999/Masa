import { StyleSheet, Button } from "react-native";
import { View } from "../../theme";
import { Card } from "../card";
import { MoonPhase } from "../moon-phase";
import { truncateToDay } from "../../util/date";
import { useEffect, useState } from "react";
import { WeekCalendar } from "../calendar";
import React from "react";
import {
  PanchangaData,
  getPanchangaForDate,
  formatTithiChangeTime,
  Tithi
} from "../../util/panchanga";
import { sendTestNotification, cancelAllNotifications } from "../../util/notifications";

const panchangaStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});

type PachangaProps = {
  onTithiClick?: () => void;
  onVaraClick?: () => void;
  onMasaClick?: () => void;
  panchangaData?: PanchangaData | null;
  isLoading: boolean;
  selectedDay: number;
  error?: string | null;
};

function Pachanga({
  onTithiClick,
  onVaraClick,
  onMasaClick,
  panchangaData,
  isLoading,
  selectedDay,
  error,
}: PachangaProps) {
  if (isLoading) {
    return (
      <View style={panchangaStyles.container}>
        <Card
          title="TITHI—LUNAR DAY"
          mainText="Loading..."
          caption="Loading panchanga data"
        />
        <Card
          title="VAARA—DAY OF THE WEEK"
          mainText="Loading..."
          caption="Loading panchanga data"
        />
        <Card
          title="MASA—LUNAR MONTH"
          mainText="Loading..."
          caption="Loading panchanga data"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={panchangaStyles.container}>
        <Card title="TITHI—LUNAR DAY" mainText="Error" caption={error} />
        <Card
          title="VAARA—DAY OF THE WEEK"
          mainText="Error"
          caption="Could not load panchanga data"
        />
        <Card
          title="MASA—LUNAR MONTH"
          mainText="Error"
          caption="Could not load panchanga data"
        />
      </View>
    );
  }

  if (!panchangaData) {
    const selectedDate = new Date(selectedDay);
    const dateStr = selectedDate.toLocaleDateString();

    return (
      <View style={panchangaStyles.container}>
        <Card
          title="TITHI—LUNAR DAY"
          icon={<MoonPhase tithi={Tithi.purnima} width={28} height={28} />}
          mainText="No Data"
          caption={`No data for ${dateStr}`}
          onClick={onTithiClick}
        />
        <Card
          title="VAARA—DAY OF THE WEEK"
          mainText="No Data"
          caption={`No data for ${dateStr}`}
          onClick={onVaraClick}
        />
        <Card
          title="MASA—LUNAR MONTH"
          mainText="No Data"
          caption={`No data for ${dateStr}`}
          onClick={onMasaClick}
        />
      </View>
    );
  }

  // Get the current tithi (first one in the array)
  const currentTithi = panchangaData.tithi[0];
  const nextTithi =
    panchangaData.tithi.length > 1 ? panchangaData.tithi[1] : undefined;
  const tithiChangeCaption = nextTithi
    ? formatTithiChangeTime(currentTithi, nextTithi)
    : "";

  // Get the month name from the selected date
  const selectedDate = new Date(selectedDay);
  const gregorianMonth = selectedDate.toLocaleString("default", { month: "long" });

  return (
    <View style={panchangaStyles.container}>
      <Card
        title="TITHI—LUNAR DAY"
        icon={<MoonPhase tithi={currentTithi.enum} width={28} height={28} />}
        mainText={currentTithi.name}
        caption={tithiChangeCaption}
        onClick={onTithiClick}
      />

      <Card
        title="VAARA—DAY OF THE WEEK"
        mainText={panchangaData.vaara.name}
        caption={panchangaData.vaara.sub_text}
        onClick={onVaraClick}
      />

      <Card
        title="MASA—LUNAR MONTH"
        mainText={panchangaData.masa.purnima}
        caption={gregorianMonth}
        onClick={onMasaClick}
      />
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
  const [panchangaData, setPanchangaData] = useState<PanchangaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTestNotifications = async () => {
    const result = await sendTestNotification();
    console.log("Scheduled notifications with IDs:", result);
  };

  // Load panchanga data when selected day changes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          `Loading panchanga data for date: ${new Date(
            selectedDay
          ).toISOString()}`
        );
        const data = await getPanchangaForDate(selectedDay);

        if (data) {
          console.log(
            `Successfully loaded panchanga data for ${new Date(
              selectedDay
            ).toLocaleDateString()}`
          );
          setPanchangaData(data);
        } else {
          console.warn(
            `No panchanga data found for ${new Date(
              selectedDay
            ).toLocaleDateString()}`
          );
          setPanchangaData(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error(`Failed to load panchanga data: ${errorMessage}`, err);
        setError(errorMessage);
        setPanchangaData(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedDay]);

  return (
    <>
      <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
        <Button 
          title="Clear Notifications" 
          onPress={cancelAllNotifications}
        />
        <Button 
          title="Test Notifications" 
          onPress={handleTestNotifications}
        />
      </View>
      <Pachanga
        onTithiClick={actions.onTithiClick}
        onVaraClick={actions.onVaraClick}
        onMasaClick={actions.onMasaClick}
        panchangaData={panchangaData}
        isLoading={isLoading}
        selectedDay={selectedDay}
        error={error}
      />
    </>
  );
}
