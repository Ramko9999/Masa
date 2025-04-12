import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { View } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.6;

const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    backgroundColor: useGetColor(AppColor.background),
  },
  content: {
    paddingHorizontal: "3%",
    backgroundColor: useGetColor(AppColor.background),
  },
});

type ParallaxScrollViewProps = PropsWithChildren<{
  headerImage: ReactElement;
}>;

export function ParallaxScrollView({
  children,
  headerImage,
}: ParallaxScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1]
        ),
      },
    ],
  }));

  return (
    <View style={parallaxScrollViewStyles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={parallaxScrollViewStyles.scrollContent}
      >
        <Animated.View
          style={[parallaxScrollViewStyles.header, headerAnimatedStyle]}
        >
          {headerImage}
        </Animated.View>
        <View style={parallaxScrollViewStyles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}
