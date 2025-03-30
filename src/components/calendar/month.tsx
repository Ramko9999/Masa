import { View, Text } from "@/theme";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewToken,
} from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { useState, useCallback, useRef } from "react";
import {
  formatMonthYear,
  generateCalendarDays,
  groupIntoWeeks,
  DAYS_OF_WEEK_ABBR,
  truncateToDay,
} from "@/util/date";
import { StyleUtils } from "@/theme/style-utils";
import { useCalendar } from "@/components/calendar/context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { FlatList } from "react-native-gesture-handler";

const MONTH_CALENDAR_WIDTH = 0.96;

const dayStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  text: {
    fontWeight: "normal",
  },
  selectedPressable: {
    backgroundColor: useGetColor(AppColor.primary),
  },
  todayPressable: {
    backgroundColor: useGetColor(AppColor.tint),
  },
  selectedText: {
    color: useGetColor(AppColor.background),
    fontWeight: "bold",
  },
  todayText: {
    color: useGetColor(AppColor.background),
    fontWeight: "bold",
  },
  overlay: {
    ...StyleUtils.flexRowCenterAll(),
    height: 35,
    width: 35,
    borderRadius: 17,
  },
});

interface DayProps {
  day: number | null;
  isSelected: boolean;
  onPress: () => void;
}

function Day({ day, isSelected, onPress }: DayProps) {
  const isToday = day === truncateToDay(Date.now());
  return (
    <Pressable
      style={dayStyles.container}
      onPress={day !== null ? onPress : undefined}
      disabled={day === null}
    >
      {day !== null && (
        <View
          style={[
            dayStyles.overlay,
            isToday && dayStyles.todayPressable,
            isSelected && dayStyles.selectedPressable,
          ]}
        >
          <Text
            large
            style={[
              dayStyles.text,
              isSelected && dayStyles.selectedText,
              isToday && dayStyles.todayText,
            ]}
          >
            {new Date(day).getDate()}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const weekStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
  },
});

interface WeekProps {
  week: (number | null)[];
  selectedDate: number;
  onDayClick: (day: number) => void;
}

function Week({ week, selectedDate, onDayClick }: WeekProps) {
  return (
    <View style={weekStyles.container}>
      {week.map((day, index) => {
        return (
          <Day
            key={index}
            day={day}
            isSelected={selectedDate === day}
            onPress={() => day !== null && onDayClick(day)}
          />
        );
      })}
    </View>
  );
}

const monthStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingBottom: "2%",
  },
  header: {
    ...StyleUtils.flexRow(),
    justifyContent: "center",
    marginBottom: 16,
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
  },
});

interface MonthProps {
  year: number;
  month: number;
  selectedDate: number;
  onDayClick: (day: number) => void;
}


function Month({ year, month, selectedDate, onDayClick }: MonthProps) {
  const { width } = useWindowDimensions();
  const daysArray = generateCalendarDays(year, month);
  const weeks = groupIntoWeeks(daysArray);

  return (
    <View
      style={[monthStyles.container, { width: width * MONTH_CALENDAR_WIDTH }]}
    >
      <View style={monthStyles.weekdayRow}>
        {DAYS_OF_WEEK_ABBR.map((day, index) => (
          <View key={index} style={monthStyles.weekdayCell}>
            <Text semibold tint>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <Week
          key={weekIndex}
          week={week}
          selectedDate={selectedDate}
          onDayClick={onDayClick}
        />
      ))}
    </View>
  );
};

interface MonthData {
  year: number;
  month: number;
}

const monthCalendarHeaderStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingTop: "5%",
    paddingBottom: "4%",
  },
  actions: {
    ...StyleUtils.flexRow(2),
  },
});

type MonthCalendarHeaderProps = {
  monthDatum: MonthData;
  canGoBack: boolean;
  onGoBack: () => void;
  canGoForward: boolean;
  onGoForward: () => void;
};

