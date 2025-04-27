import {
  ColorSchemeName,
  Pressable,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const backdropStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: useGetColor(AppColor.primary, theme),
    zIndex: 1,
  },
});

type BackdropProps = {
  animatedStyle: ViewStyle;
  onClick: () => void;
};

function Backdrop({ animatedStyle, onClick }: BackdropProps) {
  const backdropStyles = useThemedStyles(backdropStylesFactory);
  return (
    <AnimatedPressable
      style={[backdropStyles.container, animatedStyle]}
      onPress={onClick}
    />
  );
}

const sheetStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
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
  hitslopHeight?: number;
};

const VELOCITY_THRESHOLD = 1000;

// Opening animation - Quick start, smooth end, no overshoot
const SNAP_OPEN_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.33, 0.1, 0.25, 1.0),
};

// Closing animation - Quick acceleration, controlled deceleration
const SNAP_CLOSE_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
};

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    { show, onHide, children, contentHeight, contentStyle, hitslopHeight },
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const maxTranslation = contentHeight + insets.bottom;

    const lastTranslation = useSharedValue(0);
    const totalTranslation = useSharedValue(maxTranslation);

    const sheetStyles = useThemedStyles(sheetStylesFactory);


    useEffect(() => {
      if (show) {
        totalTranslation.value = withTiming(0, SNAP_OPEN_CONFIG);
      }
    }, [show]);

    const hide = () => {
      totalTranslation.value = withTiming(
        maxTranslation,
        SNAP_CLOSE_CONFIG,
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
          totalTranslation.value = withTiming(0, SNAP_OPEN_CONFIG);
        }
      })
      .hitSlop({ top: 0, height: hitslopHeight ?? contentHeight })
      .runOnJS(true);

    useImperativeHandle(ref, () => ({ hide }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        totalTranslation.value,
        [0, maxTranslation],
        [0.5, 0]
      ),
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: totalTranslation.value }],
    }));

    const theme = useColorScheme();

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
                {
                  height: contentHeight,
                  paddingBottom: insets.bottom,
                  backgroundColor: useGetColor(AppColor.background, theme),
                },
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
