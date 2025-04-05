import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/theme";
import { NakshatraOrbit } from "@/components/nakshatra/orbit";

export function NakshatraInfoPage() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ paddingTop: insets.top + 20 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={nakshatraInfoStyles.container}
      >
        <View style={nakshatraInfoStyles.headerContainer}>
          <Text huge bold>
            Nakshatra
          </Text>
        </View>
        <View>
          <Text style={nakshatraInfoStyles.paragraph}>
            Nakshatra can refer to both a single star and a group of stars
            (asterism).
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            IIn the Hindu Calendar, a Nakshatra is a segment of the Moon's
            ecliptic orbit.
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            The Moon takes about 27 days to complete its orbit, so there are 27
            Nakshatras, with the Moon spending roughly one day in each.
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            Meshadi, the starting point of the Nakshatras, is determined as the
            point opposite Chitra Nakshatra.
          </Text>
        </View>
        <NakshatraOrbit />
        <View>
          <Text large semibold style={nakshatraInfoStyles.sectionTitle}>
            Naming & Relevance
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            Each Nakshatra is named after a prominent star, known as the
            Yogatara, that lies within the segment.
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            Nakshatras play a key role in the Hindu Calendar, rituals, and
            astrology. A person’s Janma Nakshatra (birth Nakshatra) is
            determined by the Moon’s position at birth, influencing rituals like
            naming, personality traits, and compatibility.
          </Text>
          <Text style={nakshatraInfoStyles.paragraph}>
            Nakshatras also serve as a convenient coordinate system to locate
            the positions of planets in the sky. For example, one might say
            "Saturn is in Dhanishtha Nakshatra."
          </Text>
        </View>
        <View style={nakshatraInfoStyles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const nakshatraInfoStyles = StyleSheet.create({
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
  nakshatraList: {
    flexDirection: "column",
    gap: 10,
  },
  nakshatraItem: {
    lineHeight: 22,
  },
});
