import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { IntroOrbitsDiagram } from "@/components/intro/orbit";

export function VaaraInfoPage() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ paddingTop: insets.top + 20 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={vaaraInfoStyles.container}
      >
        <View style={vaaraInfoStyles.headerContainer}>
          <Text huge bold>
            Vaara
          </Text>
        </View>
        <View>
          <Text style={vaaraInfoStyles.paragraph}>
            Vaara means day of the week in the Hindu calendar.
          </Text>
          <Text style={vaaraInfoStyles.paragraph}>
            Each day is linked to a planet (Graha), and each planet has special
            qualities. These qualities influence our mood, energy, and
            activities for the day.
          </Text>
          <View style={vaaraInfoStyles.vaaraList}>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Sun - Ravivaara (Sunday) - Vitality, Authority, Energy`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Moon - Somavaara (Monday) - Emotions, Calmness`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Mars - Mangalavaara (Tuesday) - Courage, Strength`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Mercury - Budhavaara (Wednesday) - Communication, Learning`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Jupiter - Guruvaara (Thursday) - Wisdom, Expansion, Luck`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Venus - Shukravaara (Friday) - Love, Beauty`}</Text>
            <Text
              style={vaaraInfoStyles.vaaraItem}
            >{`\u2022 Saturn - Shanivaara (Saturday) - Discipline, Patience, Challenges`}</Text>
          </View>
          {/* <View style={vaaraInfoStyles.tableContainer}>
            <View style={vaaraInfoStyles.tableRow}>
              <Text semibold style={vaaraInfoStyles.tableHeader}>
                Planet
              </Text>
              <Text semibold style={vaaraInfoStyles.tableHeader}>
                Vaara (Day)
              </Text>
              <Text semibold style={vaaraInfoStyles.tableHeader}>
                Represents
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Sun</Text>
              <Text style={vaaraInfoStyles.tableCell}>Ravivaara (Sunday)</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Vitality, Authority, Energy
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Moon</Text>
              <Text style={vaaraInfoStyles.tableCell}>Somavaara (Monday)</Text>
              <Text style={vaaraInfoStyles.tableCell}>Emotions, Calmness</Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Mars</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Mangalavaara (Tuesday)
              </Text>
              <Text style={vaaraInfoStyles.tableCell}>Courage, Strength</Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Mercury</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Budhavaara (Wednesday)
              </Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Intellect, Communication, Learning
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Jupiter</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Guruvaara (Thursday)
              </Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Wisdom, Expansion, Luck
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Venus</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Shukravaara (Friday)
              </Text>
              <Text style={vaaraInfoStyles.tableCell}>Love, Beauty</Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={vaaraInfoStyles.tableCell}>Saturn</Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Shanivaara (Saturday)
              </Text>
              <Text style={vaaraInfoStyles.tableCell}>
                Discipline, Patience, Challenges
              </Text>
            </View>
          </View> */}
        </View>

        <View>
          <Text large semibold style={vaaraInfoStyles.sectionTitle}>
            How is Vaara decided?
          </Text>
          <Text style={vaaraInfoStyles.paragraph}>
            Each day is made up of 24 hours (called Horas).
          </Text>
          <Text style={vaaraInfoStyles.paragraph}>
            Every Hora is linked to a planet, and the planet that is linked to
            the first Hora after sunrise decides the Vaara.
          </Text>
        </View>
        <View style={vaaraInfoStyles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const vaaraInfoStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
  },
  headerContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    height: 30,
  },
  vaaraList: {
    flexDirection: "column",
    gap: 10,
  },
  vaaraItem: {
    lineHeight: 22,
  },
  tableContainer: {
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: useGetColor(AppColor.border),
    borderRadius: 6,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: useGetColor(AppColor.border),
  },
  tableHeader: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    textAlign: "left",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    textAlign: "left",
  },
});
