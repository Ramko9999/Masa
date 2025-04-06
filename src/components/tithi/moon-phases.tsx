import React, { forwardRef, useState } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";
import { TithiIndex, TITHI_NAMES } from "@/api/panchanga/core/tithi";
import { AppColor } from "@/theme/color";
import { useGetColor } from "@/theme/color";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  useDerivedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Text } from "@/theme";

export interface MoonProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  tithiIndex: TithiIndex;
}

// Add a type for the component props
interface MoonSliderProps {
  onProgressChange?: (progress: number) => void;
}

const moonSliderStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: 20,
    gap: 10,
    alignItems: "center",
  },
  sliderTrack: {
    width: "100%",
    height: 5,
    backgroundColor: useGetColor(AppColor.border),
    borderRadius: 5,
    justifyContent: "center",
  },
  sliderHandle: {
    backgroundColor: useGetColor(AppColor.tint),
    width: 15,
    height: 15,
    borderRadius: 10,
    position: "absolute",
    left: 0,
    elevation: 2,
  },
  moonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export const MoonSlider = ({ onProgressChange }: MoonSliderProps) => {
  const [currentTithiIndex, setCurrentTithiIndex] = useState<TithiIndex>(
    TithiIndex.ShuklaPratipada
  );

  const offset = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(100);
  const handleSize = 15;

  const progress = useDerivedValue(() => {
    return offset.value / (trackWidth - handleSize);
  });

  useAnimatedReaction(
    () => progress.value,
    (currentProgress) => {
      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, currentProgress));

      if (onProgressChange) {
        runOnJS(onProgressChange)(clampedProgress);
      }

      // Calculate the tithi index from progress
      const tithiIndex = Math.floor(clampedProgress * 30);
      const boundedTithiIndex = Math.min(
        29,
        Math.max(0, tithiIndex)
      ) as TithiIndex;

      runOnJS(setCurrentTithiIndex)(boundedTithiIndex);
    }
  );

  const pan = Gesture.Pan().onChange((event) => {
    const newValue = offset.value + event.changeX;
    offset.value = Math.max(0, Math.min(trackWidth - handleSize, newValue));
  });

  const handleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <View style={moonSliderStyles.container}>
      <View style={moonSliderStyles.moonContainer}>
        <Moon tithiIndex={currentTithiIndex} width={80} height={80} />
        <Text tint semibold>
          {TITHI_NAMES[currentTithiIndex]}
        </Text>
      </View>
      <View
        style={moonSliderStyles.sliderTrack}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setTrackWidth(width);
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[moonSliderStyles.sliderHandle, handleStyle]} />
        </GestureDetector>
      </View>
      <Text tint tiny style={{ fontStyle: "italic" }}>
          Use the slider to explore Tithis
        </Text>
    </View>
  );
};

export const Moon = forwardRef<
  React.ComponentRef<typeof Svg>,
  MoonProps & { children?: React.ReactNode }
>(({ width = 96, height = 96, style, tithiIndex, ...props }, ref) => {
  const TithiComponent = TITHI_MAP[tithiIndex];

  return (
    <Svg
      ref={ref}
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill={useGetColor(AppColor.tint)}
      style={style}
      {...props}
    >
      <TithiComponent />
    </Svg>
  );
});

export const ShuklaPratipada = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a79.56,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDwitiya = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a76.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaTritiya = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a73.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaChaturthi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaPanchami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaShashti = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaSaptami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaAshtami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaNavami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a0,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDashami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaEkadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDwadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaTrayodashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaChaturdashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const Purnima = () => (
  <Circle cx="100" cy="100" r="80" fill={useGetColor(AppColor.tint)} />
);

export const KrishnaPratipada = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a76.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDwitiya = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a69.28,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaTritiya = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a59.45,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaChaturthi = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a47.02,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaPanchami = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a32.54,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaShashti = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a16.63,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaSaptami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a0,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaAshtami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a16.63,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaNavami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a32.54,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDashami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a47.02,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaEkadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a59.45,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDwadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a69.28,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaTrayodashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a76.08,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaChaturdashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a79.56,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const Amavasya = () => (
  <Circle cx="100" cy="100" r="80" fill="transparent" />
);

const TITHI_MAP = {
  [TithiIndex.ShuklaPratipada]: ShuklaPratipada,
  [TithiIndex.ShuklaDwitiya]: ShuklaDwitiya,
  [TithiIndex.ShuklaTritiya]: ShuklaTritiya,
  [TithiIndex.ShuklaChaturthi]: ShuklaChaturthi,
  [TithiIndex.ShuklaPanchami]: ShuklaPanchami,
  [TithiIndex.ShuklaShashti]: ShuklaShashti,
  [TithiIndex.ShuklaSaptami]: ShuklaSaptami,
  [TithiIndex.ShuklaAshtami]: ShuklaAshtami,
  [TithiIndex.ShuklaNavami]: ShuklaNavami,
  [TithiIndex.ShuklaDashami]: ShuklaDashami,
  [TithiIndex.ShuklaEkadashi]: ShuklaEkadashi,
  [TithiIndex.ShuklaDwadashi]: ShuklaDwadashi,
  [TithiIndex.ShuklaTrayodashi]: ShuklaTrayodashi,
  [TithiIndex.ShuklaChaturdashi]: ShuklaChaturdashi,
  [TithiIndex.Purnima]: Purnima,
  [TithiIndex.KrishnaPratipada]: KrishnaPratipada,
  [TithiIndex.KrishnaDwitiya]: KrishnaDwitiya,
  [TithiIndex.KrishnaTritiya]: KrishnaTritiya,
  [TithiIndex.KrishnaChaturthi]: KrishnaChaturthi,
  [TithiIndex.KrishnaPanchami]: KrishnaPanchami,
  [TithiIndex.KrishnaShashti]: KrishnaShashti,
  [TithiIndex.KrishnaSaptami]: KrishnaSaptami,
  [TithiIndex.KrishnaAshtami]: KrishnaAshtami,
  [TithiIndex.KrishnaNavami]: KrishnaNavami,
  [TithiIndex.KrishnaDashami]: KrishnaDashami,
  [TithiIndex.KrishnaEkadashi]: KrishnaEkadashi,
  [TithiIndex.KrishnaDwadashi]: KrishnaDwadashi,
  [TithiIndex.KrishnaTrayodashi]: KrishnaTrayodashi,
  [TithiIndex.KrishnaChaturdashi]: KrishnaChaturdashi,
  [TithiIndex.Amavasya]: Amavasya,
};
