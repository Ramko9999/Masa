import React from "react";
import { TouchableOpacity, StyleSheet, ColorSchemeName } from "react-native";
import { View, Text } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";

const stylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  cardContainer: {
    ...StyleUtils.flexColumn(4),
    width: "100%",
    paddingVertical: "2%",
    borderColor: useGetColor(AppColor.border, theme),
    borderTopWidth: 1,
  },
  mainContainer: {
    ...StyleUtils.flexRow(5),
    alignItems: "center",
  },
  titleContainer: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
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
  const styles = useThemedStyles(stylesFactory);
  return (
    <TouchableOpacity onPress={onClick} disabled={!onClick}>
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
    </TouchableOpacity>
  );
}
