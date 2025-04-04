import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, TextInput } from "react-native";
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
import { Text, View } from "@/theme";
import { getFontSize } from "@/theme";
import { TITHI_NAMES, TithiIndex } from "@/api/panchanga/core/tithi";
import { Moon } from "@/components/tithi/moon-phases";

// Animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const geocentricTithiStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: "4%",
  },
  svgContainer: {
    width: "100%",
    alignItems: "center",
  },
  anglesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "2%",
  },
  tithiContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2%",
  },
  moonContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  angleText: {
    width: "48%",
    fontSize: getFontSize({ small: true }),
  },
  tithiText: {
    fontWeight: "bold",
    fontSize: getFontSize({ neutral: true }),
    textAlign: "center",
    width: "50%"
  },
});

export function GeocentricTithi() {
  // Layout dimensions
  const { width } = Dimensions.get("window");
  const size = width * 0.9;
  const centerX = size / 2;
  const centerY = size / 2;
  const orbitRadius = size * 0.4;

  // State for current tithi
  const [currentTithiIndex, setCurrentTithiIndex] = useState<TithiIndex>(TithiIndex.Amavasya);
  const tintColor = useGetColor(AppColor.tint);

  // Animation values
  const time = useSharedValue(0);
  const orbitalSpeed = 0.005;
  const moonRelativeSpeed = 1.2;

  // Derived angle values
  const sunAngleDeg = useDerivedValue(() => (time.value * orbitalSpeed) % 360);
  const moonAngleDeg = useDerivedValue(() => (time.value * (orbitalSpeed + moonRelativeSpeed)) % 360);
  
  const sunAngleRad = useDerivedValue(() => sunAngleDeg.value * (Math.PI / 180));
  const moonAngleRad = useDerivedValue(() => moonAngleDeg.value * (Math.PI / 180));
  
  const moonSunAngleDegrees = useDerivedValue(() => (moonAngleDeg.value - sunAngleDeg.value + 360) % 360);

  // Celestial body positions
  const sunX = useDerivedValue(() => centerX + Math.cos(sunAngleRad.value) * orbitRadius);
  const sunY = useDerivedValue(() => centerY + Math.sin(sunAngleRad.value) * orbitRadius);
  const moonX = useDerivedValue(() => centerX + Math.cos(moonAngleRad.value) * orbitRadius);
  const moonY = useDerivedValue(() => centerY + Math.sin(moonAngleRad.value) * orbitRadius);

  // Animated props
  const sunProps = useAnimatedProps(() => ({ cx: sunX.value, cy: sunY.value }));
  const moonProps = useAnimatedProps(() => ({ cx: moonX.value, cy: moonY.value }));
  
  const sunAngleTextProps = useAnimatedProps(() => ({
    text: `Sun: ${Math.round(sunAngleDeg.value)}°`,
    defaultValue: "Sun: 0°",
  }));
  
  const moonAngleTextProps = useAnimatedProps(() => ({
    text: `Moon: ${Math.round(moonAngleDeg.value)}°`,
    defaultValue: "Moon: 0°",
  }));

  // Derive tithi index from angle
  const tithiIndex = useDerivedValue(() => (Math.floor(moonSunAngleDegrees.value / 12) % 30) as TithiIndex);

  // Update state with derived tithi
  useAnimatedReaction(
    () => tithiIndex.value,
    (result) => runOnJS(setCurrentTithiIndex)(result)
  );

  const tithiNameTextProps = useAnimatedProps(() => ({
    text: TITHI_NAMES[tithiIndex.value],
    defaultValue: TITHI_NAMES[TithiIndex.Amavasya],
  }));

  // Start orbital animation
  useEffect(() => {
    time.value = withRepeat(
      withTiming(time.value + 3600, {
        duration: 600000, // 10 minutes for a full cycle
        easing: Easing.linear,
      }),
      -1, 
      false
    );

    return () => cancelAnimation(time);
  }, []);

  // Create degree markers array outside of render for clarity
  const degreeMarkers = [...Array(12)].map((_, i) => {
    const angle = i * 30 * (Math.PI / 180);
    const x = centerX + Math.cos(angle) * (orbitRadius + size * 0.07);
    const y = centerY + Math.sin(angle) * (orbitRadius + size * 0.07);
    return (
      <SvgText
        key={i}
        x={x}
        y={y}
        fontSize="10"
        fill={tintColor}
        textAnchor="middle"
        fontFamily="monospace"
      >
        {`${i * 30}°`}
      </SvgText>
    );
  });

  return (
    <View style={geocentricTithiStyles.container}>
      <View style={geocentricTithiStyles.svgContainer}>
        <Svg height={size} width={size}>
          {/* Orbit path */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={orbitRadius}
            stroke={tintColor}
            strokeWidth="1"
            strokeDasharray="5,5"
            fill="transparent"
          />
          
          {/* Celestial bodies */}
          <AnimatedCircle animatedProps={moonProps} r={5} fill="#999" />
          <AnimatedCircle animatedProps={sunProps} r={15} fill="orange" />
          <Circle cx={centerX} cy={centerY} r={10} fill="deepskyblue" />
          
          {/* Degree markers */}
          {degreeMarkers}
        </Svg>
      </View>
      
      <View style={geocentricTithiStyles.anglesContainer}>
        <AnimatedTextInput
          style={[geocentricTithiStyles.angleText, { textAlign: "right", color: tintColor }]}
          animatedProps={sunAngleTextProps}
          editable={false}
        />
        <AnimatedTextInput
          style={[geocentricTithiStyles.angleText, { textAlign: "left", color: tintColor }]}
          animatedProps={moonAngleTextProps}
          editable={false}
        />
      </View>
      
      <View style={geocentricTithiStyles.tithiContainer}>
        <View style={geocentricTithiStyles.labelContainer}>
          <AnimatedTextInput
            style={{ color: tintColor, fontWeight: "bold", fontSize: getFontSize({ neutral: true }), textAlign: "center" }}
            animatedProps={tithiNameTextProps}
            editable={false}
          />
        </View>
        <View style={geocentricTithiStyles.moonContainer}>
          <Moon tithiIndex={currentTithiIndex} width={80} height={80} />
        </View>
      </View>
    </View>
  );
}
