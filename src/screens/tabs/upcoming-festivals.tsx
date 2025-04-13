import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { Festival } from "@/api/panchanga/core/festival";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { getUpcomingFestivals } from "@/api/panchanga";
import { getHumanReadableDateWithWeekday, truncateToDay } from "@/util/date";
import { RootStackParamList, TabParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { useLocation } from "@/context/location";
import { useGetColor } from "@/theme/color";
import { AppColor } from "@/theme/color";

const upcomingFestivalsStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
    gap: 20,
  },
  festivalsList: {
    ...StyleUtils.flexColumn(20),
    paddingBottom: "35%",
  },
  festivalHeader: {
    paddingBottom: "2%",
    borderBottomWidth: 1,
  },
  festivalContent: {
    paddingTop: "2%",
  },
});

type UpcomingFestivalsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "upcoming_festivals">,
  StackScreenProps<RootStackParamList>
>;

type FestivalItemProps = {
  festival: Festival;
  onPress: (festival: Festival) => void;
};

function FestivalItem({ festival, onPress }: FestivalItemProps) {
  return (
    <View>
      <View
        style={[
          upcomingFestivalsStyles.festivalHeader,
          { borderBottomColor: useGetColor(AppColor.border) },
        ]}
      >
        <Text neutral tint semibold>
          {getHumanReadableDateWithWeekday(festival.date)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onPress(festival)}
        style={upcomingFestivalsStyles.festivalContent}
      >
        <Text large semibold>
          {festival.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function UpcomingFestivals({ navigation }: UpcomingFestivalsProps) {
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const festivals = getUpcomingFestivals(truncateToDay(Date.now()), location!);

  const onFestivalPress = (festival: Festival) => {
    navigation.navigate("festival_details", { festival });
  };

  return (
    <View
      style={[
        upcomingFestivalsStyles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text huge bold>
        Upcoming Festivals
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={upcomingFestivalsStyles.festivalsList}>
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
