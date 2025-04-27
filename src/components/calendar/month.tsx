import { View, Text, scaleFontSize } from "@/theme";
import {
  StyleSheet,
  useWindowDimensions,
  ColorSchemeName,
  useColorScheme,
} from "react-native";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { useState, useCallback, useRef, memo } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

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

const dayStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    aspectRatio: 1,
  },
  pressable: {
    paddingHorizontal: "20%",
    paddingVertical: "10%",
  },
  text: {
    fontWeight: "normal",
  },
  selected: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  today: {
    backgroundColor: useGetColor(AppColor.tint, theme),
  },
  selectedText: {
    color: useGetColor(AppColor.background, theme),
    fontWeight: "bold",
  },
  todayText: {
    color: useGetColor(AppColor.background, theme),
    fontWeight: "bold",
  },
  overlay: {
    ...StyleUtils.flexRowCenterAll(),
    borderRadius: "50%",
    width: "75%",
    aspectRatio: 1,
    position: "absolute",
  },
});

interface DayProps {
  day: number | null;
  isSelected: boolean;
  onPress: () => void;
}

function Day({ day, isSelected, onPress }: DayProps) {
  const dayStyles = useThemedStyles(dayStylesFactory);
  const isToday = day === truncateToDay(Date.now());
  const { height } = useWindowDimensions();
  return (
    <View style={[dayStyles.container]}>
      <View
        style={[
          dayStyles.overlay,
          isToday && dayStyles.today,
          isSelected && dayStyles.selected,
        ]}
      />
      <TouchableOpacity
        style={dayStyles.pressable}
        onPress={day !== null ? onPress : undefined}
        disabled={day === null}
      >
        <Text
          large
          style={[
            dayStyles.text,
            isSelected && dayStyles.selectedText,
            isToday && dayStyles.todayText,
          ]}
        >
          {day !== null ? new Date(day).getDate() : null}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const weekStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRow(),
    flex: 1,
  },
});

interface WeekProps {
  week: (number | null)[];
  selectedDate: number;
  onDayClick: (day: number) => void;
}

function Week({ week, selectedDate, onDayClick }: WeekProps) {
  const weekStyles = useThemedStyles(weekStylesFactory);
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

const monthStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    flex: 1,
  },
  weekdayRow: {
    ...StyleUtils.flexRow(),
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
    const monthStyles = useThemedStyles(monthStylesFactory);

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

const monthCalendarHeaderStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
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
  const monthCalendarHeaderStyles = useThemedStyles(
    monthCalendarHeaderStylesFactory
  );
  const theme = useColorScheme();
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
                ? useGetColor(AppColor.primary, theme)
                : useGetColor(AppColor.tint, theme)
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoForward} disabled={!canGoForward}>
          <ChevronRight
            size={scaleFontSize(28)}
            color={
              canGoForward
                ? useGetColor(AppColor.primary, theme)
                : useGetColor(AppColor.tint, theme)
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

const pagerMonthCalendarStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    paddingHorizontal: "3%",
    backgroundColor: useGetColor(AppColor.background, theme),
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

  const pagerMonthCalendarStyles = useThemedStyles(
    pagerMonthCalendarStylesFactory
  );
  return (
    <View
      style={[
        pagerMonthCalendarStyles.container,
        { paddingBottom: height * 0.025 },
      ]}
    >
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
        style={{ height: height * 0.35, width: "100%" }}
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
