import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
const styles = StyleSheet.create({
  cardContainer: {
    ...StyleUtils.flexColumn(4),
    width: "100%",
    paddingVertical: "2%",
  },
  mainContainer: {
    ...StyleUtils.flexRow(5),
    alignItems: "center",
  },
  titleContainer: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: useGetColor(AppColor.tint),
  },
});

type CardProps = {
  title: string;
  mainText?: string;
  caption?: string;
  onClick?: () => void;
  showExplainCaption?: boolean;
  children?: React.ReactNode;
};

export function Card({
  title,
  mainText,
  caption,
  onClick,
  showExplainCaption,
  children,
}: CardProps) {
  return (
    <TouchableOpacity onPress={onClick} disabled={!onClick}>
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <Text bold tint neutral>
            {title}
          </Text>
          {showExplainCaption && (
            <Text bold>
              What is this?
            </Text>
          )}
        </View>
        <View style={styles.mainContainer}>
          {mainText && (
            <Text bold big>
              {mainText}
            </Text>
          )}
        </View>
        {caption && <Text neutral>{caption}</Text>}
        {children}
      </View>
    </TouchableOpacity>
  );
}
