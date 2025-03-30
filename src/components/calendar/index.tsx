import {
  StyleSheet,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  truncateToDay,
} from "@/util/date";
import { MiniSheet, MiniSheetRef } from "@/components/util/sheet/mini";
import { MonthCalendar } from "./month";
import { CalendarContext, Selection } from "./context";

const calendarProviderStyles = StyleSheet.create({
  monthCalendarSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white"
  }
})

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({
    date: truncateToDay(Date.now()),
    lastEditedBy: "week"
  });
  const miniSheetRef = useRef<MiniSheetRef>(null);

  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);

  const openMonthCalendar = () => {
    setIsMonthCalendarOpen(true);
  }

  return (
    <CalendarContext.Provider value={{ selection, setSelection, openMonthCalendar }}>
      <>
        {children}
        <MiniSheet ref={miniSheetRef} show={isMonthCalendarOpen} onHide={() => setIsMonthCalendarOpen(false)} contentStyle={calendarProviderStyles.monthCalendarSheet}>
          <MonthCalendar onFinishDayClick={() => miniSheetRef.current?.hide()} />
        </MiniSheet>
      </>
    </CalendarContext.Provider>
  );
}
