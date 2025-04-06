import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TextInput } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { AppColor, useGetColor } from "@/theme/color";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  Easing,
  cancelAnimation,
  withRepeat,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { getFontSize } from "@/theme";
import { TITHI_NAMES, TithiIndex } from "@/api/panchanga/core/tithi";
import { Moon } from "@/components/tithi/moon-phases";

// Create animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const SUN_RADIUS = 15;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 16,
  },
  svgContainer: {
    width: "100%",
    alignItems: "center",
  },
  anglesContainer: {
    flexDirection: "row",
    gap: 5,
  },
  tithiContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  angleText: {
    width: "50%",
    color: useGetColor(AppColor.tint),
    fontSize: getFontSize({ small: true }),
  },
  tithiText: {
    color: useGetColor(AppColor.tint),
    fontWeight: "bold",
    fontSize: getFontSize({ neutral: true }),
    textAlign: "center",
    width: "50%",
  },
});

export function TithiOrbit() {
  const { width } = Dimensions.get("window");
  const size = width * 0.9;
  const centerX = size / 2;
  const centerY = size / 2;

  // Add state for tithiIndex
  const [currentTithiIndex, setCurrentTithiIndex] = useState<TithiIndex>(
    TithiIndex.Amavasya
  );

  // Get the tint color from the theme
  const tintColor = useGetColor(AppColor.tint);

  // Orbital motion
  const time = useSharedValue(0);

  // Motion constants
  const orbitalSpeed = 0.005; // degrees per animation frame (reduced from 0.02)
  const moonRelativeSpeed = 1.2; // Moon orbits at a different pace

  // Calculate angles
  const sunAngleDeg = useDerivedValue(() => (time.value * orbitalSpeed) % 360);
  const moonAngleDeg = useDerivedValue(
    () => (time.value * (orbitalSpeed + moonRelativeSpeed)) % 360
  );

  const sunAngleRad = useDerivedValue(
    () => sunAngleDeg.value * (Math.PI / 180)
  );
  const moonAngleRad = useDerivedValue(
    () => moonAngleDeg.value * (Math.PI / 180)
  );

  // SUN POSITION - in geocentric model, sun orbits earth
  const sunOrbitRadius = size * 0.4;
  const sunX = useDerivedValue(
    () => centerX + Math.cos(sunAngleRad.value) * sunOrbitRadius
  );
  const sunY = useDerivedValue(
    () => centerY + Math.sin(sunAngleRad.value) * sunOrbitRadius
  );

  // EARTH POSITION - in geocentric model, earth is at center
  const earthX = centerX;
  const earthY = centerY;

  // MOON POSITION - in geocentric model, moon orbits earth
  const moonOrbitRadius = size * 0.4;
  const moonX = useDerivedValue(
    () => centerX + Math.cos(moonAngleRad.value) * moonOrbitRadius
  );
  const moonY = useDerivedValue(
    () => centerY + Math.sin(moonAngleRad.value) * moonOrbitRadius
  );
  const moonSunAngleDegrees = useDerivedValue(() => {
    return (moonAngleDeg.value - sunAngleDeg.value + 360) % 360;
  });

  // Set up animated props
  const sunProps = useAnimatedProps(() => ({
    cx: sunX.value,
    cy: sunY.value,
  }));

  const moonProps = useAnimatedProps(() => ({
    cx: moonX.value,
    cy: moonY.value,
  }));

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
    return (Math.floor(moonSunAngleDegrees.value / 12) % 30) as TithiIndex;
  });

  // Use useAnimatedReaction to update the state
  useAnimatedReaction(
    () => tithiIndex.value,
    (result) => {
      runOnJS(setCurrentTithiIndex)(result);
    }
  );

  const tithiNameTextProps = useAnimatedProps(() => {
    return {
      text: `${TITHI_NAMES[tithiIndex.value]}`,
      defaultValue: `${TITHI_NAMES[TithiIndex.Amavasya]}`,
    };
  });

  // Calculate the arc path
  const arcRadius = size * 0.4; // Use the same radius as the orbit

  const arcProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * arcRadius;
    // Calculate the angle difference
    let angleDiff = (moonAngleDeg.value - sunAngleDeg.value + 360) % 360;

    // Calculate the arc length based on the angle difference
    const arcLength = (angleDiff / 360) * circumference - SUN_RADIUS;

    // Calculate the dash offset based on sun position

    const dashOffset =
      -1 * ((sunAngleDeg.value / 360) * circumference + SUN_RADIUS);

    return {
      strokeDasharray: `${arcLength} ${circumference - arcLength}`,
      strokeDashoffset: dashOffset,
    };
  });

  // Continuous orbital animation
  useEffect(() => {
    time.value = withRepeat(
      withTiming(time.value + 3600, {
        duration: 600000, // 600 seconds (10 minutes) for one cycle (increased from 180000)
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(time);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg height={size} width={size}>
          {/* Geocentric orbits (Sun and Moon around Earth) */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={size * 0.4}
            stroke={tintColor}
            strokeWidth="1"
            strokeDasharray="5,5"
            fill="transparent"
          />

          {/* Arc between Sun and Moon */}
          <AnimatedCircle
            cx={centerX}
            cy={centerY}
            r={arcRadius}
            stroke="#8A2BE2"
            strokeWidth={2}
            fill="none"
            opacity={0.8}
            animatedProps={arcProps}
          />

          {/* Celestial bodies */}
          <AnimatedCircle animatedProps={moonProps} r={5} fill="#999" />
          <AnimatedCircle
            animatedProps={sunProps}
            r={SUN_RADIUS}
            fill="orange"
          />
          <Circle cx={earthX} cy={earthY} r={10} fill="deepskyblue" />
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
      </View>
      <View style={styles.anglesContainer}>
        <AnimatedTextInput
          style={[styles.angleText, { textAlign: "right" }]}
          animatedProps={sunAngleTextProps}
          editable={false}
        />
        <AnimatedTextInput
          style={[styles.angleText, { textAlign: "left" }]}
          animatedProps={moonAngleTextProps}
          editable={false}
        />
      </View>
      <View style={styles.tithiContainer}>
        <AnimatedTextInput
          style={styles.tithiText}
          animatedProps={tithiNameTextProps}
          editable={false}
        />
        <Moon tithiIndex={currentTithiIndex} width={80} height={80} />
      </View>
    </View>
  );
}
