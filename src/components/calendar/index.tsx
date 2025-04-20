import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useState, useRef } from "react";
import { truncateToDay } from "@/util/date";
import { MonthCalendar } from "./month";
import { CalendarContext, Selection } from "./context";
import { BottomSheet, BottomSheetRef } from "../util/sheet";

const calendarProviderStyles = StyleSheet.create({
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
          contentHeight={Math.max(height * 0.41, 350)}
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
