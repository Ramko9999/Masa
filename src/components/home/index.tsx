import { truncateToDay } from "@/util/date";
import { useState } from "react";
import { WeekCalendar } from "@/components/calendar";
import React from "react";
import { Pachanga } from "@/components/panchanga";
import { CalendarMonth } from "../calendar/month";

type HomeActions = {
  onTithiClick?: () => void;
  onYogaClick?: () => void;
  onNakshatraClick?: () => void;
  onVaaraClick?: () => void;
  onMasaClick?: () => void;
};

type HomeProps = {
  actions: HomeActions;
};

export function Home({ actions }: HomeProps) {
  const [selectedDay, setSelectedDay] = useState(truncateToDay(Date.now()));

  return (
    <>
      <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <CalendarMonth />
      <Pachanga
        onTithiClick={actions.onTithiClick}
        onVaaraClick={actions.onVaaraClick}
        onYogaClick={actions.onYogaClick}
        onMasaClick={actions.onMasaClick}
        onNakshatraClick={actions.onNakshatraClick}
        selectedDay={selectedDay}
      />
    </>
  );
}
