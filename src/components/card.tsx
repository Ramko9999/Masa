import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "../theme";
import { useGetColor } from "../theme/color";

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    flexDirection: "column",
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: useGetColor("text-primary-tint-2"),
    borderStyle: "dashed",
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
    gap: 10
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
  caption: string;
};

export function Card({ title, icon, mainText, caption }: CardProps) {
  return (
    <View
      style={[
        styles.cardContainer,
        { borderColor: useGetColor("text-primary-tint-2") },
      ]}
    >
      <Text black style={styles.cardTitle}>{title}</Text>
      <View style={styles.mainContainer}>
        {icon}
        <Text bold style={styles.mainText}>{mainText}</Text>
      </View>
      <Text semibold style={styles.caption}>{caption}</Text>
    </View>
  );
}
