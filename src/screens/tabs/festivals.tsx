import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { Festival } from "@/api/panchanga/core/festival";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ColorSchemeName,
  useColorScheme,
} from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { getFestivals } from "@/api/panchanga";
import { getHumanReadableDateWithWeekday, truncateToDay } from "@/util/date";
import { RootStackParamList, TabParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { useLocation } from "@/context/location";
import { useGetColor, useThemedStyles } from "@/theme/color";
import { AppColor } from "@/theme/color";
import { useTranslation } from "node_modules/react-i18next";

const festivalsStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
    backgroundColor: useGetColor(AppColor.background, theme),
    gap: 20,
  },
  festivalsList: {
    ...StyleUtils.flexColumn(15),
    paddingBottom: "35%",
  },
  festivalHeader: {
    paddingBottom: "1%",
    borderBottomWidth: 1,
  },
  festivalContent: {
    ...StyleUtils.flexColumn(5),
    paddingTop: "2%",
  },
});

type FestivalsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "festivals">,
  StackScreenProps<RootStackParamList>
>;

type FestivalItemProps = {
  festival: Festival;
  onPress: (festival: Festival) => void;
};

function FestivalItem({ festival, onPress }: FestivalItemProps) {
  const festivalsStyles = useThemedStyles(festivalsStylesFactory);
  const theme = useColorScheme();
  const { i18n, t } = useTranslation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => onPress(festival)}
        style={festivalsStyles.festivalContent}
      >
        <View
          style={[
            festivalsStyles.festivalHeader,
            { borderBottomColor: useGetColor(AppColor.border, theme) },
          ]}
        >
          <Text neutral tint semibold>
            {getHumanReadableDateWithWeekday(i18n.language, festival.date)}
          </Text>
        </View>
        <Text large semibold>
          {t(`festivals.${festival.name}.title`)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function Festivals({ navigation }: FestivalsProps) {
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const festivals = getFestivals(location!);
  const festivalsStyles = useThemedStyles(festivalsStylesFactory);
  const onFestivalPress = (festival: Festival) => {
    navigation.navigate("festival_details", { festival });
  };

  const { t } = useTranslation();

  return (
    <View
      style={[
        festivalsStyles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text huge bold>
        {t("tabs.festivals")}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={festivalsStyles.festivalsList}>
          {festivals.map((festival, index) => (
            <FestivalItem
              key={`${festival.name}-${index}`}
              festival={festival}
              onPress={onFestivalPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
