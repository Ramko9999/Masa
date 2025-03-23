import { StyleSheet } from "react-native";
import { computePanchanga } from "@/api/panchanga";
import {
  getHumanReadableDate,
  getHumanReadableTime,
  truncateToDay,
} from "@/util/date";
import { getLocation } from "@/api/panchanga/location";
import { Text, View } from "@/theme";
import { Card } from "@/components/card";
import { MoonPhase } from "@/components/moon-phase";
import { StyleUtils } from "@/theme/style-utils";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { AppColor, useGetColor } from "@/theme/color";

const panchangaStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
    paddingVertical: "4%",
    marginBottom: "10%",
  },
  labelRow: {
    ...StyleUtils.flexRow(),
    width: "100%",
    justifyContent: "space-between",
  },
  riseAndSetLabel: {
    width: "30%",
  },
  riseAndSetTimeLabel: {
    ...StyleUtils.flexRow(),
    alignItems: "center",
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
  const {
    tithi,
    nakshatra,
    yoga,
    vaara,
    masa,
    sunrise,
    sunset,
    moonrise,
    moonset,
  } = computePanchanga(truncateToDay(selectedDay), getLocation());

  return (
    <View style={panchangaStyles.container}>
      <Card title="VAARA—DAY OF THE WEEK" mainText={vaara.name}>
        <View style={panchangaStyles.labelRow}>
          <Text bold style={panchangaStyles.riseAndSetLabel}>
            ☀️ Sun
          </Text>
          <View style={panchangaStyles.riseAndSetTimeLabel}>
            <ChevronUp fill={useGetColor(AppColor.accent)} />
            <Text>{getHumanReadableTime(sunrise)}</Text>
          </View>
          <View style={panchangaStyles.riseAndSetTimeLabel}>
            <ChevronDown fill={useGetColor(AppColor.accent)} />
            <Text>{getHumanReadableTime(sunset)}</Text>
          </View>
        </View>
        <View style={panchangaStyles.labelRow}>
          <Text bold style={panchangaStyles.riseAndSetLabel}>
            🌖 Moon
          </Text>
          <View style={panchangaStyles.riseAndSetTimeLabel}>
            <ChevronUp fill={useGetColor(AppColor.accent)} />
            <Text>{getHumanReadableTime(moonrise)}</Text>
          </View>
          <View style={panchangaStyles.riseAndSetTimeLabel}>
            <ChevronDown fill={useGetColor(AppColor.accent)} />
            <Text>{getHumanReadableTime(moonset)}</Text>
          </View>
        </View>
      </Card>
      <Card
        title="TITHI—LUNAR DAY"
        icon={<MoonPhase tithi={tithi[0]} width={28} height={28} />}
        mainText={tithi[0].name}
        caption={`until ${getHumanReadableDate(tithi[0].endDate)}`}
        onClick={onTithiClick}
        showExplainCaption
      />
      <Card
        title="NAKSHATRA-CONSTELLATION"
        mainText={nakshatra[0].name}
        caption={`until ${getHumanReadableDate(nakshatra[0].endDate)}`}
        onClick={onNakshatraClick}
        showExplainCaption
      />
      <Card
        title="YOGA-LUNISOLAR ALIGNMENT"
        mainText={yoga[0].name}
        caption={`until ${getHumanReadableDate(yoga[0].endDate)}`}
        onClick={onYogaClick}
        showExplainCaption
      />
      <Card title="MASA—LUNAR MONTH" onClick={onMasaClick} showExplainCaption>
        <View style={panchangaStyles.labelRow}>
          <Text semibold big>
            Purnimanta — {masa.purnimanta.name}
          </Text>
        </View>
        <View style={panchangaStyles.labelRow}>
          <Text semibold big>
            Amanta — {masa.amanta.name}
          </Text>
        </View>
      </Card>
    </View>
  );
}
