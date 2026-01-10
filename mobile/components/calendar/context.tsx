import { truncateToDay } from "@/util/date";
import { createContext, useContext } from "react";

export type Selection = {
    date: number;
    lastEditedBy: "month" | "week";
}

type CalendarContextType = {
    selection: Selection;
    setSelection: (selection: Selection) => void;
    openMonthCalendar: () => void;
}

export const CalendarContext = createContext<CalendarContextType>({
    selection: {
        date: truncateToDay(Date.now()),
        lastEditedBy: "week"
    },
    setSelection: () => { },
    openMonthCalendar: () => { }
});

export function useCalendar() {
    return useContext(CalendarContext);
}
