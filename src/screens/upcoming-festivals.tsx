import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { Festival } from "@/api/panchanga/core/festival";
import {
  useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { StyleUtils } from "@/theme/style-utils";
import { Location } from "@/api/panchanga/location";
import { upcomingFestivals } from "@/api/panchanga";
import { getHumanReadableDate, truncateToDay } from "@/util/date";
import { Card } from "@/components/card";
const upcomingFestivalsStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
  },
  festivalsContaine: {
    paddingVertical: "4%",
    marginBottom: "10%",
  },
});

export function UpcomingFestivals({
  onFestivalPress,
  location,
}: {
  onFestivalPress: (festival: Festival) => void;
  location: Location;
}) {
  const insets = useSafeAreaInsets();
  const festivals = upcomingFestivals(truncateToDay(Date.now()), location);

  return (
    <View
      style={[
        upcomingFestivalsStyles.container,
        { paddingTop: insets.top + 20 },
      ]}
    >
      <Text bold huge>
        Upcoming Festivals
      </Text>
      <View style={upcomingFestivalsStyles.festivalsContaine}>
        {festivals.map((festival, index) => (
          <Card
            key={`${festival.name}-${index}`}
            title={festival.date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            mainText={festival.name}
            caption={festival.caption}
            onClick={() => onFestivalPress(festival)}
          />
        ))}
      </View>
    </View>
  );
}
