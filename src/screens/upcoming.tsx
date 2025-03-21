import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "../theme";
import { useGetColor } from "../theme/color";
import * as Panchanga from "../api/panchanga";
import { getLocation } from "../api/panchanga/location";
import { STATIC_FESTIVALS, Festival } from "../api/panchanga/core/festival";
import { useWindowDimensions, TouchableOpacity } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const festivalImages: Record<string, any> = {
  "makar-sankranti.png": require("../../assets/festivals/makar-sankranti.png"),
  "vasant-panchami.png": require("../../assets/festivals/vasant-panchami.png"),
  "maha-shivaratri.png": require("../../assets/festivals/maha-shivaratri.png"),
  "holi.png": require("../../assets/festivals/holi.png"),
  "ugadi.png": require("../../assets/festivals/ugadi.png"),
  "rama-navami.png": require("../../assets/festivals/rama-navami.png"),
  "hanuman-jayanti.png": require("../../assets/festivals/hanuman-jayanti.png"),
  "akshaya-tritiya.png": require("../../assets/festivals/akshaya-tritiya.png"),
  "guru-purnima.png": require("../../assets/festivals/guru-purnima.png"),
  "naga-panchami.png": require("../../assets/festivals/naga-panchami.png"),
  "raksha-bandhan.png": require("../../assets/festivals/raksha-bandhan.png"),
  "krishna-janmashtami.png": require("../../assets/festivals/krishna-janmashtami.png"),
  "ganesh-chaturthi.png": require("../../assets/festivals/ganesh-chaturthi.png"),
  "durga-puja.png": require("../../assets/festivals/durga-puja.png"),
  "dussehra.png": require("../../assets/festivals/dussehra.png"),
  "karva-chauth.png": require("../../assets/festivals/karva-chauth.png"),
  "diwali.png": require("../../assets/festivals/diwali.png"),
};

function AnimatedCard({
  festival,
  index,
  scrollY,
  itemSize,
  spacing,
  onPress,
}: {
  festival: Festival;
  index: number;
  scrollY: SharedValue<number>;
  itemSize: number;
  spacing: number;
  onPress: (festival: Festival) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(festival)}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "#F7F6F8",
            flex: 1,
            height: itemSize,
            elevation: 1,
            padding: spacing * 2,
            borderRadius: 8,
            gap: spacing,
          },
        ]}
      >
        <Animated.Image
          style={{
            width: "100%",
            height: itemSize * 0.78,
            resizeMode: "cover",
            alignSelf: "center",
            borderRadius: 8,
          }}
          source={festivalImages[festival.image]}
        />
        <View style={{ gap: spacing / 2 }}>
          <Text bold>{festival.name}</Text>
          <Text numberOfLines={1} style={{ color: useGetColor("text-primary") }}>
            {festival.caption}
          </Text>
          <Text bold small style={{ color: useGetColor("text-primary-tint-1") }}>
            {festival.date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function VerticalList({ 
  festivals, 
  onFestivalPress 
}: { 
  festivals: Festival[],
  onFestivalPress: (festival: Festival) => void 
}) {
  const { height, width } = useWindowDimensions();
  const spacing = width * 0.02; // 2% of screen width
  const itemSize = height * 0.65;
  const itemFullSize = itemSize + spacing * 2;

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y / itemFullSize;
  });

  return (
    <Animated.FlatList
      data={festivals}
      contentContainerStyle={{
        paddingHorizontal: spacing * 3,
        paddingBottom: itemFullSize / 4,
        gap: spacing * 2,
      }}
      renderItem={({ item, index }) => (
        <AnimatedCard
          festival={item}
          index={index}
          scrollY={scrollY}
          itemSize={itemSize}
          spacing={spacing}
          onPress={onFestivalPress}
        />
      )}
      snapToInterval={itemFullSize}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
}

export function Upcoming({ 
  onFestivalPress 
}: { 
  onFestivalPress: (festival: Festival) => void 
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const spacing = width * 0.02; // 2% of screen width

  // const festivals = Panchanga.upcomingFestivals(Date.now(), getLocation());
  const festivals = STATIC_FESTIVALS;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: useGetColor("background"),
        paddingTop: insets.top + width * 0.05, // 5% of screen width
      }}
    >
      <View
        style={{ paddingHorizontal: spacing * 3, marginBottom: width * 0.04 }}
      >
        <Text bold large>
          Festivals
        </Text>
      </View>
      <VerticalList festivals={festivals} onFestivalPress={onFestivalPress} />
    </View>
  );
}
