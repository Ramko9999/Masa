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
  onYogaClick?: () => void;
  onMasaClick?: () => void;
  onKaranaClick?: () => void;
  selectedDay: number;
};

// todo: verify moon rise and set times
export function Pachanga({
  onTithiClick,
  onNakshatraClick,
  onVaaraClick,
  onYogaClick,
  onMasaClick,
  onKaranaClick,
  selectedDay,
}: PachangaProps) {
  const { location } = useLocation();

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
  } = computePanchanga(truncateToDay(selectedDay), location!);

  return (
    <View style={panchangaStyles.container}>
      <Card
        title="VAARA—DAY OF THE WEEK"
        mainText={vaara.name}
        showExplainCaption
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
          <Text semibold larger>
            Purnimanta — {masa.purnimanta.name}
          </Text>
        </View>
        <View>
          <Text semibold larger>
            Amanta — {masa.amanta.name}
          </Text>
        </View>
      </Card>
    </View>
  );
}
