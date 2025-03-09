import React from "react";
import Svg, { Line } from "react-native-svg";
import { StyleSheet, View } from "react-native";

type DashedBorderProps = {
  width: number;
  color: string;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 2, // Match the strokeWidth default
  },
});

export function DashedBorder({
  width,
  color,
  dashLength = 4,
  dashGap = 4,
  strokeWidth = 2,
}: DashedBorderProps) {
  // Calculate number of dashes needed
  const numberOfDashes = Math.ceil(width / (dashLength + dashGap));

  return (
    <View style={styles.container}>
      <Svg height={strokeWidth} width={width}>
        {Array.from({ length: numberOfDashes }).map((_, index) => (
          <Line
            key={index}
            x1={index * (dashLength + dashGap)}
            y1={strokeWidth / 2}
            x2={index * (dashLength + dashGap) + dashLength}
            y2={strokeWidth / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}
