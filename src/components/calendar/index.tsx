import { StyleSheet } from "react-native";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { truncateToDay } from "@/util/date";
import { CalendarContext, Selection } from "./context";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MonthCalendar } from "./month";

const calendarProviderStyles = StyleSheet.create({
  monthCalendarSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
});

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({
    date: truncateToDay(Date.now()),
    lastEditedBy: "week",
  });
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const openMonthCalendar = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <CalendarContext.Provider
      value={{ selection, setSelection, openMonthCalendar }}
    >
      <>
        {children}
        <BottomSheetModal
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={calendarProviderStyles.monthCalendarSheet}
          snapPoints={snapPoints}
          index={0}
        >
          <BottomSheetView
            style={[
              calendarProviderStyles.contentContainer,
              { paddingBottom: insets.bottom },
            ]}
          >
            <MonthCalendar
              onFinishDayClick={() => {
                bottomSheetRef.current?.dismiss();
              }}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </>
    </CalendarContext.Provider>
  );
}
