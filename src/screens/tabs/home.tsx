import { truncateToDay } from "@/util/date";
import { useState } from "react";
import { WeekCalendar } from "@/components/calendar";
import React from "react";
import { Pachanga } from "@/components/panchanga";
import { NakshatraInfoSheet, TithiInfoSheet, YogaInfoSheet } from "@/components/sheets";

export function Home() {
    const [selectedDay, setSelectedDay] = useState(truncateToDay(Date.now()));
    const [showTithiSheet, setShowTithiSheet] = useState(false);
    const [showYogaSheet, setShowYogaSheet] = useState(false);
    const [showNakshatraSheet, setShowNakshatraSheet] = useState(false);

    return (
        <>
            <WeekCalendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
            <Pachanga
                onTithiClick={() => setShowTithiSheet(true)}
                onVaaraClick={() => { }}
                onYogaClick={() => setShowYogaSheet(true)}
                onMasaClick={() => { }}
                onNakshatraClick={() => setShowNakshatraSheet(true)}
                selectedDay={selectedDay}
            />
            <TithiInfoSheet
                show={showTithiSheet}
                onHide={() => setShowTithiSheet(false)}
            />
            <YogaInfoSheet
                show={showYogaSheet}
                onHide={() => setShowYogaSheet(false)}
            />
            <NakshatraInfoSheet
                show={showNakshatraSheet}
                onHide={() => setShowNakshatraSheet(false)}
            />
        </>
    );
}