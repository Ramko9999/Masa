import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleUtils } from "../../theme/style-utils";
import { View, Text } from "../../theme";
import { generateEnclosingWeek, truncateToDay } from "../../util/date";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetColor } from "../../theme/color";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DAYS_OF_WEEK_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    gap: 4,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
  },
});

type DayProps = {
  day: number;
  isSelected: boolean;
  isMarked: boolean;
  isToday: boolean;
  onClick: (day: number) => void;
};

function Day({ day, isSelected, isMarked, isToday, onClick }: DayProps) {
  const textPrimary = useGetColor("text-primary");
  const textPrimaryTint1 = useGetColor("text-primary-tint-1");
  const textPrimaryTint2 = useGetColor("text-primary-tint-2");
  const selectionAnimation = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    selectionAnimation.value = withTiming(isSelected ? 1 : 0, {
      duration: 100,
    });
  }, [isSelected]);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selectionAnimation.value,
      [0, 1],
      ["transparent", textPrimaryTint2]
    ),
  }));

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        onClick(day);
      }}
    >
      <Animated.View style={[dayStyles.container, animatedBorderStyle]}>
        <Text style={[{ color: isSelected ? textPrimary : textPrimaryTint2 }]}>
          {new Date(day).getDate()}
        </Text>
        <Text
          small
          style={{
            color: isSelected ? textPrimary : textPrimaryTint1,
          }}
        >
          {DAYS_OF_WEEK_ABBR[new Date(day).getDay()]}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const weekStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
  },
});

type WeekProps = {
  week: number[];
  isSelected: (date: number) => boolean;
  isMarked: (date: number) => boolean;
  isToday: (date: number) => boolean;
  onClick: (date: number) => void;
};

function Week({ week, isSelected, isMarked, isToday, onClick }: WeekProps) {
  return (
    <View style={weekStyles.container}>
      {week.map((dayDate, index) => (
        <Day
          key={index}
          day={dayDate}
          isSelected={isSelected(dayDate)}
          isMarked={isMarked(dayDate)}
          isToday={isToday(dayDate)}
          onClick={() => onClick(dayDate)}
        />
      ))}
    </View>
  );
}

const calendarTitleStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    paddingBottom: "2%",
  },
  date: {
    ...StyleUtils.flexColumn(),
    alignItems: "center",
  },
});

type CalendarTitleProps = {
  day: number;
};

function CalendarTitle({ day }: CalendarTitleProps) {
  return (
    <View style={calendarTitleStyles.container}>
      <Text large bold>
        {DAYS_OF_WEEK[new Date(day).getDay()]}
      </Text>
      <View style={calendarTitleStyles.date}>
        <Text tint1>
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            new Date(day)
          )}{" "}
          {new Date(day).getDate()}
        </Text>
        <Text tint2>{new Date(day).getFullYear()}</Text>
      </View>
    </View>
  );
}

const weekCalendarStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    flex: 1,
    paddingHorizontal: "3%",
  },
});

type WeekCalendarProps = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

export function WeekCalendar({ selectedDay, onSelectDay }: WeekCalendarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[weekCalendarStyles.container, { paddingTop: insets.top + 20 }]}
    >
      <CalendarTitle day={selectedDay} />
      <Week
        week={generateEnclosingWeek(selectedDay)}
        isSelected={(date) => date === selectedDay}
        isMarked={() => false}
        isToday={() => false}
        onClick={onSelectDay}
      />
    </View>
  );
}
