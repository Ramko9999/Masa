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
import { StyleUtils } from "@/theme/style-utils";
import { SunriseIcon } from "@/components/util/sunrise-icon";
import { AppColor, useGetColor } from "@/theme/color";
import { SunsetIcon } from "../util/sunset-icon";
import { MoonriseIcon } from "../util/moonrise-icon";
import { MoonsetIcon } from "../util/moonset-icon";

const panchangaStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
    paddingVertical: "4%",
    marginBottom: "10%",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 25,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  upperCaseText: {
    textTransform: "uppercase",
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
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text bold tint>
              Sunrise
            </Text>
            <View style={panchangaStyles.iconTextContainer}>
              <SunriseIcon />
              <Text style={panchangaStyles.upperCaseText}>
                {getHumanReadableTime(sunrise)}
              </Text>
            </View>
          </View>
          <View>
            <Text bold tint>
              Moonrise
            </Text>
            <View style={panchangaStyles.iconTextContainer}>
              <MoonriseIcon />
              <Text style={panchangaStyles.upperCaseText}>
                {getHumanReadableTime(moonset)}
              </Text>
            </View>
          </View>
        </View>
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text bold tint>
              Sunset
            </Text>
            <View style={panchangaStyles.iconTextContainer}>
              <SunsetIcon />
              <Text style={panchangaStyles.upperCaseText}>
                {getHumanReadableTime(sunset)}
              </Text>
            </View>
          </View>
          <View>
            <Text bold tint>
              Moonset
            </Text>
            <View style={panchangaStyles.iconTextContainer}>
              <MoonsetIcon />
              <Text style={panchangaStyles.upperCaseText}>
                {getHumanReadableTime(moonset)}
              </Text>
            </View>
          </View>
        </View>
      </Card>
      <Card
        title="TITHI—LUNAR DAY"
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
        <View>
          <Text semibold big>
            Purnimanta — {masa.purnimanta.name}
          </Text>
        </View>
        <View>
          <Text semibold big>
            Amanta — {masa.amanta.name}
          </Text>
        </View>
      </Card>
    </View>
  );
}
