import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/theme";
import { GeocentricTithi } from "@/components/tithi/geocentric-tithi";
import { MoonSlider } from "@/components/tithi/moon-phases";
import { ScrollView } from "react-native-gesture-handler";
import { InfoHeader } from "@/components/util/info-header";

export function TithiInfoPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InfoHeader />
        <View style={styles.headerContainer}>
          <Text huge bold>
            Tithi
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            A Tithi is the time the Moon takes to move 12 degrees relative to
            the Sun.
          </Text>
          <Text style={styles.paragraph}>
            Each lunar month (Masa) has 30 Tithis.
          </Text>
          <Text style={styles.paragraph}>
            Shukla Paksha (Waxing phase) refers to the period from New Moon to
            Full Moon (15 Tithis).
          </Text>
          <Text style={styles.paragraph}>
            Krishna Paksha (Waning phase) is the period from Full Moon to New
            Moon (15 Tithis).
          </Text>
          <Text style={styles.paragraph}>
            Tithi along with Masa are fundamental to determine festival dates.
          </Text>
          <View style={styles.spacer} />
          <View style={{ alignItems: "center" }}>
            <Text tiny tint style={{ fontStyle: "italic" }}>
              Look at how the Tithi changes based on the Sun-Moon angle
            </Text>
          </View>
          <GeocentricTithi />
        </View>

        <View style={styles.section}>
          <Text large bold style={styles.sectionTitle}>
            Naming of Tithis
          </Text>
          <Text style={styles.paragraph}>
            Amavasya is the moment of new moon.
          </Text>
          <Text style={styles.paragraph}>
            Purnima is the moment of full moon.
          </Text>
          <Text style={styles.paragraph}>
            All other Tithis are named using Sanskrit numbers: Pratipada (1st),
            Dwitiya (2nd), Tritiya (3rd), Chaturthi (4th), and so on.
          </Text>
          <View style={styles.spacer} />
          <Text style={styles.label}>🌓 Moon Phases</Text>
          <MoonSlider />
        </View>

        <View style={styles.section}>
          <Text large bold style={styles.sectionTitle}>
            Tithi Nuances
          </Text>
          <Text style={styles.paragraph}>
            Tithis can start and end at any time, lasting between 18 to 24 hours
            due to the elliptical nature of the moon's orbit.
          </Text>
          <Text style={styles.paragraph}>
            This makes it difficult to predict Tithi for a day without
            evaluating the moon's position at sunrise relative to the sun.
          </Text>
          <Text style={styles.paragraph}>
            Due to historical conventions, the Tithi at sunrise is considered
            the Tithi for the day.
          </Text>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: "3%",
    marginBottom: 20,
    marginTop: "4%",
  },
  section: {
    paddingHorizontal: "4%",
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  spacer: {
    height: 16,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
  },
  noteText: {
    marginTop: 4,
    fontStyle: "italic",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: "3%",
    height: 30,
  },
});
