import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { Festival } from "@/api/panchanga/core/festival";
import { StyleSheet, ScrollView } from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { getUpcomingFestivals } from "@/api/panchanga";
import { truncateToDay } from "@/util/date";
import { Card } from "@/components/card";
import { RootStackParamList, TabParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { useLocation } from "@/context/location";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const upcomingFestivalsStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
  },
  festivalsContainer: {
    paddingVertical: "4%",
    marginBottom: "10%",
  },
});

type UpcomingFestivalsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "upcoming_festivals">,
  StackScreenProps<RootStackParamList>
>;

export function UpcomingFestivals({ navigation }: UpcomingFestivalsProps) {
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const festivals = getUpcomingFestivals(truncateToDay(Date.now()), location!);
  const { handleScroll, handleScrollBegin, handleScrollEnd } = useScrollDirection();

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
      <ScrollView
        contentContainerStyle={[upcomingFestivalsStyles.festivalsContainer]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollBegin={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {festivals.map((festival, index) => (
          <Card
            key={`${festival.name}-${index}`}
            title={new Date(festival.date).toLocaleDateString("en-US", {
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
      </ScrollView>
    </View>
  );
}
