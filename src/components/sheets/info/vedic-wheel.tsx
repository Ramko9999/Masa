import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import Svg, { Circle, Path, G, Line } from "react-native-svg";
import { Text } from "@/theme";

interface VedicWheelProps {
  size?: number;
  currentIndex?: number;
  names: string[];
  type: "nakshatra" | "yoga";
  showSun?: boolean;
  showMoon?: boolean;
  showYogaPoint?: boolean;
}

const WheelInfo = ({
  type,
  names,
  currentPosition,
  sunPosition,
  moonPosition,
}: {
  type: "nakshatra" | "yoga";
  names: string[];
  currentPosition: number;
  sunPosition: number;
  moonPosition: number;
}) => {
  const combinedPosition = Math.round((sunPosition + moonPosition) % 360);
  const segmentSize = (360 / names.length).toFixed(1);
  const textColor = "#a855f7";

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <Text style={{ color: "white", marginBottom: 2 }} bold small>
        Current {type === "yoga" ? "Yoga" : "Nakshatra"}:{" "}
        <Text small style={{ color: textColor }}>
          {names[currentPosition]}
        </Text>
      </Text>

      {type === "yoga" ? (
        <Text style={{ color: "#94a3b8", marginBottom: 2 }} small>
          <Text small style={{ color: "#fbbf24" }}>
            {Math.round(sunPosition)}°
          </Text>{" "}
          (Sun) +{" "}
          <Text small style={{ color: "#e2e8f0" }}>
            {Math.round(moonPosition)}°
          </Text>{" "}
          (Moon) ={" "}
          <Text small style={{ color: "white" }}>
            {combinedPosition}°
          </Text>
        </Text>
      ) : null}

      <Text style={{ color: "#94a3b8", textAlign: "center" }} small>
        {type === "yoga" ? (
          <>
            <Text small style={{ color: "white" }}>
              {combinedPosition}°
            </Text>{" "}
            ÷ {segmentSize}° =
          </>
        ) : (
          <>
            Moon at{" "}
            <Text small style={{ color: "#e2e8f0" }}>
              {Math.round(moonPosition)}°
            </Text>{" "}
            ÷ {segmentSize}° =
          </>
        )}{" "}
        <Text small style={{ color: textColor }}>
          {type === "yoga" ? "Yoga" : "Nakshatra"} #{currentPosition + 1} (
          {names[currentPosition]})
        </Text>
      </Text>
    </View>
  );
};

const VedicWheel: React.FC<VedicWheelProps> = ({
  size,
  currentIndex = 0,
  names,
  type,
  showSun = type === "yoga",
  showMoon = true,
  showYogaPoint = type === "yoga",
}) => {
  // Basic setup
  const screenHeight = Dimensions.get("window").height;
  const wheelSize = size || screenHeight * 0.3 * 0.8;

  // State for positions and current index
  const [sunPosition, setSunPosition] = useState(45);
  const [moonPosition, setMoonPosition] = useState(135);
  const [currentPosition, setCurrentPosition] = useState(currentIndex);

  // Animation frame reference
  const animationRef = useRef<number>(0);

  // Time tracking for smooth animation
  const lastTimeRef = useRef<number>(0);

  // SVG dimensions
  const viewBoxSize = 1000;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = viewBoxSize * 0.4;

  // Calculate current index based on positions
  const calculateIndex = (sun: number, moon: number) => {
    if (type === "yoga") {
      const combinedPosition = (sun + moon) % 360;
      return Math.floor(combinedPosition / (360 / names.length));
    } else {
      // For nakshatra, only moon position matters
      return Math.floor(moon / (360 / names.length));
    }
  };

  // Smoother animation with requestAnimationFrame
  useEffect(() => {
    // Speed in degrees per second
    const sunSpeed = 2; // 2 degrees per second (3 minutes for full circle)
    const moonSpeed = type === "yoga" ? 27 : 13; // Slower for nakshatra visualization

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

      // Calculate and update index
      const newIndex = calculateIndex(newSunPos, newMoonPos);
      setCurrentPosition(newIndex);

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
  }, [sunPosition, moonPosition, type, names.length]);

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
  const segmentAngle = 360 / names.length;
  const wheelSegments = names.map((name, index) => {
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

    // Highlight current position
    const isCurrent = index === currentPosition;

    // Different colors for nakshatra and yoga
    const highlightColor = "#4c1d95";
    const baseColor = "#1e293b";

    return (
      <Path
        key={index}
        d={pathData}
        fill={isCurrent ? highlightColor : baseColor}
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
        {showSun && (
          <Circle
            cx={sunX}
            cy={sunY}
            r="30"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
          />
        )}

        {/* Moon */}
        {showMoon && (
          <Circle
            cx={moonX}
            cy={moonY}
            r="20"
            fill="#f1f5f9"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        )}

        {/* Lines connecting to show calculation */}
        {showSun && (
          <Line
            x1={centerX}
            y1={centerY}
            x2={sunX}
            y2={sunY}
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
        )}

        {showMoon && (
          <Line
            x1={centerX}
            y1={centerY}
            x2={moonX}
            y2={moonY}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
        )}

        {/* Yoga point (combined position) */}
        {showYogaPoint && (
          <>
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
          </>
        )}
      </Svg>

      <WheelInfo
        type={type}
        names={names}
        currentPosition={currentPosition}
        sunPosition={sunPosition}
        moonPosition={moonPosition}
      />
    </View>
  );
};

export default VedicWheel;
