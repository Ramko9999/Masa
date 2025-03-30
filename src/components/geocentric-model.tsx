import { AppColor, useGetColor } from "@/theme/color";
import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  Filter,
  Text as SvgText,
} from "react-native-svg";
import { Text } from "@/theme/index";
import { TITHI_NAMES, TithiIndex } from "@/api/panchanga/core/tithi";
import { TithiNameToComponent } from "./moon-phase";

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

  // State to track the simulation time and running state
  const [time, setTime] = useState(initialAngle);
  const [isRunning, setIsRunning] = useState(true);

  // Motion constants - updated to realistic proportions
  // Sun moves ~1° per day (360° in ~365 days)
  // Moon moves ~13.176° per day relative to fixed stars (360° in ~27.3 days)
  // For a synodic month (new moon to new moon), moon needs to complete 360° + the degrees sun moved
  // This is ~29.53 days for a complete cycle of moon phases

  // For simulation purposes:
  // - 1 second represents 1 day
  // - Sun moves 1° per "day" (0.1° per animation frame at 10fps)
  // - Moon moves ~13.176° per "day" relative to the sun (1.3176° per animation frame)
  //   This gives exactly 30 tithis in 29.53 days (a synodic month)
  const sunSpeed = 0.1; // degrees per animation frame (1° per simulated "day")
  const moonRelativeSpeed = 1.3176; // Updated Moon's speed relative to Sun (13.176° per simulated "day")
  const moonSpeed = sunSpeed + moonRelativeSpeed; // Absolute moon speed

  // Calculate raw angles
  const sunAngleDeg = (time * sunSpeed) % 360;
  const moonAngleDeg = (time * moonSpeed) % 360;

  // Calculate angles in radians for positioning
  const sunAngleRad = sunAngleDeg * (Math.PI / 180);
  const moonAngleRad = moonAngleDeg * (Math.PI / 180);

  // Calculate positions
  const sunX = centerX + Math.cos(sunAngleRad) * size * 0.4;
  const sunY = centerY + Math.sin(sunAngleRad) * size * 0.4;
  const moonX = centerX + Math.cos(moonAngleRad) * size * 0.2;
  const moonY = centerY + Math.sin(moonAngleRad) * size * 0.2;

  // Calculate current tithi (0-29)
  const moonSunAngleDegrees = (moonAngleDeg - sunAngleDeg + 360) % 360;
  const currentTithiIndex = Math.floor(moonSunAngleDegrees / 12) % 30;

  // Map the calculated tithi index (0-29) to the corresponding TithiIndex enum value
  // TithiIndex has ShuklaPratipada at 0 and Amavasya at 29
  let tithiIndexEnum: TithiIndex;

  // This mapping ensures that when angle is near 0, we show Amavasya (which is at TithiIndex.Amavasya = 29)
  // and for angles closer to 12 degrees, we show ShuklaPratipada (TithiIndex.ShuklaPratipada = 0)
  if (currentTithiIndex === 0) {
    tithiIndexEnum = TithiIndex.Amavasya;
  } else if (currentTithiIndex === 1) {
    tithiIndexEnum = TithiIndex.ShuklaPratipada;
  } else {
    // For other values, we need to subtract 1 since our angle calculation gives index 1 for ShuklaPratipada
    tithiIndexEnum = (currentTithiIndex - 1) as TithiIndex;
  }

  // Get tithi name from the actual TITHI_NAMES array
  const tithiName = TITHI_NAMES[tithiIndexEnum];

  // Get the correct moon phase component based on the tithi enum
  const MoonPhaseComponent = TithiNameToComponent[tithiIndexEnum];

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        {/* Dashed orbits */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={size * 0.4}
          stroke="#999"
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="transparent"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={size * 0.2}
          stroke="#999"
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="transparent"
        />

        {/* Earth, Sun, and Moon */}

        {/* Define filters for glow effects */}
        <Defs>
          {/* Sun glow */}
          <Filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </Filter>

          {/* Earth glow */}
          <Filter id="earthGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </Filter>

          {/* Moon glow */}
          <Filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </Filter>
        </Defs>

        {/* Background elements for glow */}
        <Circle
          cx={sunX}
          cy={sunY}
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
        <Circle
          cx={moonX}
          cy={moonY}
          r={9}
          fill="#999"
          opacity="0.5"
          filter="url(#moonGlow)"
        />

        {/* Main celestial bodies with gradient fills */}
        <Circle cx={centerX} cy={centerY} r={10} fill="deepskyblue" />
        <Circle cx={sunX} cy={sunY} r={15} fill="orange" />
        <Circle cx={moonX} cy={moonY} r={7.5} fill="#999" />

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

      {/* Information section with vertical layout */}
      <View style={styles.angleInfoContainer}>
        <Text tint small>{`Sun: ${Math.round(sunAngleDeg)}°`}</Text>
        <Text tint small>{`Moon: ${Math.round(moonAngleDeg)}°`}</Text>
        <Text tint small>{`Moon-Sun: ${Math.round(
          moonSunAngleDegrees
        )}°`}</Text>
      </View>
      <View style={styles.tithiInfoContainer}>
        {/* Text block first */}
        <View style={styles.tithiNameContainer}>
          <Text tint bold neutral>
            {tithiName}
          </Text>
        </View>
        {/* Moon phase after the text block */}
        <View style={styles.moonPhaseContainer}>
          {MoonPhaseComponent && <MoonPhaseComponent width={60} height={60} />}
        </View>
      </View>
      <View>
        <Pressable
          onPress={() => setTime((prev) => prev + 10)}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Text tint>Next</Text>
        </Pressable>
        <Pressable
          onPress={() => setTime((prev) => prev - 10)}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Text tint>Previous</Text>
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
  angleInfoContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tithiInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  tithiNameContainer: {
    width: "50%",
    textAlign: "left",
    alignItems: "flex-end",
  },
  moonPhaseContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GeocentricModel;
