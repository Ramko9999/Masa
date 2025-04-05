import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, TextInput } from "react-native";
import Svg, { Circle, Text as SvgText, Path, G } from "react-native-svg";
import { AppColor, useGetColor } from "@/theme/color";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  Easing,
  cancelAnimation,
  withRepeat,
} from "react-native-reanimated";
import { getFontSize } from "@/theme";
import {
  NAKSHATRA_NAMES,
  NakshatraIndex,
} from "@/api/panchanga/core/nakshatra";

// Create animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
    width: "100%",
    color: useGetColor(AppColor.tint),
    fontSize: getFontSize({ small: true }),
    textAlign: "center",
  },
  nakshatraText: {
    color: useGetColor(AppColor.tint),
    fontWeight: "bold",
    fontSize: getFontSize({ neutral: true }),
    textAlign: "center",
    width: "50%",
  },
});

export function NakshatraOrbit() {
  const { width } = Dimensions.get("window");
  const size = width * 0.9;
  const centerX = size / 2;
  const centerY = size / 2;

  // Get the tint color from the theme
  const tintColor = useGetColor(AppColor.tint);

  // Orbital motion
  const time = useSharedValue(0);

  // Motion constants
  const orbitalSpeed = 0.4; // degrees per animation frame (increased for slightly faster movement)

  // Calculate angles
  const moonAngleDeg = useDerivedValue(() => (time.value * orbitalSpeed) % 360);
  const moonAngleRad = useDerivedValue(
    () => moonAngleDeg.value * (Math.PI / 180)
  );

  // Number of segments in the wheel (Nakshatras)
  const numSegments = 27;
  const segmentAngle = 360 / numSegments;

  // EARTH POSITION - in geocentric model, earth is at center
  const earthX = centerX;
  const earthY = centerY;

  // MOON POSITION - in geocentric model, moon orbits earth
  const moonOrbitRadius = size * 0.3; // Adjusted back to original value
  const moonX = useDerivedValue(
    () => centerX + Math.cos(moonAngleRad.value) * moonOrbitRadius
  );
  const moonY = useDerivedValue(
    () => centerY + Math.sin(moonAngleRad.value) * moonOrbitRadius
  );

  const referenceAngle = 0; // Fixed at 0 degrees
  const moonSunAngleDegrees = useDerivedValue(() => {
    return (moonAngleDeg.value - referenceAngle + 360) % 360;
  });

  // Set up animated props
  const moonProps = useAnimatedProps(() => ({
    cx: moonX.value,
    cy: moonY.value,
  }));

  const moonAngleTextProps = useAnimatedProps(() => {
    return {
      text: `Moon: ${Math.round(moonAngleDeg.value)}°`,
      defaultValue: "Moon: 0°",
    };
  });

  // Updated nakshatra index calculation to use segmentAngle instead of dividing by 27
  const nakshatraIndex = useDerivedValue(() => {
    // Simply use moonAngleDeg directly with segmentAngle since we don't care about reference angle
    return (Math.floor(moonAngleDeg.value / segmentAngle) %
      numSegments) as NakshatraIndex;
  });

  // We don't need a separate currentSegmentIndex since it's the same calculation
  // Use nakshatraIndex for both the name and highlighting the segment

  const nakshatraNameTextProps = useAnimatedProps(() => {
    return {
      text: NAKSHATRA_NAMES[nakshatraIndex.value],
      defaultValue: NAKSHATRA_NAMES[NakshatraIndex.Ashwini],
    };
  });

  // Continuous orbital animation
  useEffect(() => {
    time.value = withRepeat(
      withTiming(time.value + 3600, {
        duration: 90000, // 90 seconds (1.5 minutes) for one cycle
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(time);
    };
  }, []);

  // Create the wheel segments
  const createWheelSegments = () => {
    const segments = [];
    const outerRadius = size * 0.42;
    const innerRadius = size * 0.39;
    // Place text outside the outer radius
    const textRadius = size * 0.45; // Increased to be outside the segments

    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * segmentAngle * (Math.PI / 180);
      const endAngle = (i + 1) * segmentAngle * (Math.PI / 180);
      const midAngle = (startAngle + endAngle) / 2;

      // Calculate points for segment path
      const startOuterX = centerX + Math.cos(startAngle) * outerRadius;
      const startOuterY = centerY + Math.sin(startAngle) * outerRadius;
      const endOuterX = centerX + Math.cos(endAngle) * outerRadius;
      const endOuterY = centerY + Math.sin(endAngle) * outerRadius;
      const startInnerX = centerX + Math.cos(endAngle) * innerRadius;
      const startInnerY = centerY + Math.sin(endAngle) * innerRadius;
      const endInnerX = centerX + Math.cos(startAngle) * innerRadius;
      const endInnerY = centerY + Math.sin(startAngle) * innerRadius;

      // Text position - moved outside the wheel
      const textX = centerX + Math.cos(midAngle) * textRadius;
      const textY = centerY + Math.sin(midAngle) * textRadius;

      // Segment path
      const path = `
        M ${startOuterX} ${startOuterY}
        A ${outerRadius} ${outerRadius} 0 0 1 ${endOuterX} ${endOuterY}
        L ${startInnerX} ${startInnerY}
        A ${innerRadius} ${innerRadius} 0 0 0 ${endInnerX} ${endInnerY}
        Z
      `;

      segments.push(
        <G key={i}>
          <Path
            d={path}
            stroke={tintColor}
            strokeWidth="0.5"
            fill="transparent"
          />
          <SvgText
            x={textX}
            y={textY}
            fontSize="9"
            fill={tintColor}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontFamily="monospace"
          >
            {i + 1}
          </SvgText>
        </G>
      );
    }

    return segments;
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg height={size} width={size}>
          {/* Moon orbit - dashed circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={moonOrbitRadius}
            stroke={tintColor}
            strokeWidth="0.8"
            strokeDasharray="3,3"
            fill="transparent"
          />

          {/* Wheel with segments */}
          {createWheelSegments()}

          {/* Highlight current segment */}
          <AnimatedPath
            animatedProps={useAnimatedProps(() => ({
              d: (() => {
                const currentIndex = nakshatraIndex.value;
                const startAngle =
                  currentIndex * segmentAngle * (Math.PI / 180);
                const endAngle =
                  (currentIndex + 1) * segmentAngle * (Math.PI / 180);

                // Match dimensions with createWheelSegments
                const outerRadius = size * 0.42;
                const innerRadius = size * 0.39;

                // Calculate points for highlighted segment path
                const startOuterX =
                  centerX + Math.cos(startAngle) * outerRadius;
                const startOuterY =
                  centerY + Math.sin(startAngle) * outerRadius;
                const endOuterX = centerX + Math.cos(endAngle) * outerRadius;
                const endOuterY = centerY + Math.sin(endAngle) * outerRadius;
                const startInnerX = centerX + Math.cos(endAngle) * innerRadius;
                const startInnerY = centerY + Math.sin(endAngle) * innerRadius;
                const endInnerX = centerX + Math.cos(startAngle) * innerRadius;
                const endInnerY = centerY + Math.sin(startAngle) * innerRadius;

                return `
                  M ${startOuterX} ${startOuterY}
                  A ${outerRadius} ${outerRadius} 0 0 1 ${endOuterX} ${endOuterY}
                  L ${startInnerX} ${startInnerY}
                  A ${innerRadius} ${innerRadius} 0 0 0 ${endInnerX} ${endInnerY}
                  Z
                `;
              })(),
            }))}
            fill={tintColor}
            opacity={0.3}
            stroke={tintColor}
            strokeWidth="1"
          />

          {/* Celestial bodies */}
          <AnimatedCircle animatedProps={moonProps} r={5} fill="#999" />
          <Circle cx={earthX} cy={earthY} r={10} fill="deepskyblue" />
        </Svg>
      </View>
      <View style={styles.anglesContainer}>
        <AnimatedTextInput
          style={styles.angleText}
          animatedProps={moonAngleTextProps}
          editable={false}
        />
      </View>
      <View style={styles.tithiContainer}>
        <AnimatedTextInput
          style={styles.nakshatraText}
          animatedProps={nakshatraNameTextProps}
          editable={false}
        />
      </View>
    </View>
  );
}
