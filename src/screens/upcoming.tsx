import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "../theme";
import { useGetColor } from "../theme/color";
import * as Panchanga from "../api/panchanga";
import { getLocation } from "../api/panchanga/location";
import { Festival } from "../api/panchanga/core/festival";
import { Dimensions } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const { height } = Dimensions.get("screen");
const _spacing = 8;
const _itemSize = height * 0.52;
const _itemFullSize = _itemSize + _spacing * 2;

function AnimatedCard({
  festival,
}: {
  festival: Festival;
  index: number;
  scrollY: SharedValue<number>;
}) {

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#F3F3F3",
          flex: 1,
          elevation: 2,
          height: _itemSize,
          padding: _spacing * 2,
          borderRadius: 8,
          gap: _spacing,
        },
      ]}
    >
      <Animated.Image 
        style={{
          width: '100%',
          height: _itemSize * 0.7,
          resizeMode: "cover",
          alignSelf: 'center',
          borderRadius: 8
        }}
        source={require("../assets/shivaratri.png")}
      />
      <View style={{ gap: _spacing }}>
        <Text bold>{festival.name}</Text>
        <Text
          numberOfLines={3}
          style={{ color: useGetColor("text-primary-tint-2") }}
        >
          {festival.caption}
        </Text>
      </View>
      <Text bold small style={{ color: useGetColor("text-primary-tint-1") }}>
        {festival.date.toLocaleDateString()}
      </Text>
    </Animated.View>
  );
}

function VerticalList({ festivals }: { festivals: Festival[] }) {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y / _itemFullSize;
  });

  return (
    <Animated.FlatList
      data={festivals}
      contentContainerStyle={{
        paddingHorizontal: _spacing * 3,
        paddingBottom: _itemFullSize / 4,
        gap: _spacing * 2,
      }}
      renderItem={({ item, index }) => (
        <AnimatedCard festival={item} index={index} scrollY={scrollY} />
      )}
      snapToInterval={_itemFullSize}
      decelerationRate="fast"
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
}

export function Upcoming() {
  const insets = useSafeAreaInsets();
  const festivals = Panchanga.upcomingFestivals(Date.now(), getLocation());

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: useGetColor("background"),
        paddingTop: insets.top + 20,
        justifyContent: "center",
        gap: 16
      }}
    >
      <Text bold large style={{ paddingHorizontal: _spacing * 3 }}>
        Festivals
      </Text>
      <VerticalList festivals={festivals} />
    </View>
  );
}
