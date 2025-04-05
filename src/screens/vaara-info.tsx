import React from "react";
import { InfoPage, InfoSection, InfoParagraph, InfoSectionTitle } from "@/components/util/info-page";
import { InfoTable, Column } from "@/components/util/info-table";

export function VaaraInfoPage() {
  const columns: Column[] = [
    { header: "Graha", key: "graha", flex: 0.6 },
    { header: "Vaara", key: "vaara", flex: 1.2 },
    { header: "Represents", key: "represents", flex: 1.2 },
  ];

  const data = [
    {
      graha: "Sun",
      vaara: "Ravivaara (Sunday)",
      represents: "Vitality, Authority, Energy",
    },
    {
      graha: "Moon",
      vaara: "Somavaara (Monday)",
      represents: "Emotions, Calmness",
    },
    {
      graha: "Mars",
      vaara: "Mangalavaara (Tuesday)",
      represents: "Courage, Strength",
    },
    {
      graha: "Mercury",
      vaara: "Budhavaara (Wednesday)",
      represents: "Intellect, Communication, Learning",
    },
    {
      graha: "Jupiter",
      vaara: "Guruvaara (Thursday)",
      represents: "Wisdom, Expansion, Luck",
    },
    {
      graha: "Venus",
      vaara: "Shukravaara (Friday)",
      represents: "Love, Beauty",
    },
    {
      graha: "Saturn",
      vaara: "Shanivaara (Saturday)",
      represents: "Discipline, Patience, Challenges",
    },
  ];

  return (
    <InfoPage title="Vaara">
      <InfoSection>
        <InfoParagraph>
          Vaara means day of the week in the Hindu calendar.
        </InfoParagraph>
        <InfoParagraph>
          Each day is linked to a graha (planet), and each graha has special
          qualities. These qualities influence our mood, energy, and
          activities for the day.
        </InfoParagraph>
        <InfoTable columns={columns} data={data} />
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>
          How is Vaara decided?
        </InfoSectionTitle>
        <InfoParagraph>
          Each day is made up of 24 hours (called Horas).
        </InfoParagraph>
        <InfoParagraph>
          Every Hora is linked to a planet, and the planet that is linked to
          the first Hora after sunrise decides the Vaara.
        </InfoParagraph>
      </InfoSection>
    </InfoPage>
  );
}
