import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
const styles = StyleSheet.create({
  cardContainer: {
    ...StyleUtils.flexColumn(4),
    width: "100%",
    paddingVertical: "2%",
    borderColor: useGetColor(AppColor.border),
    borderTopWidth: 1,
  },
  mainContainer: {
    ...StyleUtils.flexRow(5),
    alignItems: "center",
  },
  titleContainer: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center"
  },
});

type CardProps = {
  title: string;
  mainText?: string;
  caption?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Card({
  title,
  mainText,
  caption,
  onClick,
  children,
}: CardProps) {
  return (
    <Pressable onPress={onClick} disabled={!onClick}>
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <Text bold tint sneutral>
            {title}
          </Text>
        </View>
        <View style={styles.mainContainer}>
          {mainText && (
            <Text bold larger>
              {mainText}
            </Text>
          )}
        </View>
        {caption && <Text sneutral>{caption}</Text>}
        {children}
      </View>
    </Pressable>
  );
}
