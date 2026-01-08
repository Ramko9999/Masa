import React from "react";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
} from "@/components/util/info-page";
import { InfoTable, Column } from "@/components/util/info-table";
import { useTranslation } from "react-i18next";

type VaaraRow = {
  graha: string;
  vaara: string;
  represents: string;
};

export default function VaaraInfoPage() {
  const { t } = useTranslation();

  const columns: Column[] = [
    { header: t("vaara_info.table.columns.graha"), key: "graha", flex: 0.6 },
    { header: t("vaara_info.table.columns.vaara"), key: "vaara", flex: 1.2 },
    {
      header: t("vaara_info.table.columns.represents"),
      key: "represents",
      flex: 1.2,
    },
  ];

  // Get the rows from i18n and cast them properly
  const rows = t("vaara_info.table.rows", {
    returnObjects: true,
  }) as VaaraRow[];

  const intro = t("vaara_info.intro", {
    returnObjects: true,
  }) as string[];

  return (
    <InfoPage title={t("vaara_info.title")}>
      <InfoSection>
        {intro.map((line, i) => (
          <InfoParagraph key={i}>{line}</InfoParagraph>
        ))}
        <InfoTable columns={columns} data={rows} />
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>{t("vaara_info.sections.0.title")}</InfoSectionTitle>
        {(
          t("vaara_info.sections.0.paragraphs", {
            returnObjects: true,
          }) as string[]
        ).map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>
    </InfoPage>
  );
}

