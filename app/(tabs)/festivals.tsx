import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import Animated from "react-native-reanimated";
import { Festival, FestivalName } from "@/api/panchanga/core/festival";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ColorSchemeName,
  useColorScheme,
  ImageStyle,
} from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { getFestivals } from "@/api/panchanga";
import { getHumanReadableDateWithWeekday, truncateToDay, formatMonthYearFromTimestamp } from "@/util/date";
import { useLocation } from "@/context/location";
import { useGetColor, useThemedStyles } from "@/theme/color";
import { AppColor } from "@/theme/color";
import { useTranslation } from "react-i18next";
import { FESTIVAL_IMAGES } from "@/components/festival-images";
import { useRouter } from "expo-router";

const festivalsStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flex: 1,
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
    backgroundColor: useGetColor(AppColor.background, theme),
    gap: 20,
  },
  festivalsList: {
    ...StyleUtils.flexColumn(15),
    paddingBottom: "35%",
  },
  title: {
    paddingBottom: "2%",
  },
  festivalHeader: {
    paddingBottom: "1%",
  },
  festivalContent: {
    ...StyleUtils.flexColumn(5),
    paddingVertical: "2%",
  },
  festivalRow: {
    ...StyleUtils.flexRow(12),
    alignItems: 'center',
  },
  festivalInfo: {
    ...StyleUtils.flexColumn(4),
    flex: 1,
  },
  monthYearSeparator: {
    ...StyleUtils.flexRow(12),
    alignItems: 'center',
    paddingTop: "4%",
    paddingBottom: "3%",
  },
  monthYearLine: {
    flex: 1,
    height: 1,
    backgroundColor: useGetColor(AppColor.border, theme),
  },
  monthGroup: {
    ...StyleUtils.flexColumn(6),
  },
});

const festivalImageStyle: ImageStyle = {
  width: 56,
  height: 56,
  borderRadius: 8,
};

type FestivalItemProps = {
  festival: Festival;
  onPress: (festival: Festival) => void;
};

function FestivalItem({ festival, onPress }: FestivalItemProps) {
  const festivalsStyles = useThemedStyles(festivalsStylesFactory);
  const { i18n, t } = useTranslation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => onPress(festival)}
        style={festivalsStyles.festivalContent}
      >
        <View style={festivalsStyles.festivalRow}>
          <Animated.Image
            style={festivalImageStyle}
            source={FESTIVAL_IMAGES[festival.name as FestivalName]}
          />
          <View style={festivalsStyles.festivalInfo}>
            <Text large semibold>
              {t(`festivals.${festival.name}.title`)}
            </Text>
            <Text neutral tint semibold>
              {getHumanReadableDateWithWeekday(i18n.language, festival.date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function Festivals() {
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const festivals = getFestivals(location!);
  const festivalsStyles = useThemedStyles(festivalsStylesFactory);
  const { i18n, t } = useTranslation();
  const router = useRouter();
  
  const onFestivalPress = (festival: Festival) => {
    router.push({
      pathname: "/festival-details",
      params: { festival: JSON.stringify(festival) },
    });
  };

  // Group festivals by month/year
  const groupedFestivals = festivals.reduce((groups: { [key: string]: Festival[] }, festival) => {
    const monthYear = formatMonthYearFromTimestamp(i18n.language, festival.date);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(festival);
    return groups;
  }, {});

  return (
    <View style={festivalsStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
      >
        <View style={festivalsStyles.title}>
          <Text huge bold>
            {t("tabs.festivals")}
          </Text>
        </View>
        <View style={festivalsStyles.festivalsList}>
          {Object.entries(groupedFestivals).map(([monthYear, monthFestivals]) => (
            <View key={monthYear} style={festivalsStyles.monthGroup}>
              <View style={festivalsStyles.monthYearSeparator}>
                <Text large bold>
                  {monthYear}
                </Text>
                <View style={festivalsStyles.monthYearLine} />
              </View>
              {monthFestivals.map((festival, index) => (
                <FestivalItem
                  key={`${festival.name}-${index}`}
                  festival={festival}
                  onPress={onFestivalPress}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

