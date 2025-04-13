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
import { MASA_NAMES, MasaIndex } from "@/api/panchanga/core/masa";
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
  masaText: {
    color: useGetColor(AppColor.tint),
    fontWeight: "bold",
    fontSize: getFontSize({ neutral: true }),
    textAlign: "center",
    width: "100%",
    marginTop: 5,
  },
  masaContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginTop: 15,
  },
  masaColumnContainer: {
    width: "48%",
    alignItems: "center",
  },
  masaValueText: {
    color: useGetColor(AppColor.tint),
    fontWeight: "bold",
    fontSize: getFontSize({ neutral: true }),
    textAlign: "center",
  },
  masaLabelText: {
    color: useGetColor(AppColor.tint),
    fontSize: getFontSize({ smaller: true }),
    textAlign: "center",
    marginTop: 2,
  },
  masaTypeText: {
    color: useGetColor(AppColor.tint),
    fontWeight: "bold",
    fontSize: getFontSize({ small: true }),
    textAlign: "center",
    width: "48%",
  },
});

export function MasaOrbit() {
  const { width } = Dimensions.get("window");
  const size = width * 0.9;
  const centerX = size / 2;
  const centerY = size / 2;

  // Add state for tithiIndex
  const [currentTithiIndex, setCurrentTithiIndex] = useState<TithiIndex>(
    TithiIndex.Amavasya
  );

  // Add state for masaIndex
  const [currentMasaIndex, setCurrentMasaIndex] = useState<MasaIndex>(
    MasaIndex.Chaitra
  );

  // Add state for both masa types
  const [currentAmantaMasaIndex, setCurrentAmantaMasaIndex] =
    useState<MasaIndex>(MasaIndex.Chaitra);

  const [currentPurnimantaMasaIndex, setCurrentPurnimantaMasaIndex] =
    useState<MasaIndex>(MasaIndex.Chaitra);

  // Get the tint color from the theme
  const tintColor = useGetColor(AppColor.tint);

  // Orbital motion
  const time = useSharedValue(0);

  // Track total angular distance traveled
  const totalSunAngle = useSharedValue(0);
  const totalMoonAngle = useSharedValue(0);

  // Last values to calculate increments
  const lastSunAngle = useSharedValue(0);
  const lastMoonAngle = useSharedValue(0);

  // Motion constants
  const sunSpeed = 0.088; // degrees per animation frame (based on real-world proportions)
  const moonRelativeSpeed = 1.2; // Moon orbits at a different pace

  // Calculate instantaneous angles (0-360)
  const sunAngleDeg = useDerivedValue(() => {
    const currentAngle = (time.value * sunSpeed) % 360;

    // Calculate increment since last frame
    let increment = currentAngle - lastSunAngle.value;

    // Handle wrapping around 360 degrees
    if (increment < -180) {
      increment += 360;
    }

    // Update total angle
    totalSunAngle.value += increment;

    // Update last value for next frame
    lastSunAngle.value = currentAngle;

    return currentAngle;
  });

  const moonAngleDeg = useDerivedValue(() => {
    const currentAngle = (time.value * (sunSpeed + moonRelativeSpeed)) % 360;

    // Calculate increment since last frame
    let increment = currentAngle - lastMoonAngle.value;

    // Handle wrapping around 360 degrees
    if (increment < -180) {
      increment += 360;
    }

    // Update total angle
    totalMoonAngle.value += increment;

    // Update last value for next frame
    lastMoonAngle.value = currentAngle;

    return currentAngle;
  });

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

  // Calculate the instantaneous angle between sun and moon (0-360)
  const moonSunAngleDegrees = useDerivedValue(() => {
    return (moonAngleDeg.value - sunAngleDeg.value + 360) % 360;
  });

  // Calculate the total relative angle traveled by moon compared to sun
  const totalRelativeAngle = useDerivedValue(() => {
    return totalMoonAngle.value - totalSunAngle.value;
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

  // Calculate tithi based on total relative angle
  const tithiIndex = useDerivedValue(() => {
    // One tithi = 12 degrees of angular separation
    // Divide total relative angle by 12 degrees to get total tithi progression
    // Take modulo 30 to get current tithi index (0-29)
    return (Math.floor(totalRelativeAngle.value / 12) % 30) as TithiIndex;
  });

  // Calculate Amanta masa based on total relative angle
  // Amanta month ends with new moon (Amavasya - when Sun and Moon are at the same position)
  const amantaMasaIndex = useDerivedValue(() => {
    // One tithi = 12 degrees of angular separation
    // One masa = 30 tithis
    // Divide total relative angle by 360 degrees (30 tithis * 12 degrees)
    // Take modulo 12 to get current masa index (0-11)
    return (Math.floor(totalRelativeAngle.value / (12 * 30)) % 12) as MasaIndex;
  });

  // Calculate Purnimanta masa based on total relative angle
  // Purnimanta month ends with full moon (Purnima - when Sun and Moon are 180 degrees apart)
  // So the Purnimanta masa is ahead of Amanta by 15 tithis (half a month)
  const purnimantaMasaIndex = useDerivedValue(() => {
    // To get Purnimanta, we offset by 15 tithis (180 degrees)
    // When we're at new moon (Amavasya), we're halfway through the Purnimanta month
    const totalRelativeAngleWithOffset = totalRelativeAngle.value + 15 * 12; // 15 tithis * 12 degrees
    return (Math.floor(totalRelativeAngleWithOffset / (12 * 30)) %
      12) as MasaIndex;
  });

  // Use useAnimatedReaction to update the tithi state
  useAnimatedReaction(
    () => tithiIndex.value,
    (result) => {
      runOnJS(setCurrentTithiIndex)(result);
    }
  );

  // Update useAnimatedReaction for Amanta masa
  useAnimatedReaction(
    () => amantaMasaIndex.value,
    (result) => {
      runOnJS(setCurrentAmantaMasaIndex)(result);
    }
  );

  // Add reaction for Purnimanta masa
  useAnimatedReaction(
    () => purnimantaMasaIndex.value,
    (result) => {
      runOnJS(setCurrentPurnimantaMasaIndex)(result);
    }
  );

  const tithiNameTextProps = useAnimatedProps(() => {
    return {
      text: `${TITHI_NAMES[tithiIndex.value]}`,
      defaultValue: `${TITHI_NAMES[TithiIndex.Amavasya]}`,
    };
  });

  const amantaMasaValueProps = useAnimatedProps(() => {
    return {
      text: `${MASA_NAMES[amantaMasaIndex.value]}`,
      defaultValue: `${MASA_NAMES[MasaIndex.Chaitra]}`,
    };
  });

  const purnimantaMasaValueProps = useAnimatedProps(() => {
    return {
      text: `${MASA_NAMES[purnimantaMasaIndex.value]}`,
      defaultValue: `${MASA_NAMES[MasaIndex.Chaitra]}`,
    };
  });

  // Calculate the arc path
  const arcRadius = size * 0.4; // Use the same radius as the orbit

  const arcProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * arcRadius;
    // Calculate the angle difference
    let angleDiff = (moonAngleDeg.value - sunAngleDeg.value + 360) % 360;

    // Calculate the arc length based on the angle difference
    const arcLength = Math.max(0, (angleDiff / 360) * circumference - SUN_RADIUS);

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
        duration: 120000, // 120 seconds (2 minutes) for one cycle (decreased from 300000)
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
      <View style={styles.masaContainer}>
        <View style={styles.masaColumnContainer}>
          <AnimatedTextInput
            style={styles.masaValueText}
            animatedProps={amantaMasaValueProps}
            editable={false}
          />
          <TextInput
            style={styles.masaLabelText}
            value="Amanta Masa"
            editable={false}
          />
        </View>
        <View style={styles.masaColumnContainer}>
          <AnimatedTextInput
            style={styles.masaValueText}
            animatedProps={purnimantaMasaValueProps}
            editable={false}
          />
          <TextInput
            style={styles.masaLabelText}
            value="Purnimanta Masa"
            editable={false}
          />
        </View>
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
