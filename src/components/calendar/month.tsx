import { View, Text } from "@/theme";
import { Pressable, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { useState, useMemo, useCallback, useRef, memo } from "react";
import {
  formatMonthYear,
  isSameDay,
  generateCalendarDays,
  groupIntoWeeks,
  DAYS_OF_WEEK_ABBR,
} from "@/util/date";
import Animated, {
  FadeOut,
  SlideInRight,
  SlideInLeft,
  ZoomIn,
  LinearTransition,
} from "react-native-reanimated";

// DayCell styles
const dayCellStyles = {
  container: {
    flex: 1,
  },
  pressable: (isSelected: boolean, isToday: boolean, tintColor: string): ViewStyle => ({
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: isSelected
      ? tintColor
      : isToday
      ? `${tintColor}50`
      : "transparent",
    borderRadius: 8,
  }),
  text: (isSelected: boolean, isToday: boolean, backgroundColor: string, primaryColor: string): TextStyle => ({
    color: isSelected ? backgroundColor : primaryColor,
    fontWeight: isToday || isSelected ? "bold" : "normal",
  }),
};

const DayCell = memo(
  ({
    day,
    dateObj,
    isSelected,
    isToday,
    tintColor,
    backgroundColor,
    primaryColor,
    onPress,
    cellId,
  }: {
    day: number | null;
    dateObj: Date | null;
    isSelected: boolean;
    isToday: boolean;
    tintColor: string;
    backgroundColor: string;
    primaryColor: string;
    onPress: () => void;
    cellId: string;
  }) => {
    return (
      <Animated.View
        layout={LinearTransition}
        key={cellId}
        style={dayCellStyles.container}
        sharedTransitionTag={isSelected ? "selected-date" : undefined}
      >
        <Pressable
          style={dayCellStyles.pressable(isSelected, isToday, tintColor)}
          onPress={day !== null ? onPress : undefined}
          disabled={day === null}
        >
          {day !== null && (
            <Animated.Text
              entering={
                day === new Date().getDate() &&
                new Date().getMonth() === dateObj?.getMonth()
                  ? ZoomIn
                  : undefined
              }
              style={dayCellStyles.text(isSelected, isToday, backgroundColor, primaryColor)}
            >
              {day}
            </Animated.Text>
          )}
        </Pressable>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.day === nextProps.day &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isToday === nextProps.isToday &&
      isSameDay(prevProps.dateObj, nextProps.dateObj)
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: "3%",
    flex: 1,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
  },
  monthTitleContainer: {
    flex: 5,
    paddingLeft: 4,
    justifyContent: "center",
  },
  monthTitle: {
    fontWeight: "bold", 
    fontSize: 18,
  },
  navButtonContainer: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    padding: 4,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
});

export function CalendarMonth() {
  const [displayDate, setDisplayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState<"left" | "right">("right");

  const tintColor = useGetColor(AppColor.tint);
  const backgroundColor = useGetColor(AppColor.background);
  const primaryColor = useGetColor(AppColor.primary);

  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;

  const { currentYear, currentMonth } = useMemo(
    () => ({
      currentYear: displayDate.getFullYear(),
      currentMonth: displayDate.getMonth(),
    }),
    [displayDate]
  );

  const daysArray = useMemo(
    () => generateCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const weeks = useMemo(() => groupIntoWeeks(daysArray), [daysArray]);

  const goToPreviousMonth = useCallback(() => {
    setDirection("right");
    setDisplayDate((prevDate) => {
      const month = prevDate.getMonth() - 1;
      const year = prevDate.getFullYear() + (month < 0 ? -1 : 0);
      return new Date(year, month < 0 ? 11 : month, 1);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection("left");
    setDisplayDate((prevDate) => {
      const month = prevDate.getMonth() + 1;
      const year = prevDate.getFullYear() + (month > 11 ? 1 : 0);
      return new Date(year, month > 11 ? 0 : month, 1);
    });
  }, []);

  const handleDateClick = useCallback(
    (day: number | null, dateObj: Date | null) => {
      if (day !== null && dateObj) {
        setSelectedDate(dateObj);
      }
    },
    []
  );

  const today = useMemo(() => new Date(), []);

  const monthYearDisplay = useMemo(
    () => formatMonthYear(displayDate),
    [displayDate]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.monthTitleContainer}>
            <Animated.Text
              key={`month-title-${currentMonth}-${currentYear}`}
              entering={
                direction === "left"
                  ? SlideInLeft.duration(300)
                  : SlideInRight.duration(300)
              }
              exiting={FadeOut.duration(200)}
              style={styles.monthTitle}
            >
              {monthYearDisplay}
            </Animated.Text>
          </View>

          {/* Navigation buttons */}
          <View style={styles.navButtonContainer}>
            <Pressable
              onPress={goToPreviousMonth}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text bold>Prev</Text>
            </Pressable>
          </View>
          <View style={styles.navButtonContainer}>
            <Pressable
              onPress={goToNextMonth}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text bold>Next</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Animated.View
        key={`calendar-grid-${currentMonth}-${currentYear}`}
        entering={
          direction === "left"
            ? SlideInLeft.duration(300)
            : SlideInRight.duration(300)
        }
        exiting={FadeOut.duration(200)}
        layout={LinearTransition}
      >
        {/* Week day headers */}
        <View style={styles.weekdayRow}>
          {DAYS_OF_WEEK_ABBR.map((day, index) => (
            <View
              key={index}
              style={styles.weekdayCell}
            >
              <Text semibold tint>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar dates */}
        {weeks.map((week, weekIndex) => (
          <View
            key={weekIndex}
            style={styles.weekRow}
          >
            {week.map((day, dayIndex) => {
              const dateObj =
                day !== null ? new Date(currentYear, currentMonth, day) : null;

              const isSelected = dateObj
                ? isSameDay(dateObj, selectedDate)
                : false;
              const isToday = dateObj ? isSameDay(dateObj, today) : false;
              const cellId =
                day !== null
                  ? `date-${day}-${currentMonth}-${currentYear}`
                  : `empty-${weekIndex}-${dayIndex}`;

              return (
                <DayCell
                  key={cellId}
                  day={day}
                  dateObj={dateObj}
                  isSelected={isSelected}
                  isToday={isToday}
                  tintColor={tintColor}
                  backgroundColor={backgroundColor}
                  primaryColor={primaryColor}
                  onPress={() => handleDateClick(day, dateObj)}
                  cellId={cellId}
                />
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
