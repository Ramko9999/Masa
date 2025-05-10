import {
  InfoPage,
  InfoPageSectionTranslation,
  InfoParagraph,
  InfoSection,
  InfoSectionTitle,
} from "@/components/util/info-page";
import { useTranslation } from "react-i18next";

export function MuhurtamInfoPage() {
  const { t } = useTranslation();

  const intro = t("muhurtam_info.intro", { returnObjects: true }) as string[];

  const sections = t("muhurtam_info.sections", {
    returnObjects: true,
  }) as InfoPageSectionTranslation[];

  return (
    <InfoPage title={t("muhurtam_info.title")}>
      <InfoSection>
        {intro.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      {sections.map((section, i) => (
        <InfoSection key={i}>
          <InfoSectionTitle>{section.title}</InfoSectionTitle>
          {section.paragraphs.map((p, j) => (
            <InfoParagraph key={j}>{p}</InfoParagraph>
          ))}
        </InfoSection>
      ))}
    </InfoPage>
  );
}
