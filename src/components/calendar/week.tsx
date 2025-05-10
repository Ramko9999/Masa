import { useGetColor, useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { ColorSchemeName, StyleSheet, TouchableOpacity } from "react-native";
import { AppColor } from "@/theme/color";
import { View, Text } from "@/theme";
import { useCallback, useEffect, useState, memo, useRef } from "react";
import {
  dayOfWeekFull,
  dayOfWeekShort,
  generateEnclosingWeek,
  monthFull,
  truncateToDay,
} from "@/util/date";
import { useCalendar } from "@/components/calendar/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { useLocation } from "@/context/location";
import { useTranslation } from "react-i18next";

const dayStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  overlay: {
    ...StyleUtils.flexColumn(),
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 10,
    padding: 8,
  },
  selectedOverlay: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  todayOverlay: {
    backgroundColor: useGetColor(AppColor.tint, theme),
  },
  text: {
    color: useGetColor(AppColor.tint, theme),
  },
  selectedText: {
    color: useGetColor(AppColor.background, theme),
  },
  todayText: {
    color: useGetColor(AppColor.background, theme),
    fontWeight: "bold",
  },
});

type DayProps = {
  day: number;
  isSelected: boolean;
  isToday: boolean;
  onClick: (day: number) => void;
};

function Day({ day, isSelected, isToday, onClick }: DayProps) {
  const dayStyles = useThemedStyles(dayStylesFactory);
  const { i18n } = useTranslation();

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        onClick(day);
      }}
    >
      <View style={dayStyles.container}>
        <View
          style={[
            dayStyles.overlay,
            isToday && dayStyles.todayOverlay,
            isSelected && dayStyles.selectedOverlay,
          ]}
        >
          <Text
            style={[
              dayStyles.text,
              isSelected && dayStyles.selectedText,
              isToday && dayStyles.todayText,
            ]}
          >
            {new Date(day).getDate()}
          </Text>
          <Text
            tiny
            style={[
              dayStyles.text,
              isSelected && dayStyles.selectedText,
              isToday && dayStyles.todayText,
            ]}
          >
            {dayOfWeekShort(i18n.language, day)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const weekStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
  },
});

interface WeekProps {
  week: number[];
  selectedDate: number;
  onClick: (date: number) => void;
}

function shouldNotRenderWeek(prevProps: WeekProps, nextProps: WeekProps) {

  const doesSelectedDateSelectionChangeMatter = (
    prevProps.selectedDate === nextProps.selectedDate ||
    (!prevProps.week.includes(prevProps.selectedDate) &&
      !nextProps.week.includes(nextProps.selectedDate))
  );

  return JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week) && prevProps.onClick === nextProps.onClick && doesSelectedDateSelectionChangeMatter;
}

const Week = memo(
  function Week({ week, selectedDate, onClick }: WeekProps) {
    return (
      <View style={[weekStyles.container]}>
        {week.map((dayDate, index) => (
          <Day
            key={index}
            day={dayDate}
            isSelected={selectedDate === dayDate}
            isToday={truncateToDay(Date.now()) === dayDate}
            onClick={() => onClick(dayDate)}
          />
        ))}
      </View>
    );
  },
  shouldNotRenderWeek
);

const calendarTitleStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "2%"
  },
  leftColumn: {
    ...StyleUtils.flexColumn(2),
  },
  rightColumn: {
    ...StyleUtils.flexColumn(2),
    alignItems: "flex-end",
  },
  dateContainer: {
    ...StyleUtils.flexRow(8),
    alignItems: "center",
  }
});

type CalendarTitleProps = {
  day: number;
};

function formatCalendarTitleDate(language: string, date: number): { monthDay: string; year: string } {
  const d = new Date(date);
  const month = new Intl.DateTimeFormat(language, { month: "long" }).format(d);
  const day = d.getDate();
  const year = d.getFullYear().toString();
  return {
    monthDay: `${month} ${day}`,
    year
  };
}

function CalendarTitle({ day }: CalendarTitleProps) {
  const { openMonthCalendar } = useCalendar();
  const calendarTitleStyles = useThemedStyles(calendarTitleStylesFactory);
  const { location } = useLocation();
  const { i18n } = useTranslation();
  const { monthDay, year } = formatCalendarTitleDate(i18n.language, day);

  return (
    <View style={calendarTitleStyles.container}>
      <View style={calendarTitleStyles.leftColumn}>
        <Text big semibold>
          {dayOfWeekFull(i18n.language, day)}
        </Text>
        <Text tint semibold big>
          {location?.place}
        </Text>
      </View>
      <TouchableOpacity
        style={calendarTitleStyles.rightColumn}
        onPress={openMonthCalendar}
      >
        <Text tint semibold big>
          {monthDay}
        </Text>
        <Text tint semibold big>
          {year}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function generateWeeksData(currentDate: number) {
  const date = new Date(currentDate);
  const startDay = new Date(date.getFullYear() - 2, date.getMonth(), 1);
  const endDay = new Date(date.getFullYear() + 2, date.getMonth() + 1, 1);
  const weeks = [];
  for (let day = startDay; day < endDay; day.setDate(day.getDate() + 7)) {
    const week = generateEnclosingWeek(day.getTime());
    weeks.push(week);
  }
  return weeks;
}

function findIndexThatContainsDate(data: number[][], date: number) {
  return data.findIndex((week) => week.includes(date));
}

const weekCalendarStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(5),
    paddingHorizontal: "3%",
    paddingVertical: "2%",
  },
  page: {
    ...StyleUtils.flexRowCenterAll(),
  },
});

const OFFSCREEN_PAGES = 25;

export function WeekCalendar() {
  const insets = useSafeAreaInsets();
  const { selection, setSelection } = useCalendar();
  const pagerRef = useRef<PagerView>(null);
  const [data] = useState<number[][]>(generateWeeksData(selection.date));
  const [currentPage, setCurrentPage] = useState(
    findIndexThatContainsDate(data, selection.date)
  );

  const onDayClick = useCallback(
    (day: number) => {
      setSelection({ date: day, lastEditedBy: "week" });
    },
    [setSelection]
  );

  useEffect(() => {
    if (selection.lastEditedBy !== "week") {
      const newIndex = findIndexThatContainsDate(data, selection.date);
      if (newIndex !== currentPage) {
        pagerRef.current?.setPage(newIndex);
      }
    }
  }, [selection.date, selection.lastEditedBy]);

  const onPageSelected = useCallback(
    (event: any) => {
      const newIndex = event.nativeEvent.position;
      setCurrentPage(newIndex);
      if (!data[newIndex].includes(selection.date)) {
        setSelection({ date: data[newIndex][0], lastEditedBy: "week" });
      }
    },
    [data, selection.date, setSelection]
  );

  return (
    <View
      style={[weekCalendarStyles.container, { paddingTop: insets.top + 20 }]}
    >
      <CalendarTitle day={selection.date} />
      <PagerView
        ref={pagerRef}
        style={{ aspectRatio: 6 }}
        initialPage={currentPage}
        onPageSelected={onPageSelected}
      >
        {data.map((week, index) => (
          <View
            key={week[0].toString()}
            style={weekCalendarStyles.page}
            collapsable={false}
          >
            {index >= currentPage - OFFSCREEN_PAGES &&
              index <= currentPage + OFFSCREEN_PAGES ? (
              <Week
                week={week}
                selectedDate={selection.date}
                onClick={onDayClick}
              />
            ) : (
              <View />
            )}
          </View>
        ))}
      </PagerView>
    </View>
  );
}