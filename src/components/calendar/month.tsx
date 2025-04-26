import { View, Text } from "@/theme";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AppColor, useGetColor } from "@/theme/color";
import { useState, useCallback, useRef, memo } from "react";
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
import PagerView from "react-native-pager-view";

const monthCalendarHeaderStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "3%",
    paddingVertical: "2%",
  },
  actions: {
    ...StyleUtils.flexRow(2),
  },
});

const calendarStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    flex: 1,
  },
  headerRow: {
    ...StyleUtils.flexRow(),
    width: "100%",
  },
  headerCell: {
    flex: 1,
    aspectRatio: 1.5,
    ...StyleUtils.flexRowCenterAll(),
  },
  weeksContainer: {
    flex: 1,
    ...StyleUtils.flexColumn(),
  },
});

const dayStyles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1.5,
  },
  button: {
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    borderRadius: 10,
  },
  selected: {
    backgroundColor: useGetColor(AppColor.primary),
  },
  today: {
    backgroundColor: useGetColor(AppColor.tint),
  },
  text: {
    fontWeight: "normal",
  },
  selectedText: {
    color: useGetColor(AppColor.background),
    fontWeight: "bold",
  },
  todayText: {
    color: useGetColor(AppColor.background),
    fontWeight: "bold",
  },
});

type DayProps = {
  day: number | null;
  selectedDate: number;
  onDayClick: (day: number) => void;
};

const Day = memo(function Day({ day, selectedDate, onDayClick }: DayProps) {
  if (!day) {
    return <View style={dayStyles.container} />;
  }

  const isToday = day === truncateToDay(Date.now());
  const isSelected = day === selectedDate;
  console.log(day, selectedDate, isToday);
  return (
    <View style={dayStyles.container}>
      <TouchableOpacity
        onPress={() => onDayClick(day)}
        style={[
          dayStyles.button,
          isToday && dayStyles.today,
          isSelected && dayStyles.selected,
        ]}
      >
        <Text
          semibold
          style={[
            dayStyles.text,
            isSelected && dayStyles.selectedText,
            isToday && dayStyles.todayText,
          ]}
        >
          {new Date(day).getDate()}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const weekStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    width: "100%",
  },
});

type WeekProps = {
  week: (number | null)[];
  selectedDate: number;
  onDayClick: (day: number) => void;
};

const Week = memo(function Week({ week, selectedDate, onDayClick }: WeekProps) {
  return (
    <View style={weekStyles.container}>
      {week.map((day, dayIndex) => (
        <Day
          key={dayIndex}
          day={day}
          selectedDate={selectedDate}
          onDayClick={onDayClick}
        />
      ))}
    </View>
  );
});

interface MonthProps {
  year: number;
  month: number;
  selectedDate: number;
  onDayClick: (day: number) => void;
}

const Month = memo(
  function Month({ year, month, selectedDate, onDayClick }: MonthProps) {
    const daysArray = generateCalendarDays(year, month);
    const weeks = groupIntoWeeks(daysArray);

    return (
      <View style={calendarStyles.container}>
        <View style={calendarStyles.headerRow}>
          {DAYS_OF_WEEK_ABBR.map((day, index) => (
            <View key={index} style={calendarStyles.headerCell}>
              <Text semibold tint>
                {day}
              </Text>
            </View>
          ))}
        </View>

        <View style={calendarStyles.weeksContainer}>
          {weeks.map((week, weekIndex) => (
            <Week
              key={weekIndex}
              week={week}
              selectedDate={selectedDate}
              onDayClick={onDayClick}
            />
          ))}
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.year === nextProps.year &&
      prevProps.month === nextProps.month &&
      prevProps.selectedDate === nextProps.selectedDate &&
      prevProps.onDayClick === nextProps.onDayClick
    );
  }
);

interface MonthData {
  year: number;
  month: number;
}

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
        <TouchableOpacity onPress={onGoBack} disabled={!canGoBack}>
          <ChevronLeft
            size={28}
            color={
              canGoBack
                ? useGetColor(AppColor.primary)
                : useGetColor(AppColor.tint)
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoForward} disabled={!canGoForward}>
          <ChevronRight
            size={28}
            color={
              canGoForward
                ? useGetColor(AppColor.primary)
                : useGetColor(AppColor.tint)
            }
          />
        </TouchableOpacity>
      </View>
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

const pagerMonthCalendarStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    flex: 1,
  },
  page: {
    ...StyleUtils.flexRow(),
    flex: 1,
  },
});

type MonthCalendarProps = {
  onFinishDayClick: (day: number) => void;
};

const OFFSCREEN_PAGES = 1;

export function MonthCalendar({ onFinishDayClick }: MonthCalendarProps) {
  const { selection, setSelection } = useCalendar();
  const [data] = useState<MonthData[]>(generateMonthsData(Date.now()));
  const [currentPage, setCurrentPage] = useState(
    findIndexThatContainsDate(data, selection.date)
  );
  const pagerRef = useRef<PagerView>(null);

  const onDayClick = useCallback(
    (day: number) => {
      setSelection({ date: day, lastEditedBy: "month" });
      onFinishDayClick(day);
    },
    [onFinishDayClick]
  );

  const onPageSelected = useCallback((event: any) => {
    const newIndex = event.nativeEvent.position;
    setCurrentPage(newIndex);
  }, []);

  const onGoBack = useCallback(() => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    }
  }, [currentPage]);

  const onGoForward = useCallback(() => {
    if (currentPage < data.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  }, [currentPage, data.length]);

  return (
    <View style={pagerMonthCalendarStyles.container}>
      <MonthCalendarHeader
        monthDatum={data[currentPage]}
        canGoBack={currentPage > 0}
        onGoBack={onGoBack}
        canGoForward={currentPage < data.length - 1}
        onGoForward={onGoForward}
      />
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={currentPage}
        onPageSelected={onPageSelected}
      >
        {data.map((monthData, index) => (
          <View
            key={`${monthData.year}-${monthData.month}`}
            style={pagerMonthCalendarStyles.page}
            collapsable={false}
          >
            {index >= currentPage - OFFSCREEN_PAGES &&
            index <= currentPage + OFFSCREEN_PAGES ? (
              <Month
                {...monthData}
                selectedDate={selection.date}
                onDayClick={onDayClick}
              />
            ) : (
              <View style={pagerMonthCalendarStyles.page} />
            )}
          </View>
        ))}
      </PagerView>
    </View>
  );
}
