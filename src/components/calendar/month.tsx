import { View, Text } from "@/theme";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { useState, useCallback, useRef, memo, useEffect } from "react";
import {
  formatMonthYear,
  isSameDay,
  generateCalendarDays,
  groupIntoWeeks,
  DAYS_OF_WEEK_ABBR,
} from "@/util/date";

// DayCell styles
const dayCellStyles = {
  container: {
    flex: 1,
    padding: 2,
  },
  pressable: (
    isSelected: boolean,
    isToday: boolean,
    tintColor: string
  ): ViewStyle => ({
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    backgroundColor: isSelected
      ? useGetColor(AppColor.primary)
      : isToday
      ? tintColor
      : "transparent",
    borderRadius: 6,
  }),
  text: (
    isSelected: boolean,
    isToday: boolean,
    backgroundColor: string,
    primaryColor: string
  ): TextStyle => ({
    color: isSelected || isToday ? backgroundColor : primaryColor,
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
      <View key={cellId} style={dayCellStyles.container}>
        <Pressable
          style={dayCellStyles.pressable(isSelected, isToday, tintColor)}
          onPress={day !== null ? onPress : undefined}
          disabled={day === null}
        >
          {day !== null && (
            <Text
              style={dayCellStyles.text(
                isSelected,
                isToday,
                backgroundColor,
                primaryColor
              )}
            >
              {day}
            </Text>
          )}
        </Pressable>
      </View>
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

// Calendar configuration
const CALENDAR_CONFIG = {
  MONTHS_TO_LOAD: {
    PAST: 24,
    FUTURE: 24,
  },
  INITIAL_MONTH_INDEX: 24,
  VIEWPORT_RENDER_SIZE: 5,
  LOAD_MORE_THRESHOLD: 5,
  MONTHS_TO_ADD: 12,
};

// Function to generate month data from an index
const getMonthDataFromIndex = (index: number) => {
  const date = new Date();
  date.setMonth(
    date.getMonth() + (index - CALENDAR_CONFIG.INITIAL_MONTH_INDEX)
  );
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    key: `${date.getFullYear()}-${date.getMonth()}-${index}`,
    index,
  };
};

export function CalendarMonth() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get("window"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthsData, setMonthsData] = useState(() =>
    Array.from(
      {
        length:
          CALENDAR_CONFIG.MONTHS_TO_LOAD.PAST +
          CALENDAR_CONFIG.MONTHS_TO_LOAD.FUTURE +
          1,
      },
      (_, i) => getMonthDataFromIndex(i)
    )
  );

  const flatListRef = useRef<FlatList>(null);

  const tintColor = useGetColor(AppColor.tint);
  const backgroundColor = useGetColor(AppColor.background);
  const primaryColor = useGetColor(AppColor.primary);

  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;

  // Handle loading more months
  const loadMoreMonths = useCallback((direction: "past" | "future") => {
    setMonthsData((currentMonths) => {
      if (direction === "past") {
        const firstIndex = currentMonths[0].index;
        const newMonths = Array.from(
          { length: CALENDAR_CONFIG.MONTHS_TO_ADD },
          (_, i) =>
            getMonthDataFromIndex(
              firstIndex - CALENDAR_CONFIG.MONTHS_TO_ADD + i
            )
        );
        return [...newMonths, ...currentMonths];
      } else {
        const lastIndex = currentMonths[currentMonths.length - 1].index;
        const newMonths = Array.from(
          { length: CALENDAR_CONFIG.MONTHS_TO_ADD },
          (_, i) => getMonthDataFromIndex(lastIndex + i + 1)
        );
        return [...currentMonths, ...newMonths];
      }
    });
  }, []);

  // Handle scroll events to check if we need to load more months
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.x;
      const width = dimensions.width;
      const currentIndex = Math.round(offset / width);

      // Check if we're near the start or end
      if (currentIndex < CALENDAR_CONFIG.LOAD_MORE_THRESHOLD) {
        loadMoreMonths("past");
      } else if (
        currentIndex >
        monthsData.length - CALENDAR_CONFIG.LOAD_MORE_THRESHOLD - 1
      ) {
        loadMoreMonths("future");
      }
    },
    [dimensions.width, monthsData.length, loadMoreMonths]
  );

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const renderMonth = useCallback(
    ({
      item: { year, month, key },
    }: {
      item: { year: number; month: number; key: string };
    }) => {
      const daysArray = generateCalendarDays(year, month);
      const weeks = groupIntoWeeks(daysArray);
      const monthYearDisplay = formatMonthYear(new Date(year, month));
      const today = new Date();

      return (
        <View style={[styles.container, { width: dimensions.width }]}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View style={styles.monthTitleContainer}>
                <Text style={styles.monthTitle}>{monthYearDisplay}</Text>
              </View>
            </View>
          </View>

          <View>
            <View style={styles.weekdayRow}>
              {DAYS_OF_WEEK_ABBR.map((day, index) => (
                <View key={index} style={styles.weekdayCell}>
                  <Text semibold tint>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  const dateObj =
                    day !== null ? new Date(year, month, day) : null;
                  const isSelected = dateObj
                    ? isSameDay(dateObj, selectedDate)
                    : false;
                  const isToday = dateObj ? isSameDay(dateObj, today) : false;
                  const cellId =
                    day !== null
                      ? `date-${day}-${month}-${year}`
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
          </View>
        </View>
      );
    },
    [selectedDate, tintColor, backgroundColor, primaryColor, dimensions.width]
  );

  const handleDateClick = useCallback(
    (day: number | null, dateObj: Date | null) => {
      if (day !== null && dateObj) {
        setSelectedDate(dateObj);
      }
    },
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: dimensions.width,
      offset: dimensions.width * index,
      index,
    }),
    [dimensions.width]
  );

  return (
    <FlatList
      ref={flatListRef}
      data={monthsData}
      renderItem={renderMonth}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={CALENDAR_CONFIG.INITIAL_MONTH_INDEX}
      getItemLayout={getItemLayout}
      keyExtractor={(item) => item.key}
      onScroll={handleScroll}
      onScrollToIndexFailed={() => {}}
      maxToRenderPerBatch={CALENDAR_CONFIG.VIEWPORT_RENDER_SIZE}
      windowSize={CALENDAR_CONFIG.VIEWPORT_RENDER_SIZE}
      initialNumToRender={CALENDAR_CONFIG.VIEWPORT_RENDER_SIZE}
    />
  );
}
