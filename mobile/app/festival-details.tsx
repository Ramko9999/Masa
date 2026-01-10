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
import {
  FestivalInfo,
  FestivalName,
  RuleType,
  Festival,
} from "@/api/panchanga/core/festival";
import { ParallaxScrollView } from "@/components/parallax-scroll-view";
import { FESTIVAL_IMAGES } from "@/components/festival-images";
import { TITHI_NAMES } from "@/api/panchanga/core/tithi";
import { MASA_NAMES } from "@/api/panchanga/core/masa";
import { StyleUtils } from "@/theme/style-utils";
import { SystemBars } from "react-native-edge-to-edge";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/util/date";
import { useRouter, useLocalSearchParams } from "expo-router";

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

export default function FestivalDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ festival: string }>();
  const festival: Festival = JSON.parse(params.festival);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const spacing = width * 0.03;
  const festivalDetailsStyles = useThemedStyles(festivalDetailsStylesFactory);
  const { i18n } = useTranslation();
  const formattedDate = formatDate(i18n.language, new Date(festival.date));
  const { t } = useTranslation();

  const festivalInfo = t(`festivals.${festival.name}`, {
    returnObjects: true,
  }) as FestivalInfo;

  return (
    <>
      <View style={festivalDetailsStyles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
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
                  {festivalInfo.title}
                </Text>
                {festivalInfo.subtitle && (
                  <Text style={{ fontStyle: "italic" }} neutral>
                    {festivalInfo.subtitle}
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
                        {t("tithi_info.title")}
                      </Text>
                      <Text neutral>
                        {t(`tithi.${TITHI_NAMES[festival.rule.tithiIndex]}`)}
                      </Text>
                    </View>
                    <View>
                      <Text semibold neutral tint>
                        {t("masa_info.purnimanta_masa")}
                      </Text>
                      <Text neutral>
                        {t(`masa.${MASA_NAMES[festival.rule.masaIndex]}`)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
          <View>
            <Text large semibold>
              {t("festival_details.about")}
            </Text>
            <View style={festivalDetailsStyles.description}>
              {parseLine(festivalInfo.description, "description")}
            </View>
          </View>
          <View>
            <Text large semibold>
              {t("festival_details.how_to_celebrate")}
            </Text>
            <View style={festivalDetailsStyles.celebration}>
              {parseContent(festivalInfo.celebration)}
            </View>
          </View>
        </ParallaxScrollView>
      </View>
      <SystemBars style="light" />
    </>
  );
}

