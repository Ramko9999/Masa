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

// Memoized static orbit elements
const StaticOrbitElements = React.memo(
  ({
    centerX,
    centerY,
    size,
    tintColor,
  }: {
    centerX: number;
    centerY: number;
    size: number;
    tintColor: string;
  }) => {
    return (
      <>
        {/* Moon orbit - dashed circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={size * 0.3}
          stroke={tintColor}
          strokeWidth="0.8"
          strokeDasharray="3,3"
          fill="transparent"
        />
        {/* Earth at center */}
        <Circle cx={centerX} cy={centerY} r={10} fill="deepskyblue" />
      </>
    );
  }
);

// Memoized wheel segments component
const WheelSegments = React.memo(
  ({
    centerX,
    centerY,
    size,
    tintColor,
    numSegments,
    segmentAngle,
  }: {
    centerX: number;
    centerY: number;
    size: number;
    tintColor: string;
    numSegments: number;
    segmentAngle: number;
  }) => {
    const segments = [];
    const outerRadius = size * 0.42;
    const innerRadius = size * 0.39;
    const textRadius = size * 0.45;

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

      // Text position
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

    return <>{segments}</>;
  }
);

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

  // MOON POSITION - in geocentric model, moon orbits earth
  const moonOrbitRadius = size * 0.3;
  const moonX = useDerivedValue(
    () => centerX + Math.cos(moonAngleRad.value) * moonOrbitRadius
  );
  const moonY = useDerivedValue(
    () => centerY + Math.sin(moonAngleRad.value) * moonOrbitRadius
  );

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
    return (Math.floor(moonAngleDeg.value / segmentAngle) %
      numSegments) as NakshatraIndex;
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg height={size} width={size}>
          {/* Static elements */}
          <StaticOrbitElements
            centerX={centerX}
            centerY={centerY}
            size={size}
            tintColor={tintColor}
          />

          {/* Wheel segments */}
          <WheelSegments
            centerX={centerX}
            centerY={centerY}
            size={size}
            tintColor={tintColor}
            numSegments={numSegments}
            segmentAngle={segmentAngle}
          />

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
            fill="#8A2BE2"
            opacity={0.3}
            stroke={tintColor}
            strokeWidth="1"
          />

          {/* Moon */}
          <AnimatedCircle animatedProps={moonProps} r={5} fill="#999" />
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
