import React from "react";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
  InfoVisual,
  InfoNote,
  InfoPageSectionTranslation,
} from "@/components/util/info-page";
import { ColorSchemeName, StyleSheet } from "react-native";
import { Text, View } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { MasaOrbit } from "@/components/masa/orbit";
import { MASA_NAMES } from "@/api/panchanga/core/masa";
import { useTranslation } from "react-i18next";


const tableStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: useGetColor(AppColor.border, theme),
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: useGetColor(AppColor.border, theme),
  },
  lastRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

export function MasaInfoPage() {
  const tableStyles = useThemedStyles(tableStylesFactory);

  const { t } = useTranslation();

  const intro = t("masa_info.intro", { returnObjects: true }) as string[];
  const sections = t("masa_info.sections", {
    returnObjects: true,
  }) as InfoPageSectionTranslation[];

  return (
    <InfoPage title={t("masa_info.title")}>
      <InfoSection>
        {intro.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>{sections[0].title}</InfoSectionTitle>
        {sections[0].paragraphs.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoSection>
        <InfoNote>{t("masa_info.masa_orbit.caption")}</InfoNote>
        <InfoVisual>
          <MasaOrbit />
        </InfoVisual>
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>{sections[1].title}</InfoSectionTitle>
        {sections[1].paragraphs.map((p, i) => (
          <InfoParagraph key={i}>{p}</InfoParagraph>
        ))}
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>{t("masa_info.masa_names.title")}</InfoSectionTitle>
        <InfoVisual>
          <View style={tableStyles.container}>
            {MASA_NAMES.map((item, index) => (
              <View
                key={index}
                style={
                  index === MASA_NAMES.length - 1
                    ? tableStyles.lastRow
                    : tableStyles.row
                }
              >
                <Text>
                  {index + 1}. {t(`masa.${item}`)}
                </Text>
              </View>
            ))}
          </View>
        </InfoVisual>
      </InfoSection>
    </InfoPage>
  );
}
