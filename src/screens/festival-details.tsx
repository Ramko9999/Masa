import React from "react";
import {
  useWindowDimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  ColorSchemeName,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { ChevronLeft } from "lucide-react-native";
import { RootStackParamList } from "@/layout/types";
import { StackScreenProps } from "@react-navigation/stack";
import { FestivalName, RuleType } from "@/api/panchanga/core/festival";
import { ParallaxScrollView } from "@/components/parallax-scroll-view";
import { FESTIVAL_IMAGES } from "@/components/festival-images";
import { TITHI_NAMES } from "@/api/panchanga/core/tithi";
import { MASA_NAMES } from "@/api/panchanga/core/masa";
import { StyleUtils } from "@/theme/style-utils";
import { SystemBars } from "react-native-edge-to-edge";

const festivalDetailsStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  festivalTitle: {
    ...StyleUtils.flexColumn(),
  },
  container: {
    flex: 1,
    backgroundColor: useGetColor(AppColor.background, theme),
  },
  backButton: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    padding: "3%",
    aspectRatio: 1,
  },
  festivalInfo: {
    ...StyleUtils.flexColumn(10),
  },
  metaInfo: {
    flexDirection: "row",
    gap: "7%",
  },
  celebration: {
    marginTop: "1%",
    ...StyleUtils.flexColumn(10),
  },
  description: {
    marginTop: "1%",
  },
  date: {
    marginTop: "1%",
  },
});

type FestivalDetailsProps = StackScreenProps<
  RootStackParamList,
  "festival_details"
>;

function parseContent(
  content: string,
  addPeriod: boolean = false
): React.ReactNode {
  const lines = content
    .split(".")
    .filter((line) => line.trim().length > 0)
    .map((line) => (addPeriod ? `${line.trim()}.` : line.trim()));

  return lines.map((line, index) => parseLine(line, index));
}

function parseLine(content: string, key: number | string): React.ReactNode {
  const parts = content.split(/(<i>.*?<\/i>)/g);

  return (
    <Text key={key} neutral>
      {parts.map((part, index) => {
        if (part.startsWith("<i>") && part.endsWith("</i>")) {
          const italicText = part.slice(3, -4);
          return (
            <Text key={index} neutral style={{ fontStyle: "italic" }}>
              {italicText}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

export function FestivalDetails({ navigation, route }: FestivalDetailsProps) {
  const { festival } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const spacing = width * 0.03;
  const festivalDetailsStyles = useThemedStyles(festivalDetailsStylesFactory);

  const formattedDate = new Date(festival.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <View style={festivalDetailsStyles.container}>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={[
            festivalDetailsStyles.backButton,
            { top: insets.top + spacing, left: spacing },
          ]}
        >
          <ChevronLeft size={24} color="white" strokeWidth={3} />
        </TouchableOpacity>

        <ParallaxScrollView
          headerImage={
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
              source={FESTIVAL_IMAGES[festival.name as FestivalName]}
            />
          }
        >
          <View>
            <View style={festivalDetailsStyles.festivalInfo}>
              <View style={festivalDetailsStyles.festivalTitle}>
                <Text huge bold>
                  {festival.name}
                </Text>
                {festival.subtitle && (
                  <Text style={{ fontStyle: "italic" }} neutral>
                    {festival.subtitle}
                  </Text>
                )}
                <View style={festivalDetailsStyles.date}>
                  <Text bold tint neutral>
                    {formattedDate}
                  </Text>
                </View>
              </View>
              {festival.rule.type == RuleType.Lunar && (
                <>
                  <View style={festivalDetailsStyles.metaInfo}>
                    <View>
                      <Text semibold neutral tint>
                        Tithi
                      </Text>
                      <Text neutral>
                        {TITHI_NAMES[festival.rule.tithiIndex]}
                      </Text>
                    </View>
                    <View>
                      <Text semibold neutral tint>
                        Purnimanta Masa
                      </Text>
                      <Text neutral>{MASA_NAMES[festival.rule.masaIndex]}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
          <View>
            <Text large semibold>
              About this festival
            </Text>
            <View style={festivalDetailsStyles.description}>
              {parseLine(festival.description, "description")}
            </View>
          </View>
          <View>
            <Text large semibold>
              How to celebrate?
            </Text>
            <View style={festivalDetailsStyles.celebration}>
              {parseContent(festival.celebration)}
            </View>
          </View>
        </ParallaxScrollView>
      </View>
      <SystemBars style="light" />
    </>
  );
}
