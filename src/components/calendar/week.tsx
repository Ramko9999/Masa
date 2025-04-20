import { useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import {
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AppColor } from "@/theme/color";
import { View, Text } from "@/theme";
import { useCallback, useEffect, useState, memo, useRef } from "react";
import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_ABBR,
  generateEnclosingWeek,
  truncateToDay,
} from "@/util/date";
import { useCalendar } from "@/components/calendar/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";

const WEEK_WIDTH = 0.94;
const DAY_HEIGHT = 0.07;

const dayStyles = StyleSheet.create({
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
    backgroundColor: useGetColor(AppColor.primary),
  },
  todayOverlay: {
    backgroundColor: useGetColor(AppColor.tint),
  },
  text: {
    color: useGetColor(AppColor.tint),
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
  day: number;
  isSelected: boolean;
  isToday: boolean;
  onClick: (day: number) => void;
};

function Day({ day, isSelected, isToday, onClick }: DayProps) {
  const { height } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={{ flex: 1, height: height * DAY_HEIGHT }}
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
            small
            style={[
              dayStyles.text,
              isSelected && dayStyles.selectedText,
              isToday && dayStyles.todayText,
            ]}
          >
            {DAYS_OF_WEEK_ABBR[new Date(day).getDay()]}
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

const Week = memo(
  function Week({ week, selectedDate, onClick }: WeekProps) {
    const { width } = useWindowDimensions();
    return (
      <View style={[weekStyles.container, { width: width * WEEK_WIDTH }]}>
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
  (prevProps, nextProps) => {
    return (
      (prevProps.selectedDate === nextProps.selectedDate ||
        (!prevProps.week.includes(prevProps.selectedDate) &&
          !nextProps.week.includes(nextProps.selectedDate))) &&
      JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week) &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

const calendarTitleStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
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
  const { openMonthCalendar } = useCalendar();
  return (
    <View style={calendarTitleStyles.container}>
      <Text huge bold>
        {DAYS_OF_WEEK[new Date(day).getDay()]}
      </Text>
      <TouchableOpacity
        style={calendarTitleStyles.date}
        onPress={openMonthCalendar}
      >
        <Text tint semibold big>
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            new Date(day)
          )}{" "}
          {new Date(day).getDate().toString().padStart(2, "0")}
        </Text>
        <Text tint semibold big>
          {new Date(day).getFullYear()}
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
    paddingVertical: "4%",
  },
  page: {
    ...StyleUtils.flexRowCenterAll(),
  },
});

const OFFSCREEN_PAGES = 6;

export function WeekCalendar() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
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
        style={{ height: height * DAY_HEIGHT }}
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
