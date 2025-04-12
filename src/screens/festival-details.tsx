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
import { FestivalName, RuleType } from "@/api/panchanga/core/festival";
import {
  InfoParagraph,
  InfoSection,
  InfoSectionTitle,
  InfoSpacer,
} from "@/components/util/info-page";
import { ParallaxScrollView } from "@/components/parallax-scroll-view";
import { FESTIVAL_IMAGES } from "@/components/festival-images";
import { TITHI_NAMES } from "@/api/panchanga/core/tithi";
import { MASA_NAMES } from "@/api/panchanga/core/masa";

const festivalDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background),
  },
  backButton: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: "3%",
    aspectRatio: 1,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  festivalInfo: {
    flexDirection: "column",
  },
  metaInfo: {
    flexDirection: "row",
    gap: "7%",
  },
});

type FestivalDetailsProps = StackScreenProps<
  RootStackParamList,
  "festival_details"
>;

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
    <View style={festivalDetailsStyles.container}>
      <View
        style={[
          festivalDetailsStyles.backButton,
          { top: insets.top + spacing, left: spacing },
        ]}
      >
        <Pressable onPress={navigation.goBack}>
          <ChevronLeft size={24} color="white" strokeWidth={3} />
        </Pressable>
      </View>

      <ParallaxScrollView
        headerImage={
          <Image
            style={festivalDetailsStyles.headerImage}
            source={FESTIVAL_IMAGES[festival.name as FestivalName]}
          />
        }
      >
        <InfoSpacer />
        <InfoSpacer />
        <InfoSection>
          <View style={festivalDetailsStyles.festivalInfo}>
            <View>
              <Text huge bold>
                {festival.name}
              </Text>
              <Text bold tint neutral>
                {formattedDate}
              </Text>
            </View>
            {festival.rule.type == RuleType.Lunar && (
              <>
                <InfoSpacer />
                <View style={festivalDetailsStyles.metaInfo}>
                  <View>
                    <Text semibold tint>
                      Tithi
                    </Text>
                    <Text>{TITHI_NAMES[festival.rule.tithiIndex]}</Text>
                  </View>
                  <View>
                    <Text semibold tint>
                      Purnimanta Masa
                    </Text>
                    <Text>{MASA_NAMES[festival.rule.masaIndex]}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </InfoSection>
        <InfoSection>
          <InfoSectionTitle>About this festival</InfoSectionTitle>
          <InfoParagraph>{festival.description}</InfoParagraph>
        </InfoSection>

        <InfoSection>
          <InfoSectionTitle>How to celebrate?</InfoSectionTitle>
          <InfoParagraph>{festival.celebration}</InfoParagraph>
        </InfoSection>
      </ParallaxScrollView>
    </View>
  );
}
