import { ColorSchemeName, StyleSheet, useWindowDimensions } from "react-native";
import { truncateToDay } from "@/util/date";
import { MonthCalendar } from "./month";
import { CalendarContext, Selection } from "./context";
import { BottomSheetRef, GenericBottomSheet } from "../util/sheet";
import { useThemedStyles } from "@/theme/color";
import { useRef, useState } from "react";
import React from "react";

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
        <GenericBottomSheet
          ref={bottomSheetRef}
          show={isMonthCalendarOpen}
          onHide={() => setIsMonthCalendarOpen(false)}
          contentStyle={calendarProviderStyles.monthCalendarSheet}
          contentHeight={height * 0.5}
          hitslopHeight={height * 0.075}
        >
          <MonthCalendar
            onFinishDayClick={() => bottomSheetRef.current?.hide()}
          />
        </GenericBottomSheet>
      </>
    </CalendarContext.Provider>
  );
}
