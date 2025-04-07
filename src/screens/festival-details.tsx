import React from "react";
import {
  ScrollView,
  useWindowDimensions,
  Image,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { FestivalName } from "@/api/panchanga/core/festival";

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
  back: {
    position: "absolute",
    zIndex: 10,
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
  const spacing = width * 0.02;
  const imageHeight = height * 0.6;

  // todo: only add the scroll view to the text and not the image
  return (
    <View style={festivalDetailsStyles.container}>
      <SystemBars style="light" />

      {/* Back button overlay - fixed position */}
      <View
        style={[
          festivalDetailsStyles.back,
          {
            top: insets.top + spacing,
            left: spacing * 3,
          },
        ]}
      >
        <Pressable
          onPress={navigation.goBack}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 20,
            padding: spacing,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing * 3,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: imageHeight,
            resizeMode: "cover",
          }}
          source={FESTIVAL_IMAGES[festival.name as FestivalName]}
        />
        <View style={{ padding: spacing * 3 }}>
          <View>
            <Text bold larger>
              {festival.name}
            </Text>
            <Text
              style={{
                marginBottom: spacing,
              }}
              bold
              tint
              sneutral
            >
              {new Date(festival.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={{ gap: spacing }}>
            <Text medium>About this festival</Text>
            <Text small>{festival.description}</Text>
            <Text medium>How to celebrate?</Text>
            <Text small>{festival.celebration}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
