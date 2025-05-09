import {
  TouchableOpacity,
  StyleSheet,
  ColorSchemeName,
  useColorScheme,
} from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { useTranslation } from "react-i18next";
import { MuhurtamInterval } from "@/api/panchanga/core/muhurtam";
import { StyleUtils } from "@/theme/style-utils";

type MuhurtamProps = {
  muhurtams: MuhurtamInterval[];
};

const muhurtamStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(10),
    paddingTop: "1%",
  },
  row: {
    ...StyleUtils.flexRow(10),
    alignItems: "center",
    position: "relative", // Needed for absolute underline
  },
  past: {
    opacity: 0.4,
    textDecorationLine: "line-through",
  },
  future: {
    opacity: 0.7,
  },
  currentMuhurtamIndicator: {
    position: "absolute",
    left: 0,
    bottom: -5,
    height: 2,
    width: "100%",
    backgroundColor: useGetColor(AppColor.tint, theme), // Accent color
    borderRadius: 1,
  },
});

function Muhurtam({ muhurtams }: MuhurtamProps) {
  const sortedMuhurtams = [...muhurtams].sort(
    (a, b) => a.startTime - b.startTime
  );
  const muhurtamStyles = useThemedStyles(muhurtamStylesFactory);
  const now = Date.now();

  return (
    <View style={muhurtamStyles.container}>
      {sortedMuhurtams.map((m, idx) => {
        const isPast = m.endTime < now;
        const isCurrent = m.startTime <= now && now < m.endTime;
        const isFuture = m.startTime > now;
        const style = isPast
          ? muhurtamStyles.past
          : isFuture
          ? muhurtamStyles.future
          : undefined;

        return (
          <View key={idx} style={muhurtamStyles.row}>
            <View>
              <Text style={style}>
                {`${m.muhurtham} - ${getHumanReadableTime(
                  m.startTime
                )} to ${getHumanReadableTime(m.endTime)}`}
              </Text>
              {isCurrent && (
                <View style={muhurtamStyles.currentMuhurtamIndicator} />
              )}
            </View>
            <View />
          </View>
        );
      })}
    </View>
  );
}

type MuhurtamCardProps = {
  muhurtams: MuhurtamInterval[];
};

function MuhurtamCard({ muhurtams }: MuhurtamCardProps) {
  const now = Date.now();
  const current = muhurtams.find((m) => m.startTime <= now && now < m.endTime);
  const navigation = useNavigation();

  const caption = current ? current.isPositive ? "Auspicious Period" : "Inauspicious Period" : undefined;

  return (
    <Card
      title="MUHURTHAM—AUSPICIOUS TIMINGS"
      mainText={current?.muhurtham}
      caption={caption}
      onClick={() => navigation.navigate("muhurtam_info" as never)}
    >
      <Muhurtam muhurtams={muhurtams} />
    </Card>
  );
}

const panchangaStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    paddingHorizontal: "3%",
    paddingBottom: "35%",
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
  festivalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  intervals: TithiInterval[] | NakshatraInterval[],
  type: "tithi" | "nakshatra"
) {
  const { t, i18n } = useTranslation();

  return intervals
    .map((interval, index) => {
      // Check if there's a next interval to refer to
      const hasNextInterval = index < intervals.length - 1;
      const nextIntervalName = hasNextInterval
        ? intervals[index + 1].name
        : null;

      if (hasNextInterval) {
        return t("home.cards.interval_change", {
          nextName: t(`${type}.${nextIntervalName}`),
          time: getHumanReadableDate(i18n.language, interval.endDate, t),
        });
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
  const navigation = useNavigation();

  const panchangaStyles = useThemedStyles(panchangaStylesFactory);
  const theme = useColorScheme();

  const {
    tithi,
    nakshatra,
    vaara,
    masa,
    sunrise,
    sunset,
    moonrise,
    moonset,
    festivals,
    muhurtam,
  } = computePanchanga(truncateToDay(selectedDay), location!);

  const { t } = useTranslation();

  return (
    <View style={panchangaStyles.container}>

      <Card
        title={t("home.cards.vaara.title")}
        mainText={t(`vaara.${vaara.name}`)}
        onClick={onVaaraClick}
      >
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text semibold tint>
              {t("home.cards.vaara.sunrise")}
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
              {t("home.cards.vaara.moonrise")}
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
              {t("home.cards.vaara.sunset")}
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
              {t("home.cards.vaara.moonset")}
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
        title={t("home.cards.tithi.title")}
        mainText={t(`tithi.${tithi[0].name}`)}
        caption={getIntervalDescription(tithi, "tithi")}
        onClick={onTithiClick}
      />
      <Card
        title={t("home.cards.nakshatra.title")}
        mainText={t(`nakshatra.${nakshatra[0].name}`)}
        caption={getIntervalDescription(nakshatra, "nakshatra")}
        onClick={onNakshatraClick}
      />
      <Card title={t("home.cards.masa.title")} onClick={onMasaClick}>
        <View style={panchangaStyles.rowContainer}>
          <View>
            <Text semibold tint>
              {t("home.cards.masa.amanta")}
            </Text>
            <Text semibold larger>
              {t(`masa.${masa.amanta.name}`)}
            </Text>
          </View>
          <View>
            <Text semibold tint>
              {t("home.cards.masa.purnimanta")}
            </Text>
            <Text semibold larger>
              {t(`masa.${masa.purnimanta.name}`)}
            </Text>
          </View>
        </View>
      </Card>
      {festivals.length !== 0 && (
        <Card title={t("home.cards.festivals.title")}>
          {festivals.map((festival, index) => (
            <TouchableOpacity
              key={`${festival.name}-${index}`}
              onPress={() =>
                /* @ts-ignore */
                navigation.navigate("festival_details", { festival })
              }
            >
              <View style={panchangaStyles.festivalContainer}>
                <View style={{ flexDirection: "column", gap: 4 }}>
                  <Text bold larger>
                    {t(`festivals.${festival.name}.title`)}
                  </Text>
                  <View>
                    <Text>{t(`festivals.${festival.name}.caption`)}</Text>
                  </View>
                </View>
                <ChevronRight
                  size={24}
                  color={useGetColor(AppColor.tint, theme)}
                />
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </View>
  );
}
