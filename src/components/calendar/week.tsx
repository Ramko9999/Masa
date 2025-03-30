import { useGetColor } from "@/theme/color";
import Animated, { useSharedValue, useAnimatedStyle, interpolateColor, withTiming } from "react-native-reanimated";
import { convertHexToRGBA } from "@/util/color";
import { StyleUtils } from "@/theme/style-utils";
import { useWindowDimensions, StyleSheet, TouchableOpacity, ViewToken, Platform } from "react-native";
import { AppColor } from "@/theme/color";
import { View, Text } from "@/theme";
import { useCallback, useEffect, useState, memo, useRef } from "react";
import { DAYS_OF_WEEK, DAYS_OF_WEEK_ABBR, generateEnclosingWeek, truncateToDay } from "@/util/date";
import { useCalendar } from "@/components/calendar/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";

const WEEK_WIDTH = 0.94;

const dayStyles = StyleSheet.create({
    container: {
        ...StyleUtils.flexColumn(),
        alignItems: "center",
        justifyContent: "center",
        height: 70,
        gap: 4,
        borderWidth: 1.5,
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
    const textPrimary = useGetColor(AppColor.primary);
    const textPrimaryTint = useGetColor(AppColor.tint);
    const selectedBorderColor = convertHexToRGBA(textPrimaryTint, 0.4);
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
            ["transparent", selectedBorderColor]
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
                <Text style={[{ color: isSelected ? textPrimary : textPrimaryTint }]}>
                    {new Date(day).getDate()}
                </Text>
                <Text
                    small
                    black
                    style={{
                        color: isSelected ? textPrimary : textPrimaryTint,
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

interface WeekProps {
    week: number[];
    selectedDate: number;
    onClick: (date: number) => void;
}

const Week = memo(function Week({ week, selectedDate, onClick }: WeekProps) {
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
}, (prevProps, nextProps) => {
    return (
        (prevProps.selectedDate === nextProps.selectedDate || (!prevProps.week.includes(prevProps.selectedDate) && !nextProps.week.includes(nextProps.selectedDate))) &&
        JSON.stringify(prevProps.week) === JSON.stringify(nextProps.week)
        && prevProps.onClick === nextProps.onClick
    );
});

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
            <TouchableOpacity style={calendarTitleStyles.date} onPress={openMonthCalendar}>
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
        ...StyleUtils.flexColumn(),
        paddingHorizontal: "3%",
    },
});


// todo: make the scrolling smoother on android
export function WeekCalendar() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const { selection, setSelection } = useCalendar();
    const flatListRef = useRef<FlatList<number[]>>(null);
    const [data, setData] = useState<number[][]>(generateWeeksData(selection.date));

    useEffect(() => {
        if (selection.lastEditedBy !== "week") {
            flatListRef.current?.scrollToIndex({
                index: findIndexThatContainsDate(data, selection.date),
                animated: false,
            });
        }

    }, [selection.date, selection.lastEditedBy])

    const onDayClick = useCallback((day: number) => {
        setSelection({ date: day, lastEditedBy: "week" });
    }, [setSelection]);

    const renderWeek = useCallback(({ item: week }: { item: number[] }) => (
        <Week week={week} selectedDate={selection.date} onClick={onDayClick} />
    ), [selection.date, onDayClick]);

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: width * WEEK_WIDTH,
        offset: width * index * WEEK_WIDTH,
        index,
    }), []);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<number[]>[] }) => {
        if (viewableItems && viewableItems.length > 0) {
            if (!viewableItems[0].item.includes(selection.date)) {
                setSelection({ date: viewableItems[0].item[0], lastEditedBy: "week" });
            };
        }
    }, [selection.date, setSelection]);

    return (
        <View
            style={[weekCalendarStyles.container, { paddingTop: insets.top + 20 }]}
        >
            <CalendarTitle day={selection.date} />
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderWeek}
                showsHorizontalScrollIndicator={false}
                horizontal
                snapToInterval={width * WEEK_WIDTH}
                decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.95}
                snapToAlignment="start"
                initialScrollIndex={findIndexThatContainsDate(data, truncateToDay(Date.now()))}
                getItemLayout={getItemLayout}
                keyExtractor={(week) => week[0].toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 10,
                    minimumViewTime: 300,
                }}
                onMomentumScrollEnd={(event) => {
                    if (Platform.OS === 'android') {
                        const offsetX = event.nativeEvent.contentOffset.x;
                        const snapIndex = Math.round(offsetX / (width * WEEK_WIDTH));
                        const correctOffset = snapIndex * width * WEEK_WIDTH;

                        if (offsetX !== correctOffset) {
                            flatListRef.current?.scrollToOffset({
                                offset: correctOffset,
                                animated: true
                            });
                        }
                    }
                }}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={5}
            />
        </View>
    );

}
