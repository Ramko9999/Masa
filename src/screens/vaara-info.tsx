import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";

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
            Each day is linked to a graha (planet), and each graha has special
            qualities. These qualities influence our mood, energy, and
            activities for the day.
          </Text>
          <View style={vaaraInfoStyles.tableContainer}>
            <View style={vaaraInfoStyles.tableRow}>
              <Text
                semibold
                style={[vaaraInfoStyles.tableHeader, { flex: 0.6 }]}
              >
                Graha
              </Text>
              <Text
                semibold
                style={[vaaraInfoStyles.tableHeader, { flex: 1.2 }]}
              >
                Vaara
              </Text>
              <Text
                semibold
                style={[vaaraInfoStyles.tableHeader, { flex: 1.2 }]}
              >
                Represents
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Sun
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Ravivaara (Sunday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Vitality, Authority, Energy
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Moon
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Somavaara (Monday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Emotions, Calmness
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Mars
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Mangalavaara (Tuesday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Courage, Strength
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Mercury
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Budhavaara (Wednesday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Intellect, Communication, Learning
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Jupiter
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Guruvaara (Thursday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Wisdom, Expansion, Luck
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Venus
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Shukravaara (Friday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Love, Beauty
              </Text>
            </View>
            <View style={vaaraInfoStyles.tableRow}>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 0.6 }]}>
                Saturn
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Shanivaara (Saturday)
              </Text>
              <Text style={[vaaraInfoStyles.tableCell, { flex: 1.2 }]}>
                Discipline, Patience, Challenges
              </Text>
            </View>
          </View>
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
    paddingVertical: 10,
    paddingHorizontal: 2,
    textAlign: "left",
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    textAlign: "left",
  },
});
