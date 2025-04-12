import React from "react";
import { useWindowDimensions, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { ChevronLeft } from "lucide-react-native";
import { RootStackParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { FestivalName } from "@/api/panchanga/core/festival";
import { InfoParagraph, InfoSpacer } from "@/components/util/info-page";
import { InfoSectionTitle } from "@/components/util/info-page";
import { InfoSection } from "@/components/util/info-page";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Direct mapping from FestivalName to image require statements
const FESTIVAL_IMAGES: Record<FestivalName, any> = {
  [FestivalName.MakarSankranti]: require("../../assets/festivals/v1_makar-sankranti.png"),
  [FestivalName.VasantPanchami]: require("../../assets/festivals/v1_vasant_panchami.webp"),
  [FestivalName.MahaShivaratri]: require("../../assets/festivals/maha-shivaratri.webp"),
  [FestivalName.Holi]: require("../../assets/festivals/holi.png"),
  [FestivalName.Ugadi]: require("../../assets/festivals/ugadi.webp"),
  [FestivalName.RamaNavami]: require("../../assets/festivals/rama-navami.webp"),
  [FestivalName.HanumanJayanti]: require("../../assets/festivals/hanuman-jayanti.png"),
  [FestivalName.AkshayaTritiya]: require("../../assets/festivals/akshaya-tritya.webp"),
  [FestivalName.VatSavitri]: require("../../assets/festivals/vat-savitri.png"),
  [FestivalName.GuruPurnima]: require("../../assets/festivals/guru-purnima.png"),
  [FestivalName.RathYatra]: require("../../assets/festivals/rath-yatra.webp"),
  [FestivalName.NagaPanchami]: require("../../assets/festivals/nag-panchami.webp"),
  [FestivalName.RakshaBandhan]: require("../../assets/festivals/raksha-bandhan.webp"),
  [FestivalName.KrishnaJanmashtami]: require("../../assets/festivals/krishna-janmashtami.webp"),
  [FestivalName.GaneshChaturthi]: require("../../assets/festivals/ganesha-chaturthi.webp"),
  [FestivalName.Navaratri]: require("../../assets/festivals/akshaya-tritiya.png"),
  [FestivalName.DurgaPuja]: require("../../assets/festivals/durga-puja.png"),
  [FestivalName.Dussehra]: require("../../assets/festivals/dussehra.webp"),
  [FestivalName.KojagaraPuja]: require("../../assets/festivals/akshaya-tritiya.png"),
  [FestivalName.KarvaChauth]: require("../../assets/festivals/karva-chauth.png"),
  [FestivalName.GovardhanaPuja]: require("../../assets/festivals/akshaya-tritiya.png"),
  [FestivalName.Diwali]: require("../../assets/festivals/diwali.png"),
  [FestivalName.ChhathPuja]: require("../../assets/festivals/akshaya-tritiya.png"),
};

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
    padding: 12,
    aspectRatio: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContent: {
    paddingHorizontal: "3%",
  },
  backButtonIcon: {
    color: "white",
  },
});

type FestivalDetailsProps = StackScreenProps<
  RootStackParamList,
  "festival_details"
>;

export function FestivalDetails({ navigation, route }: FestivalDetailsProps) {
  const { festival } = route.params;
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const spacing = width * 0.03;
  const imageHeight = height * 0.6;
  const minHeaderHeight = imageHeight * 0.5;

  // Animation values
  const scrollY = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, imageHeight - minHeaderHeight],
      [imageHeight, minHeaderHeight],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    ),
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={festivalDetailsStyles.container}>
      <SystemBars style="light" />

      <View
        style={[
          festivalDetailsStyles.backButton,
          {
            top: insets.top + spacing,
            left: spacing,
          },
        ]}
      >
        <Pressable onPress={navigation.goBack}>
          <ChevronLeft size={24} color="white" strokeWidth={3} />
        </Pressable>
      </View>

      <Animated.View
        style={[festivalDetailsStyles.header, headerAnimatedStyle]}
      >
        <Image
          style={festivalDetailsStyles.headerImage}
          source={FESTIVAL_IMAGES[festival.name as FestivalName]}
        />
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={8}
        onScroll={scrollHandler}
        contentContainerStyle={[
          festivalDetailsStyles.scrollContent,
          {
            paddingTop: imageHeight,
            paddingBottom: insets.bottom + spacing * 3,
          },
        ]}
        scrollIndicatorInsets={{ top: minHeaderHeight }}
        bounces={false}
      >
        <InfoSpacer />
        <InfoSpacer />
        <InfoSection>
          <View style={{ flexDirection: "column", gap: 15 }}>
            <View>
              <Text huge bold>
                {festival.name}
              </Text>
              <Text bold tint neutral>
                {new Date(festival.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 25 }}>
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
      </Animated.ScrollView>
    </View>
  );
}
