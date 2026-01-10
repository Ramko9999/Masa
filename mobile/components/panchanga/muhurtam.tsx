import React from "react";
import { View, Text } from "@/theme";
import {
  ColorSchemeName,
  useColorScheme,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { MuhurtamInterval } from "@/api/panchanga/core/muhurtam";
import { shadeColor, tintColor } from "@/util/color";
import { useTranslation } from "react-i18next";
import { getHumanReadableTime } from "@/util/date";

function getBarColor(
  isPositive: boolean,
  isCurrent: boolean,
  theme: ColorSchemeName
) {
  const baseColor = isPositive ? "#3EBA46" : "#E54A4F";
  if (isCurrent) return baseColor;
  if (theme === "dark") {
    return shadeColor(baseColor, 0.5);
  }
  return tintColor(baseColor, 0.5);
}

const muhurtamStyles = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRow(),
    alignItems: "flex-start" as const,
    marginTop: -10,
  },
  barContainer: {
    width: 24,
    alignItems: "center" as const,
    marginRight: 16,
  },
  bar: {
    width: 12,
    height: "100%",
    overflow: "hidden",
    borderRadius: 6,
  },
  item: {
    height: "100%",
    ...StyleUtils.flexColumn(2),
    justifyContent: "center",
  },
  pastText: {
    opacity: 0.5,
    textDecorationLine: "line-through" as const,
  },
  futureText: {
    opacity: 0.5,
  },
});

type MuhurtamProps = {
  muhurtam: MuhurtamInterval;
};

function Muhurtam({ muhurtam }: MuhurtamProps) {
  const styles = useThemedStyles(muhurtamStyles);
  const theme = useColorScheme();
  const { height } = useWindowDimensions();
  const isPast = muhurtam.endTime < Date.now();
  const isFuture = muhurtam.startTime > Date.now();
  const isCurrent =
    muhurtam.startTime <= Date.now() && Date.now() < muhurtam.endTime;

  const { t } = useTranslation();

  return (
    <View style={[styles.container, { height: height * 0.08 }]}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              backgroundColor: getBarColor(
                muhurtam.isPositive,
                isCurrent,
                theme
              ),
            },
          ]}
        />
      </View>
      <View style={styles.item}>
        <Text
          neutral
          bold
          style={[
            isPast ? styles.pastText : undefined,
            isFuture ? styles.futureText : undefined,
          ]}
        >
          {t(`muhurtam.${muhurtam.muhurtham}`)}
        </Text>
        <Text
          small
          style={[
            isPast ? styles.pastText : undefined,
            isFuture ? styles.futureText : undefined,
          ]}
        >
          {t("home.cards.muhurtam.time", {
            start: getHumanReadableTime(muhurtam.startTime),
            end: getHumanReadableTime(muhurtam.endTime),
          })}
        </Text>
      </View>
    </View>
  );
}

const muhurtamsStyles = (theme: any): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    marginTop: "2%",
  },
});

type MuhurtamsProps = {
  muhurtams: MuhurtamInterval[];
};

export function Muhurtams({ muhurtams }: MuhurtamsProps) {
  const sortedMuhurtams = [...muhurtams].sort(
    (a, b) => a.startTime - b.startTime
  );
  const styles = useThemedStyles(muhurtamsStyles);

  return (
    <View style={styles.container}>
      {sortedMuhurtams.map((muhurtam, index) => (
        <Muhurtam key={index} muhurtam={muhurtam} />
      ))}
    </View>
  );
}
