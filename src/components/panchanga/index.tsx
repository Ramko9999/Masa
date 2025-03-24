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
        <View style={{ flexDirection: "row", gap: 25 }}>
          <View>
            <Text bold tint>
              Sunrise
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}
            >
              <SunriseIcon fill="#FFBF00" />
              <Text style={{ textTransform: "uppercase" }}>
                {getHumanReadableTime(sunrise)}
              </Text>
            </View>
          </View>
          <View>
            <Text bold tint>
              Moonrise
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}
            >
              <MoonriseIcon fill={useGetColor(AppColor.accent)} />
              <Text style={{ textTransform: "uppercase" }}>
                {getHumanReadableTime(moonset)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 25 }}>
          <View>
            <Text bold tint>
              Sunset
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}
            >
              <SunsetIcon fill="#FFBF00" />
              <Text style={{ textTransform: "uppercase" }}>
                {getHumanReadableTime(sunset)}
              </Text>
            </View>
          </View>
          <View>
            <Text bold tint>
              Moonset
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}
            >
              <MoonsetIcon fill={useGetColor(AppColor.accent)} />
              <Text style={{ textTransform: "uppercase" }}>
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
