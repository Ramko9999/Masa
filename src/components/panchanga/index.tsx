import { StyleSheet } from "react-native";
import { computePanchanga } from "../../api/panchanga";
import { getHumanReadableDate, truncateToDay } from "../../util/date";
import { getLocation } from "../../api/panchanga/location";
import { View } from "../../theme";
import { Card } from "../card";
import { MoonPhase } from "../moon-phase";

const panchangaStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
    paddingVertical: "2%",
  },
});

type PachangaProps = {
  onTithiClick?: () => void;
  onNakshatraClick?: () => void;
  onVaaraClick?: () => void;
  onYogaClick?: () => void;
  onMasaClick?: () => void;
  onKaranaClick?: () => void;
  selectedDay: number;
};

export function Pachanga({
  onTithiClick,
  onNakshatraClick,
  onVaaraClick,
  onYogaClick,
  onMasaClick,
  onKaranaClick,
  selectedDay,
}: PachangaProps) {
  const { tithi, nakshatra, yoga, vaara, masa } = computePanchanga(
    truncateToDay(selectedDay),
    getLocation()
  );

  const karana = tithi[0].karana;

  return (
    <View style={panchangaStyles.container}>
      <Card
        title="TITHI—LUNAR DAY"
        icon={<MoonPhase tithi={tithi[0]} width={28} height={28} />}
        mainText={tithi[0].name}
        caption={`until ${getHumanReadableDate(tithi[0].endDate)}`}
        onClick={onTithiClick}
      />
      <Card
        title="KARANA-LUNAR HALF-DAY"
        mainText={karana[0].name}
        caption={`until ${getHumanReadableDate(karana[0].endDate)}`}
        onClick={onKaranaClick}
      />
      <Card
        title="NAKSHATRA-CONSTELLATION"
        mainText={nakshatra[0].name}
        caption={`until ${getHumanReadableDate(nakshatra[0].endDate)}`}
        onClick={onNakshatraClick}
      />
      <Card
        title="YOGA-LUNISOLAR ALIGNMENT"
        mainText={yoga[0].name}
        caption={`until ${getHumanReadableDate(yoga[0].endDate)}`}
        onClick={onYogaClick}
      />

      <Card
        title="VAARA—DAY OF THE WEEK"
        mainText={vaara.name}
        onClick={onVaaraClick}
      />

      <Card
        title="MASA—LUNAR MONTH"
        mainText={masa.name}
        onClick={onMasaClick}
      />
    </View>
  );
}
