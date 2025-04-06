import { StyleSheet } from "react-native";
import { computePanchanga } from "@/api/panchanga";
import {
  getHumanReadableDate,
  getHumanReadableTime,
  truncateToDay,
} from "@/util/date";
import { Text, View } from "@/theme";
import { Card } from "@/components/card";
import {
  SunriseIcon,
  SunsetIcon,
  MoonriseIcon,
  MoonsetIcon,
} from "@/theme/icon";
import { useLocation } from "@/context/location";
import { TithiInterval } from "@/api/panchanga/core/tithi";
import { NakshatraInterval } from "@/api/panchanga/core/nakshatra";

const panchangaStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
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
  onMasaClick?: () => void;
  selectedDay: number;
};

function getIntervalDescription(
  intervals: TithiInterval[] | NakshatraInterval[]
) {
  return intervals
    .map((interval, index) => {
      // Check if there's a next interval to refer to
      const hasNextInterval = index < intervals.length - 1;
      const nextIntervalName = hasNextInterval
        ? intervals[index + 1].name
        : null;

      if (hasNextInterval) {
        return `changes to ${nextIntervalName} at ${getHumanReadableDate(
          interval.endDate
        )}`;
      } else {
        return "";
      }
    })
    .filter((value) => value.trim().length > 0)
    .join("\n");
}

// todo: verify moon rise and set times
export function Pachanga({
  onTithiClick,
  onNakshatraClick,
  onVaaraClick,
  onMasaClick,
  selectedDay,
}: PachangaProps) {
  const { location } = useLocation();

  const { tithi, nakshatra, vaara, masa, sunrise, sunset, moonrise, moonset } =
    computePanchanga(truncateToDay(selectedDay), location!);

  return (
    <View style={panchangaStyles.container}>
      <Card
        title="VAARA—DAY OF THE WEEK"
        mainText={vaara.name}
        onClick={onVaaraClick}
      >
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text semibold tint>
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
            <Text semibold tint>
              Moonrise
            </Text>
            <View style={panchangaStyles.iconTextContainer}>
              <MoonriseIcon />
              <Text style={panchangaStyles.upperCaseText}>
                {getHumanReadableTime(moonrise)}
              </Text>
            </View>
          </View>
        </View>
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text semibold tint>
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
            <Text semibold tint>
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
        caption={getIntervalDescription(tithi)}
        onClick={onTithiClick}
      />
      <Card
        title="NAKSHATRA-CONSTELLATION"
        mainText={nakshatra[0].name}
        caption={getIntervalDescription(nakshatra)}
        onClick={onNakshatraClick}
      />
      <Card title="MASA—LUNAR MONTH" onClick={onMasaClick}>
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text semibold tint>
              Amanta
            </Text>
            <Text semibold larger>
              {masa.amanta.name}
            </Text>
          </View>
          <View>
            <Text semibold tint>
              Purnimanta
            </Text>
            <Text semibold larger>
              {masa.purnimanta.name}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