function MonthCalendarHeader({
  monthDatum,
  canGoBack,
  onGoBack,
  canGoForward,
  onGoForward,
}: MonthCalendarHeaderProps) {
  return (
    <View style={monthCalendarHeaderStyles.container}>
      <Text semibold large>
        {formatMonthYear(new Date(monthDatum.year, monthDatum.month))}
      </Text>
      <View style={monthCalendarHeaderStyles.actions}>
        <Pressable onPress={onGoBack} disabled={!canGoBack}>
          <ChevronLeft
            size={28}
            color={
              canGoBack
                ? useGetColor(AppColor.primary)
                : useGetColor(AppColor.tint)
            }
          />
        </Pressable>
        <Pressable onPress={onGoForward} disabled={!canGoForward}>
          <ChevronRight
            size={28}
            color={
              canGoForward
                ? useGetColor(AppColor.primary)
                : useGetColor(AppColor.tint)
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const monthCalendarStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "2%",
  },
});

type MonthCalendarProps = {
  onFinishDayClick: (day: number) => void;
};

export function MonthCalendar({ onFinishDayClick }: MonthCalendarProps) {
  const { width } = useWindowDimensions();
  const { selection, setSelection } = useCalendar();
  const [data, _] = useState<MonthData[]>(generateMonthsData(Date.now()));
  const [dataIndex, setDataIndex] = useState(
    findIndexThatContainsDate(data, Date.now())
  );
  const flatListRef = useRef<FlatList<MonthData>>(null);

  const onDayClick = useCallback(
    (day: number) => {
      setSelection({ date: day, lastEditedBy: "month" });
      onFinishDayClick(day);
    },
    [onFinishDayClick]
  );

  const renderMonth = useCallback(
    ({ item }: { item: MonthData }) => {
      return (
        <Month {...item} selectedDate={selection.date} onDayClick={onDayClick} />
      );
    },
    [selection.date, onDayClick]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width * MONTH_CALENDAR_WIDTH,
      offset: width * MONTH_CALENDAR_WIDTH * index,
      index,
    }),
    []
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<MonthData>[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        setDataIndex(viewableItems[0].index!);
      }
    },
    []
  );

  const onGoBack = useCallback(() => {
    if (dataIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: dataIndex - 1,
        animated: true,
      });
    }
  }, [dataIndex]);

  const onGoForward = useCallback(() => {
    if (dataIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: dataIndex + 1,
        animated: true,
      });
    }
  }, [dataIndex]);

  return (
    <View style={monthCalendarStyles.container}>
      <MonthCalendarHeader
        monthDatum={data[dataIndex]}
        canGoBack={dataIndex > 0}
        onGoBack={onGoBack}
        canGoForward={dataIndex < data.length - 1}
        onGoForward={onGoForward}
      />
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderMonth}
        horizontal
        initialScrollIndex={findIndexThatContainsDate(data, selection.date)}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => `${item.year}-${item.month}`}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
          minimumViewTime: 300,
        }}
        pagingEnabled
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
        onMomentumScrollEnd={(event) => {
          if (Platform.OS === 'android') {
            const offsetX = event.nativeEvent.contentOffset.x;
            const snapIndex = Math.round(offsetX / (width * MONTH_CALENDAR_WIDTH));
            const correctOffset = snapIndex * width * MONTH_CALENDAR_WIDTH;

            if (offsetX !== correctOffset) {
              flatListRef.current?.scrollToOffset({
                offset: correctOffset,
                animated: true
              });
            }
          }
        }}
      />
    </View>
  );
}

function findIndexThatContainsDate(data: MonthData[], date: number) {
  return data.findIndex((item) => doesCorrespondToMonth(item, date));
}

function doesCorrespondToMonth(item: MonthData, date: number) {
  const d = new Date(date);
  return item.year === d.getFullYear() && d.getMonth() === item.month;
}

function generateMonthsData(currentDate: number) {
  const date = new Date(currentDate);
  const currentYearMonth = 12 * date.getFullYear() + date.getMonth();
  return Array.from({ length: 49 }, (_, i) => {
    const yearMonth = currentYearMonth - (24 - i);
    const year = Math.floor(yearMonth / 12);
    const month = yearMonth % 12;
    return {
      year,
      month,
    };
  });
}
