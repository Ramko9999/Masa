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

const upcomingFestivalsStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
  },
});

export function UpcomingFestivals({
  onFestivalPress,
}: {
  onFestivalPress: (festival: Festival) => void;
}) {
  const insets = useSafeAreaInsets();

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
    </View>
  );
}
