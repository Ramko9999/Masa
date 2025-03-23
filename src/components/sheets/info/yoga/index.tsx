import { StyleUtils } from "../../../../theme/style-utils";
import { View, Dimensions } from "react-native";
import { tintColor } from "../../../../util/color";
import { Base, ImageBackground, InfoSlide } from "../util";
import { Text } from "../../../../theme/index";
import Svg, { Circle, Path, G, Line } from "react-native-svg";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { YOGA_NAMES } from "../../../../api/panchanga/core/yoga";

const commonSlideProps = {
  backgroundColor: "#151515",
  textWrapColor: tintColor("#151515"),
};

interface VedicWheelProps {
  size?: number;
  currentYogaIndex?: number;
}

const VedicWheel: React.FC<VedicWheelProps> = ({
  size,
  currentYogaIndex = 0,
}) => {
  // Basic setup
  const screenHeight = Dimensions.get("window").height;
  const wheelSize = screenHeight * 0.3 * 0.8;
  // State for positions and current yoga
  const [sunPosition, setSunPosition] = useState(45);
  const [moonPosition, setMoonPosition] = useState(135);
  const [currentYoga, setCurrentYoga] = useState(currentYogaIndex);

  // Animation frame reference
  const animationRef = useRef<number>(0);

  // Time tracking for smooth animation
  const lastTimeRef = useRef<number>(0);

  // SVG dimensions
  const viewBoxSize = 1000;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = viewBoxSize * 0.4;

  // Calculate current yoga based on sun and moon positions
  const calculateYogaIndex = (sun: number, moon: number) => {
    const combinedPosition = (sun + moon) % 360;
    return Math.floor(combinedPosition / (360 / 27));
  };

  // Smoother animation with requestAnimationFrame
  useEffect(() => {
    // Speed in degrees per second
    const sunSpeed = 2; // 2 degrees per second (3 minutes for full circle)
    const moonSpeed = 27; // 27 degrees per second (13.3 seconds for full circle)

    lastTimeRef.current = performance.now();

    const animate = (time: number) => {
      // Calculate time delta in seconds
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Calculate new positions
      const newSunPos = (sunPosition + sunSpeed * delta) % 360;
      const newMoonPos = (moonPosition + moonSpeed * delta) % 360;

      // Update positions
      setSunPosition(newSunPos);
      setMoonPosition(newMoonPos);

      // Calculate and update yoga index
      const yogaIndex = calculateYogaIndex(newSunPos, newMoonPos);
      setCurrentYoga(yogaIndex);

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sunPosition, moonPosition]); // Include dependencies to properly track state changes

  // Calculate positions for rendering
  const sunAngle = sunPosition * (Math.PI / 180);
  const moonAngle = moonPosition * (Math.PI / 180);
  const combinedAngle = ((sunPosition + moonPosition) % 360) * (Math.PI / 180);

  // Sun coordinates
  const sunX = centerX + Math.cos(sunAngle) * (radius - 40);
  const sunY = centerY + Math.sin(sunAngle) * (radius - 40);

  // Moon coordinates
  const moonX = centerX + Math.cos(moonAngle) * (radius - 40);
  const moonY = centerY + Math.sin(moonAngle) * (radius - 40);

  // Yoga point coordinates
  const yogaX = centerX + Math.cos(combinedAngle) * (radius - 20);
  const yogaY = centerY + Math.sin(combinedAngle) * (radius - 20);

  // Create wheel segments
  const segmentAngle = 360 / 27;
  const wheelSegments = YOGA_NAMES.map((yoga, index) => {
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    // Create the segment path
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    // Highlight current yoga
    const isCurrent = index === currentYoga;

    return (
      <Path
        key={index}
        d={pathData}
        fill={isCurrent ? "#4c1d95" : "#1e293b"}
        stroke="#64748b"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 10,
      }}
    >
      <Svg
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Background circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius + 10}
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Wheel segments */}
        <G>{wheelSegments}</G>

        {/* Orbital paths */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius - 40}
          fill="none"
          stroke="#475569"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* Sun */}
        <Circle
          cx={sunX}
          cy={sunY}
          r="30"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
        />

        {/* Moon */}
        <Circle
          cx={moonX}
          cy={moonY}
          r="20"
          fill="#f1f5f9"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Lines connecting to show how Yoga is calculated */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={sunX}
          y2={sunY}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <Line
          x1={centerX}
          y1={centerY}
          x2={moonX}
          y2={moonY}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Yoga point (combined position) */}
        <Circle
          cx={yogaX}
          cy={yogaY}
          r="8"
          fill="#a855f7"
          stroke="#a855f7"
          strokeWidth="1"
        />
        <Line
          x1={centerX}
          y1={centerY}
          x2={yogaX}
          y2={yogaY}
          stroke="#a855f7"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      </Svg>

      {/* Text content with adequate spacing */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            marginBottom: 2,
          }}
          bold
          small
        >
          Current Yoga:{" "}
          <Text small style={{ color: "#a855f7" }}>
            {YOGA_NAMES[currentYoga]}
          </Text>
        </Text>

        <Text
          style={{
            color: "#94a3b8",
            marginBottom: 2,
          }}
          small
        >
          <Text small style={{ color: "#fbbf24" }}>
            {Math.round(sunPosition)}°
          </Text>{" "}
          (Sun) +{" "}
          <Text small style={{ color: "#e2e8f0" }}>
            {Math.round(moonPosition)}°
          </Text>{" "}
          (Moon) ={" "}
          <Text small style={{ color: "white" }}>
            {Math.round((sunPosition + moonPosition) % 360)}°
          </Text>
        </Text>

        <Text
          style={{
            color: "#94a3b8",
            textAlign: "center",
          }}
          small
        >
          <Text small style={{ color: "white" }}>
            {Math.round((sunPosition + moonPosition) % 360)}°
          </Text>{" "}
          ÷ {(360 / 27).toFixed(1)}° ={" "}
          <Text small style={{ color: "#a855f7" }}>
            Yoga #{currentYoga + 1} ({YOGA_NAMES[currentYoga]})
          </Text>
        </Text>
      </View>
    </View>
  );
};

export const SLIDES: InfoSlide[] = [
  {
    background: (
      <ImageBackground
        image={require("../../../../../assets/yoga/moon-sun-measurement.png")}
      />
    ),
    ...commonSlideProps,
    description: (
      <Base>
        Yoga is a combination of the Sun's and Moon's longitudes, divided into
        27 equal parts of 13°20' each. Each division is called a Yoga.
      </Base>
    ),
  },
  {
    background: <VedicWheel />,
    ...commonSlideProps,
    description: (
      <View style={{ ...StyleUtils.flexColumn(10) }}>
        <Base>
          Just like Nakshatras, there are 27 Yogas in total, each lasting for a fixed portion of time.
        </Base>
        <Base>
          Each Yoga is associated with certain qualities that influence a
          person's nature, health, and success in activities.
        </Base>
      </View>
    ),
  },
];
