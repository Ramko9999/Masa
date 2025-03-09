import { StyleSheet } from "react-native";
import { View } from "../../theme";
import { Card } from "../card";
import { MoonPhase, Tithi } from "../moon-phase";
import { truncateToDay } from "../../util/date";
import { useEffect, useState } from "react";
import { WeekCalendar } from "../calendar";
import React from "react";
import { PanchangaData, getPanchangaForDate, formatTithiChangeTime, mapTithiToEnum } from "../../util/panchanga";

const panchangaStyles = StyleSheet.create({
  container: {
    padding: 16,
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
  error 
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
          title="VARA—DAY OF THE WEEK"
          mainText="Loading..."
          caption="Loading panchanga data"
        />
        <Card 
          title="MASA-MONTH" 
          mainText="Loading..." 
          caption="Loading panchanga data" 
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={panchangaStyles.container}>
        <Card
          title="TITHI—LUNAR DAY"
          mainText="Error"
          caption={error}
        />
        <Card
          title="VARA—DAY OF THE WEEK"
          mainText="Error"
          caption="Could not load panchanga data"
        />
        <Card 
          title="MASA-MONTH" 
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
          title="VARA—DAY OF THE WEEK"
          mainText="No Data"
          caption={`No data for ${dateStr}`}
        />
        <Card 
          title="MASA-MONTH" 
          mainText="No Data" 
          caption={`No data for ${dateStr}`} 
        />
      </View>
    );
  }

  // Get the current tithi (first one in the array)
  const currentTithi = panchangaData.tithi[0];
  const nextTithi = panchangaData.tithi.length > 1 ? panchangaData.tithi[1] : undefined;
  const tithiChangeCaption = nextTithi ? formatTithiChangeTime(currentTithi, nextTithi) : "";
  
  // Map tithi name to enum for the icon based on paksha
  const tithiEnum = mapTithiToEnum(currentTithi.name, panchangaData.paksha);
  
  // Get the month name from the selected date
  const selectedDate = new Date(selectedDay);
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });

  return (
    <View style={panchangaStyles.container}>
      <Card
        title="TITHI—LUNAR DAY"
        icon={<MoonPhase tithi={tithiEnum} width={28} height={28} />}
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
        title="MASA-MONTH" 
        mainText={panchangaData.masa.purnima} 
        caption={monthName}
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

  // Load panchanga data when selected day changes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Loading panchanga data for date: ${new Date(selectedDay).toISOString()}`);
        const data = await getPanchangaForDate(selectedDay);
        
        if (data) {
          console.log(`Successfully loaded panchanga data for ${new Date(selectedDay).toLocaleDateString()}`);
          setPanchangaData(data);
        } else {
          console.warn(`No panchanga data found for ${new Date(selectedDay).toLocaleDateString()}`);
          setPanchangaData(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
