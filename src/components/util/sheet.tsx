import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BACKDROP_VISIBLE_COLOR = "rgba(0, 0, 0, 0.5)";

const backdropStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

type BackdropProps = {
  animatedStyle: ViewStyle;
  onClick: () => void;
};

function Backdrop({ animatedStyle, onClick }: BackdropProps) {
  return (
    <AnimatedPressable
      style={[backdropStyles.container, animatedStyle]}
      onPress={onClick}
    />
  );
}

const sheetStyles = StyleSheet.create({
  content: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

export type BottomSheetRef = {
  hide: () => void;
};

type BottomSheetProps = {
  show: boolean;
  onHide: () => void;
  children: React.ReactNode;
  contentHeight: number;
  contentStyle?: ViewStyle;
};

const VELOCITY_THRESHOLD = 1000;

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ show, onHide, children, contentHeight, contentStyle }, ref) => {
    const maxTranslation = contentHeight;

    const lastTranslation = useSharedValue(0);
    const totalTranslation = useSharedValue(maxTranslation);

    useEffect(() => {
      if (show) {
        totalTranslation.value = withTiming(0);
      }
    }, [show]);

    const hide = () => {
      totalTranslation.value = withTiming(
        maxTranslation,
        {},
        (done) => {
          if (done) {
            runOnJS(onHide)();
          }
        }
      );
    };

    const panGesture = Gesture.Pan()
      .onStart(() => (lastTranslation.value = 0))
      .onUpdate(({ translationY }) => {
        const newTotalTranslation =
          totalTranslation.value + translationY - lastTranslation.value;
        if (newTotalTranslation >= 0) {
          totalTranslation.value = newTotalTranslation;
        }
        lastTranslation.value = translationY;
      })
      .onEnd(({ velocityY }) => {
        if (
          totalTranslation.value > maxTranslation / 2 ||
          velocityY >= VELOCITY_THRESHOLD
        ) {
          hide();
        } else {
          totalTranslation.value = withTiming(0);
        }
      })
      .runOnJS(true);

    useImperativeHandle(ref, () => ({ hide }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        totalTranslation.value,
        [0, maxTranslation],
        [BACKDROP_VISIBLE_COLOR, "rgba(0, 0, 0, 0)"]
      ),
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: totalTranslation.value }],
    }));

    return (
      show && (
        <>
          <Backdrop animatedStyle={backdropAnimatedStyle} onClick={hide} />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                sheetStyles.content,
                contentStyle,
                contentAnimatedStyle,
                { height: contentHeight },
              ]}
            >
              {children}
            </Animated.View>
          </GestureDetector>
        </>
      )
    );
  }
);
