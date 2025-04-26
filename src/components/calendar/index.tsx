import { ColorSchemeName, Platform, StyleSheet, useWindowDimensions } from "react-native";
import { truncateToDay } from "@/util/date";
import { MonthCalendar } from "./month";
import { CalendarContext, Selection } from "./context";
import { BottomSheet, BottomSheetRef } from "../util/sheet";
import { useThemedStyles } from "@/theme/color";
import { useRef, useState } from "react";

const calendarProviderStylesFactory = (
  _: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  monthCalendarSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
  },
});

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({
    date: truncateToDay(Date.now()),
    lastEditedBy: "week",
  });
  const { height } = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);

  const openMonthCalendar = () => {
    setIsMonthCalendarOpen(true);
  };

  const calendarProviderStyles = useThemedStyles(
    calendarProviderStylesFactory
  );

  return (
    <CalendarContext.Provider
      value={{ selection, setSelection, openMonthCalendar }}
    >
      <>
        {children}
        <BottomSheet
          ref={bottomSheetRef}
          show={isMonthCalendarOpen}
          onHide={() => setIsMonthCalendarOpen(false)}
          contentStyle={calendarProviderStyles.monthCalendarSheet}
          contentHeight={
            Platform.OS === "ios" ? height * 0.41 : Math.max(height * 0.41, 400)
          }
          hitslopHeight={height * 0.075}
        >
          <MonthCalendar
            onFinishDayClick={() => bottomSheetRef.current?.hide()}
          />
        </BottomSheet>
      </>
    </CalendarContext.Provider>
  );
}