import React from "react";
import { NakshatraOrbit } from "@/components/nakshatra/orbit";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
  InfoVisual,
  InfoPageSectionTranslation,
} from "@/components/util/info-page";
import { useTranslation } from "react-i18next";

export function NakshatraInfoPage() {
  const { t } = useTranslation();

  const intro = t("nakshatra_info.intro", { returnObjects: true }) as string[];
  const sections = t("nakshatra_info.sections", {
    returnObjects: true,
  }) as InfoPageSectionTranslation[];

  return (
    <InfoPage title={t("nakshatra_info.title")}>
      <InfoSection>
        {intro.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoVisual>
        <NakshatraOrbit />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>{sections[0].title}</InfoSectionTitle>
        {sections[0].paragraphs.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>
    </InfoPage>
  );
}
