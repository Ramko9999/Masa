import { truncateToDay } from "../../util/date";
import { useState } from "react";
import { WeekCalendar } from "../calendar";
import React from "react";
import { Pachanga } from "../panchanga";

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
