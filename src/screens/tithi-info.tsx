import React from "react";
import { TithiOrbit } from "@/components/tithi/orbit";
import { MoonSlider } from "@/components/tithi/moon-phases";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
  InfoSpacer,
  InfoNote,
  InfoLabel,
  InfoVisual,
  InfoPageSectionTranslation,
} from "@/components/util/info-page";
import { useTranslation } from "react-i18next";

export function TithiInfoPage() {
  const { t } = useTranslation();

  const intro = t("tithi_info.intro", { returnObjects: true }) as string[];

  const sections = t("tithi_info.sections", {
    returnObjects: true,
  }) as InfoPageSectionTranslation[];

  return (
    <InfoPage title={t("tithi_info.title")}>
      <InfoSection>
        {intro.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoVisual>
        <InfoNote>{t("tithi_info.tithi_orbit.caption")}</InfoNote>
        <InfoSpacer />
        <TithiOrbit />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>{sections[0].title}</InfoSectionTitle>
        {sections[0].paragraphs.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoVisual>
        <InfoLabel>{t("tithi_info.moon_phases.title")}</InfoLabel>
        <MoonSlider />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>{sections[1].title}</InfoSectionTitle>
        {sections[1].paragraphs.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>
    </InfoPage>
  );
}
