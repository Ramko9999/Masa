import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { View, Text } from "../theme";
import { useGetColor } from "../theme/color";
import { DashedBorder } from "./util/dashed-border";

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    flexDirection: "column",
    paddingVertical: 15,
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: 16,
    paddingBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: useGetColor("text-primary-tint-1"),
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mainText: {
    fontSize: 32,
    lineHeight: 38,
  },
  caption: {
    fontSize: 16,
    lineHeight: 24,
    color: useGetColor("text-primary-tint-1"),
  },
});

type CardProps = {
  title: string;
  icon?: React.ReactNode;
  mainText: string;
  caption?: string;
  onClick?: () => void;
};

export function Card({ title, icon, mainText, caption, onClick }: CardProps) {
  const { width } = useWindowDimensions();
  const color = useGetColor("text-primary-tint-2");

  return (
    <TouchableOpacity onPress={onClick}>
      <DashedBorder
        width={width * 0.94} // Adjust based on your padding
        color={color}
        dashLength={4}
        dashGap={8}
        strokeWidth={2}
      />
      <View style={styles.cardContainer}>
        <Text black style={styles.cardTitle}>
          {title}
        </Text>
        <View style={styles.mainContainer}>
          {icon}
          <Text bold style={styles.mainText}>
            {mainText}
          </Text>
        </View>
        {caption && (
          <Text semibold style={styles.caption}>
            {caption}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
