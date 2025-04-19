import React from "react";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
  InfoVisual,
  InfoNote,
} from "@/components/util/info-page";
import { ColorSchemeName, StyleSheet } from "react-native";
import { Text, View } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { MasaOrbit } from "@/components/masa/orbit";
import { MASA_NAMES } from "@/api/panchanga/core/masa";

const masaData = MASA_NAMES.map((name, index) => `${index + 1}. ${name}`);

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

  return (
    <InfoPage title="Masa">
      <InfoSection>
        <InfoParagraph>
          A Masa is a lunar month, which consists of 30 tithis, ~29.5 days.
        </InfoParagraph>
        <InfoParagraph>
          Masa, along with Tithi, play a central role in determinining festival
          dates.
        </InfoParagraph>
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>Two Systems of Counting Masa</InfoSectionTitle>
        <InfoParagraph>
          There are two traditional ways of defining when a Masa begins and
          ends:
        </InfoParagraph>
        <InfoParagraph>Amanta: New Moon (Amavasya) to New Moon</InfoParagraph>
        <InfoParagraph>
          Purnimanta: Full Moon (Purnima) to Full Moon
        </InfoParagraph>
        <InfoParagraph>
          Different regions in India follow different systems. For example,
          Amanta is common in South India, while Purnimanta is used in North
          India.
        </InfoParagraph>
      </InfoSection>

      <InfoSection>
        <InfoNote>Look at how the Masa changes</InfoNote>
        <InfoVisual>
          <MasaOrbit />
        </InfoVisual>
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>Lunar vs Solar Year</InfoSectionTitle>
        <InfoParagraph>
          A lunar year of 12 Masas adds up to ~354 days, about 11 days shorter
          than the solar year.
        </InfoParagraph>
        <InfoParagraph>
          To align the lunar calendar with the solar calendar, an extra month
          called Adhika Masa (leap month) is added roughly every 2–3 years.
        </InfoParagraph>
      </InfoSection>

      <InfoSection>
        <InfoSectionTitle>Masa Names in Order</InfoSectionTitle>
        <InfoVisual>
          <View style={tableStyles.container}>
            {masaData.map((item, index) => (
              <View
                key={index}
                style={
                  index === masaData.length - 1
                    ? tableStyles.lastRow
                    : tableStyles.row
                }
              >
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        </InfoVisual>
      </InfoSection>
    </InfoPage>
  );
}
