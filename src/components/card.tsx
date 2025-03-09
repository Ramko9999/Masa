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
    fontSize: 14,
    paddingBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: useGetColor("text-primary-tint-1"),
  },
});

type CardProps = {
  title: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <View
      style={[
        styles.cardContainer,
        { borderColor: useGetColor("text-primary-tint-2") },
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}
