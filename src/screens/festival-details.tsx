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

// Import the same festival images from upcoming.tsx
const festivalImages: Record<string, any> = {
  "makar-sankranti.png": require("../../assets/festivals/makar-sankranti.png"),
  "vasant-panchami.png": require("../../assets/festivals/vasant-panchami.png"),
  "maha-shivaratri.png": require("../../assets/festivals/maha-shivaratri.png"),
  "holi.png": require("../../assets/festivals/holi.png"),
  "ugadi.png": require("../../assets/festivals/ugadi.png"),
  "rama-navami.png": require("../../assets/festivals/rama-navami.png"),
  "hanuman-jayanti.png": require("../../assets/festivals/hanuman-jayanti.png"),
  "akshaya-tritiya.png": require("../../assets/festivals/akshaya-tritiya.png"),
  "guru-purnima.png": require("../../assets/festivals/guru-purnima.png"),
  "naga-panchami.png": require("../../assets/festivals/naga-panchami.png"),
  "raksha-bandhan.png": require("../../assets/festivals/raksha-bandhan.png"),
  "krishna-janmashtami.png": require("../../assets/festivals/krishna-janmashtami.png"),
  "ganesh-chaturthi.png": require("../../assets/festivals/ganesh-chaturthi.png"),
  "durga-puja.png": require("../../assets/festivals/durga-puja.png"),
  "dussehra.png": require("../../assets/festivals/dussehra.png"),
  "karva-chauth.png": require("../../assets/festivals/karva-chauth.png"),
  "diwali.png": require("../../assets/festivals/diwali.png"),
};

const festivalDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background),
  },
  back: {
    position: "absolute",
    zIndex: 10
  }
});

type FestivalDetailsProps = StackScreenProps<RootStackParamList, "festival_details">

export function FestivalDetails({ navigation, route }: FestivalDetailsProps) {
  const { festival } = route.params;
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const spacing = width * 0.02;
  const imageHeight = height * 0.6;

  // todo: only add the scroll view to the text and not the image
  return (
    <View
      style={festivalDetailsStyles.container}
    >
      <SystemBars style="light" />

      {/* Back button overlay - fixed position */}
      <View
        style={[festivalDetailsStyles.back, {
          top: insets.top + spacing,
          left: spacing * 3,
        }]}
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
          source={festivalImages[festival.image]}
        />
        <View style={{ padding: spacing * 3 }}>
          <View>
            <Text bold larger>{festival.name}</Text>
            <Text
              style={{
                marginBottom: spacing,
              }}
              bold tint sneutral
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
            <Text small>
              {festival.description}
            </Text>
            <Text medium>How to celebrate?</Text>
            <Text small>
              {festival.celebration}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
