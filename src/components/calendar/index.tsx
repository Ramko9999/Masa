import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { StyleUtils } from "../../theme/style-utils";
import { View, Text } from "../../theme";
import {
  addDays,
  generateEnclosingWeek,
  removeDays,
  truncateToDay,
} from "../../util/date";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetColor } from "../../theme/color";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { convertHexToRGBA } from "../../util/color";
import { ArrayUtils } from "../../util/array";
import { InfiniteCalendar, PAGE_LOAD_SIZE } from "./infinite";

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
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 18,
  },
});

type DayProps = {
  day: number;
  isSelected: boolean;
  isToday: boolean;
  onClick: (day: number) => void;
};

function Day({ day, isSelected, isToday, onClick }: DayProps) {
  const textPrimary = useGetColor("text-primary");
  const textPrimaryTint1 = useGetColor("text-primary-tint-1");
  const textPrimaryTint2 = useGetColor("text-primary-tint-2");
  const secondary = useGetColor("secondary");
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
          black
          style={{
            color: isSelected ? secondary : textPrimaryTint1,
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
  isToday: (date: number) => boolean;
  onClick: (date: number) => void;
};

function Week({ week, isSelected, isToday, onClick }: WeekProps) {
  const { width } = useWindowDimensions();
  return (
    <View style={[weekStyles.container, { width: width * 0.94 }]}>
      {week.map((dayDate, index) => (
        <Day
          key={index}
          day={dayDate}
          isSelected={isSelected(dayDate)}
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
    alignItems: "flex-end",
  },
});

type CalendarTitleProps = {
  day: number;
};

function CalendarTitle({ day }: CalendarTitleProps) {
  return (
    <View style={calendarTitleStyles.container}>
      <Text large extrabold>
        {DAYS_OF_WEEK[new Date(day).getDay()]}
      </Text>
      <View style={calendarTitleStyles.date}>
        <Text tint1 bold>
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            new Date(day)
          )}{" "}
          {new Date(day).getDate().toString().padStart(2, "0")}
        </Text>
        <Text tint2 bold>
          {new Date(day).getFullYear()}
        </Text>
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

function generatePreviousWeeks(currentDate: number, n: number) {
  const weeks = [];
  const week = generateEnclosingWeek(currentDate);
  let weekDay = removeDays(week[0], 1);
  for (let i = 0; i < n; i++) {
    const lastWeek = generateEnclosingWeek(weekDay);
    weeks.push(lastWeek);
    weekDay = removeDays(lastWeek[0], 1);
  }
  return weeks.reverse();
}

function generateNextWeeks(currentDate: number, n: number) {
  const weeks = [];
  const week = generateEnclosingWeek(currentDate);
  let weekDay = addDays(ArrayUtils.last(week), 1);
  for (let i = 0; i < n; i++) {
    const nextWeek = generateEnclosingWeek(weekDay);
    weeks.push(nextWeek);
    weekDay = addDays(ArrayUtils.last(nextWeek), 1);
  }
  return weeks;
}

function generateInitialWeeks(currentDate: number, n: number) {
  const previousWeeks = generatePreviousWeeks(currentDate, n);
  const nextWeeks = generateNextWeeks(currentDate, n);
  return [...previousWeeks, generateEnclosingWeek(currentDate), ...nextWeeks];
}

type WeekCalendarProps = {
  selectedDay: number;
  onSelectDay: (date: number) => void;
};

export function WeekCalendar({ selectedDay, onSelectDay }: WeekCalendarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[weekCalendarStyles.container, { paddingTop: insets.top + 20 }]}
    >
      <CalendarTitle day={selectedDay} />
      <InfiniteCalendar
        initialData={generateInitialWeeks(selectedDay, PAGE_LOAD_SIZE)}
        initialDataIndex={PAGE_LOAD_SIZE}
        loadMore={(currentWeeks, loadSize) => [
          ...currentWeeks,
          ...generateNextWeeks(ArrayUtils.last(currentWeeks)[0], loadSize),
        ]}
        loadPrevious={(currentWeeks, loadSize) => [
          ...generatePreviousWeeks(currentWeeks[0][0], loadSize),
          ...currentWeeks,
        ]}
        onSelect={(currentWeek) => onSelectDay(currentWeek[0])}
        keyExtractor={(week) => week[0].toString()}
        render={(week, _) => (
          <Week
            week={week}
            isSelected={(date) => date === selectedDay}
            isToday={(date) => date === truncateToDay(Date.now())}
            onClick={(date) => {
              onSelectDay(date);
            }}
          />
        )}
      />
    </View>
  );
}
