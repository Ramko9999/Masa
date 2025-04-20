import { View, Text, scaleFontSize } from "@/theme";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
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

const MONTH_CALENDAR_WIDTH = 0.96;
const OVERLAY_HEIGHT_MULTIPLIER = 0.04;

const dayStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  text: {
    fontWeight: "normal",
  },
  selected: {
    backgroundColor: useGetColor(AppColor.primary),
  },
  today: {
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
    height: "60%",
    aspectRatio: 1,
    borderRadius: "50%",
  },
});

interface DayProps {
  day: number | null;
  isSelected: boolean;
  onPress: () => void;
}

function Day({ day, isSelected, onPress }: DayProps) {
  const isToday = day === truncateToDay(Date.now());
  const { height } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[dayStyles.container, { aspectRatio: 1 }]}
      onPress={day !== null ? onPress : undefined}
      disabled={day === null}
    >
      {day !== null && (
        <View
          style={[
            dayStyles.overlay,
            {
              borderRadius: (height * OVERLAY_HEIGHT_MULTIPLIER) / 2,
            },
            isToday && dayStyles.today,
            isSelected && dayStyles.selected,
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
    </TouchableOpacity>
  );
}

const weekStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    aspectRatio: 9.5,
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
  },
  weekdayRow: {
    flexDirection: "row",
    alignItems: "center",
    aspectRatio: 14,
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

const Month = memo(
  function Month({ year, month, selectedDate, onDayClick }: MonthProps) {
    const { width } = useWindowDimensions();
    const daysArray = generateCalendarDays(year, month);
    const weeks = groupIntoWeeks(daysArray);
    const { height } = useWindowDimensions();

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

const monthCalendarHeaderStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "3%",
    flex: 1,
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
        <TouchableOpacity onPress={onGoBack} disabled={!canGoBack}>
          <ChevronLeft
            size={scaleFontSize(28)}
            color={
              canGoBack
                ? useGetColor(AppColor.primary)
                : useGetColor(AppColor.tint)
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoForward} disabled={!canGoForward}>
          <ChevronRight
            size={scaleFontSize(28)}
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
    paddingHorizontal: "3%",
  },
  page: {
    ...StyleUtils.flexRow(),
  },
});

type MonthCalendarProps = {
  onFinishDayClick: (day: number) => void;
};

const OFFSCREEN_PAGES = 1;

export function MonthCalendar({ onFinishDayClick }: MonthCalendarProps) {
  const { height } = useWindowDimensions();
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
      <View style={{ height: height * 0.075 }}>
        <MonthCalendarHeader
          monthDatum={data[currentPage]}
          canGoBack={currentPage > 0}
          onGoBack={onGoBack}
          canGoForward={currentPage < data.length - 1}
          onGoForward={onGoForward}
        />
      </View>
      <PagerView
        ref={pagerRef}
        style={{ height: "100%", width: "100%" }}
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
