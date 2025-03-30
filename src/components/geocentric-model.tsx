import { AppColor, useGetColor } from "@/theme/color";
import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  Filter,
  Text as SvgText,
} from "react-native-svg";
import { getFontSize, Text } from "@/theme/index";
import { TITHI_NAMES, TithiIndex } from "@/api/panchanga/core/tithi";
import { MoonPhase } from "./moon-phase";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useDerivedValue
} from "react-native-reanimated";

// Create animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedMoonPhase = Animated.createAnimatedComponent(MoonPhase);

interface GeocentricModelProps {
  // Optional initial angle for testing
  initialAngle?: number;
}

const GeocentricModel: React.FC<GeocentricModelProps> = ({
  initialAngle = 0,
}) => {
  const { width } = Dimensions.get("window");
  const size = width * 0.9; // Adjust size based on screen width
  const centerX = size / 2;
  const centerY = size / 2;

  // Use shared value for time
  const time = useSharedValue(initialAngle);

  // Motion constants
  const sunSpeed = 0.1; // degrees per animation frame (1° per simulated "day")
  const moonRelativeSpeed = 1.3176; // Updated Moon's speed relative to Sun (13.176° per simulated "day")
  const moonSpeed = sunSpeed + moonRelativeSpeed; // Absolute moon speed

  // Use useDerivedValue to reactively compute values based on time
  const sunAngleDeg = useDerivedValue(() => (time.value * sunSpeed) % 360);
  const moonAngleDeg = useDerivedValue(() => (time.value * moonSpeed) % 360);

  const sunAngleRad = useDerivedValue(
    () => sunAngleDeg.value * (Math.PI / 180)
  );
  const moonAngleRad = useDerivedValue(
    () => moonAngleDeg.value * (Math.PI / 180)
  );

  // Calculate positions with useDerivedValue
  const sunX = useDerivedValue(
    () => centerX + Math.cos(sunAngleRad.value) * size * 0.4
  );
  const sunY = useDerivedValue(
    () => centerY + Math.sin(sunAngleRad.value) * size * 0.4
  );
  const moonX = useDerivedValue(
    () => centerX + Math.cos(moonAngleRad.value) * size * 0.2
  );
  const moonY = useDerivedValue(
    () => centerY + Math.sin(moonAngleRad.value) * size * 0.2
  );
  const moonSunAngleDegrees = useDerivedValue(() => {
    return (moonAngleDeg.value - sunAngleDeg.value + 360) % 360;
  });

  // Set up animated props for the sun
  const sunProps = useAnimatedProps(() => {
    return {
      cx: sunX.value,
      cy: sunY.value,
    };
  });

  // Set up animated props for the moon
  const moonProps = useAnimatedProps(() => {
    return {
      cx: moonX.value,
      cy: moonY.value,
    };
  });

  const sunAngleTextProps = useAnimatedProps(() => {
    return {
      text: `Sun: ${Math.round(sunAngleDeg.value)}°`,
      defaultValue: "Sun: 0°",
    };
  });

  const moonAngleTextProps = useAnimatedProps(() => {
    return {
      text: `Moon: ${Math.round(moonAngleDeg.value)}°`,
      defaultValue: "Moon: 0°",
    };
  });

  const tithiIndex = useDerivedValue(() => {
    const currentTithiIndex = Math.floor(moonSunAngleDegrees.value / 12) % 30;
    if (currentTithiIndex === 0) {
      return TithiIndex.Amavasya;
    } else if (currentTithiIndex === 1) {
      return TithiIndex.ShuklaPratipada;
    } else {
      return (currentTithiIndex - 1) as TithiIndex;
    }
  });

  const tithiNameTextProps = useAnimatedProps(() => {
    return {
      text: TITHI_NAMES[tithiIndex.value],
      defaultValue: TITHI_NAMES[TithiIndex.Amavasya],
    };
  });

  const handleNext = () => {
    time.set((value) => {
      //   return withTiming(value + 10, {
      //     duration: 2000,
      //     easing: Easing.in(Easing.bezierFn(0.25, 0.1, 0.25, 1)),
      //     reduceMotion: ReduceMotion.System,
      //   });
      return value + 10;
    });
  };

  const handlePrevious = () => {
    time.set((value) => {
      //   return withTiming(value - 10, {
      //     duration: 2000,
      //     easing: Easing.in(Easing.bezierFn(0.25, 0.1, 0.25, 1)),
      //     reduceMotion: ReduceMotion.System,
      //   });
      return value - 10;
    });
  };

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        {/* Dashed orbits */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={size * 0.4}
          stroke={useGetColor(AppColor.tint)}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="transparent"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={size * 0.2}
          stroke={useGetColor(AppColor.tint)}
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="transparent"
        />

        {/* Define filters for glow effects */}
        <Defs>
          <Filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </Filter>
          <Filter id="earthGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </Filter>
          <Filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </Filter>
        </Defs>

        {/* Background elements for glow */}
        <AnimatedCircle
          animatedProps={sunProps}
          r={18}
          fill="orange"
          opacity="0.5"
          filter="url(#sunGlow)"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={12}
          fill="deepskyblue"
          opacity="0.5"
          filter="url(#earthGlow)"
        />
        <AnimatedCircle
          animatedProps={moonProps}
          r={9}
          fill="#999"
          opacity="0.5"
          filter="url(#moonGlow)"
        />

        {/* Main celestial bodies */}
        <Circle cx={centerX} cy={centerY} r={10} fill="deepskyblue" />
        <AnimatedCircle animatedProps={sunProps} r={15} fill="orange" />
        <AnimatedCircle animatedProps={moonProps} r={7.5} fill="#999" />

        {/* Degree markings */}
        {[...Array(12)].map((_, i) => {
          const markerAngle = i * 30 * (Math.PI / 180);
          const markerX = centerX + Math.cos(markerAngle) * (size * 0.47);
          const markerY = centerY + Math.sin(markerAngle) * (size * 0.47);
          return (
            <SvgText
              key={i}
              x={markerX}
              y={markerY}
              fontSize="10"
              fill={useGetColor(AppColor.tint)}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {`${i * 30}°`}
            </SvgText>
          );
        })}
      </Svg>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <AnimatedTextInput
          style={{
            color: useGetColor(AppColor.tint),
            fontSize: getFontSize({ small: true }),
          }}
          animatedProps={sunAngleTextProps}
          editable={false}
        />
        <AnimatedTextInput
          style={{
            color: useGetColor(AppColor.tint),
            fontSize: getFontSize({ small: true }),
          }}
          animatedProps={moonAngleTextProps}
          editable={false}
        />
      </View>
      <View>
        <AnimatedTextInput
          animatedProps={tithiNameTextProps}
          style={{
            color: useGetColor(AppColor.tint),
            fontWeight: "bold",
            fontSize: getFontSize({ neutral: true }),
          }}
          editable={false}
        />
        <AnimatedMoonPhase tithiIndex={tithiIndex.value} width={80} height={80} />
      </View>
      <View style={styles.controlsContainer}>
        <Pressable onPress={handlePrevious}>
          <Text tint>Previous</Text>
        </Pressable>
        <Pressable onPress={handleNext}>
          <Text tint>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
  },
});

export default GeocentricModel;
