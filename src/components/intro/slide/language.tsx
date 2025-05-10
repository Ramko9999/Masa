import React, { useState, useEffect } from "react";
import { View, Text } from "@/theme";
import { TouchableOpacity, ColorSchemeName, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "@/components/settings/language";
import { UserApi } from "@/api/user";
import i18n from "i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles, useGetColor, AppColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { shadeColor, tintColor } from "@/util/color";
import {
  introSlideStylesFactory,
  IntroSlideProps,
} from "../common";

import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";

// Styles
const languageAnimationStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRowCenterAll(),
    height: "25%",
    paddingHorizontal: "10%",
    marginBottom: "10%",
  },
  text: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    color: useGetColor(AppColor.primary, theme),
  },
});

const languageSelectionStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRowCenterAll(10),
    backgroundColor: (theme === "dark" ? shadeColor : tintColor)(
      useGetColor(AppColor.primary, theme),
      0.95
    ),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
  },
  selectedContainer: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  textContainer: {
    flex: 1,
  },
});

// Props Types
type LanguageSelectionProps = {
  language: string;
  isSelected: boolean;
  onSelect: () => void;
  isLoading?: boolean;
};

// Constants
const LANGUAGE_ANIMATION_OPTIONS = [
  "Choose your preferred language",
  "మీ ఇష్టమైన భాషను ఎంచుకోండి",
];

// Components
function LanguageAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useSharedValue(1);
  const languageAnimationStyles = useThemedStyles(languageAnimationStylesFactory);

  useEffect(() => {
    const animate = () => {
      opacity.value = withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LANGUAGE_ANIMATION_OPTIONS.length);
        opacity.value = withTiming(1, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }, 1000);

      setTimeout(animate, 3000);
    };

    animate();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={languageAnimationStyles.container}>
      <Animated.Text style={[languageAnimationStyles.text, animatedStyle]}>
        {LANGUAGE_ANIMATION_OPTIONS[currentIndex]}
      </Animated.Text>
    </View>
  );
}

export function LanguageSelection({
  language,
  isSelected,
  onSelect,
  isLoading = false,
}: LanguageSelectionProps) {
  const languageSelectionStyles = useThemedStyles(languageSelectionStylesFactory);

  return (
    <View>
      <TouchableOpacity
        style={[
          languageSelectionStyles.container,
          isSelected && languageSelectionStyles.selectedContainer,
        ]}
        onPress={onSelect}
        disabled={isLoading}
      >
        <View style={languageSelectionStyles.textContainer}>
          <Text large semibold primary={!isSelected} background={isSelected}>
            {LANGUAGE_OPTIONS[language as keyof typeof LANGUAGE_OPTIONS]}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function IntroLanguageSlide({ onNext }: IntroSlideProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skipAnimationIndex, setSkipAnimationIndex] = useState(-1);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const introSlideStyles = useThemedStyles(introSlideStylesFactory);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleTap = () => {
    setSkipAnimationIndex((prev) => Math.max(prev + 1, currentAnimationIndex));
  };

  const handleLanguageSelection = async (language: string) => {
    setSelectedLanguage(language);
    setIsLoading(true);
    await UserApi.setLanguage(language);
    i18n.changeLanguage(language);
    setIsLoading(false);
  };

  const handleNext = async () => {
    if (!selectedLanguage) return;
    onNext();
  };

  return (
    <View style={introSlideStyles.container} onTouchEnd={handleTap}>
      <LanguageAnimation />

      <View>
        {Object.keys(LANGUAGE_OPTIONS).map((language) => (
          <View key={language} style={{ marginBottom: "3%" }}>
            <LanguageSelection
              language={language}
              isSelected={selectedLanguage === language}
              onSelect={() => handleLanguageSelection(language)}
              isLoading={isLoading}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          ...introSlideStyles.actionButtonContainer,
          marginBottom: insets.bottom,
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          style={introSlideStyles.actionButton}
        >
          <Text large semibold background>
            {t("intro.language_selection.button")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
