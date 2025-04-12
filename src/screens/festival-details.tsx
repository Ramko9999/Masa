import React from "react";
import {
  useWindowDimensions,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { ChevronLeft } from "lucide-react-native";
import { RootStackParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { SystemBars } from "react-native-edge-to-edge";
import { FestivalName } from "@/api/panchanga/core/festival";
import {
  InfoParagraph,
  InfoSection,
  InfoSectionTitle,
  InfoSpacer,
} from "@/components/util/info-page";
import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { FESTIVAL_IMAGES } from "@/constants/festival-images";

type FestivalDetailsProps = StackScreenProps<
  RootStackParamList,
  "festival_details"
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background),
  },
  backButton: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: 12,
    aspectRatio: 1,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  festivalInfo: {
    flexDirection: "column",
    gap: 15,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 25,
  },
});

export function FestivalDetails({ navigation, route }: FestivalDetailsProps) {
  const { festival } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const spacing = width * 0.03;

  const formattedDate = new Date(festival.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <SystemBars style="light" />

      <View
        style={[
          styles.backButton,
          { top: insets.top + spacing, left: spacing },
        ]}
      >
        <Pressable onPress={navigation.goBack}>
          <ChevronLeft size={24} color="white" strokeWidth={3} />
        </Pressable>
      </View>

      <ParallaxScrollView
        headerBackgroundColor={useGetColor(AppColor.background)}
        headerImage={
          <Image
            style={styles.headerImage}
            source={FESTIVAL_IMAGES[festival.name as FestivalName]}
          />
        }
      >
        <InfoSpacer />
        <InfoSpacer />
        <InfoSection>
          <View style={styles.festivalInfo}>
            <View>
              <Text huge bold>
                {festival.name}
              </Text>
              <Text bold tint neutral>
                {formattedDate}
              </Text>
            </View>
            <View style={styles.metaInfo}>
              <View>
                <Text semibold tint>
                  Tithi
                </Text>
                <Text>Shukla Ashtami</Text>
              </View>
              <View>
                <Text semibold tint>
                  Masa
                </Text>
                <Text>Chaitra</Text>
              </View>
            </View>
          </View>
        </InfoSection>

        <InfoSection>
          <InfoSectionTitle>About this festival</InfoSectionTitle>
          <InfoParagraph>
            Makar Sankranti signifies the end of winter and the onset of longer,
            warmer days.
          </InfoParagraph>
          <InfoParagraph>
            It is usually occurs on January 14th (or January 15th in leap
            years). It is a highly auspicious day for new beginnings and
            spiritual practices.
          </InfoParagraph>
        </InfoSection>

        <InfoSection>
          <InfoSectionTitle>How to celebrate?</InfoSectionTitle>
          <InfoParagraph>
            People wake up early to take dips in rivers to cleanse their souls.
          </InfoParagraph>
          <InfoParagraph>
            Prayers are offered to the Sun, thanking it for its light and
            energy.
          </InfoParagraph>
          <InfoParagraph>
            Families prepare sesame seed and jaggery sweets to share with loved
            ones to promote harmony and warmth.
          </InfoParagraph>
          <InfoParagraph>
            People fly colorful kites, gather around bonfires, and enjoy company
            to celebrate the arrival of brighter days.
          </InfoParagraph>
        </InfoSection>
        <InfoSection>
          <InfoSectionTitle>How to celebrate?</InfoSectionTitle>
          <InfoParagraph>
            People wake up early to take dips in rivers to cleanse their souls.
          </InfoParagraph>
          <InfoParagraph>
            Prayers are offered to the Sun, thanking it for its light and
            energy.
          </InfoParagraph>
          <InfoParagraph>
            Families prepare sesame seed and jaggery sweets to share with loved
            ones to promote harmony and warmth.
          </InfoParagraph>
          <InfoParagraph>
            People fly colorful kites, gather around bonfires, and enjoy company
            to celebrate the arrival of brighter days.
          </InfoParagraph>
        </InfoSection>
      </ParallaxScrollView>
    </View>
  );
}
