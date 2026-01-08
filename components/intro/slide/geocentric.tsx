import { AnimatedSentence } from "@/components/util/animated-sentence";
import {
  introSlideStylesFactory,
  IntroSlideProps,
  WORD_DURATION,
  STAGGER,
  DELAY_PADDING,
} from "../common";
import { View, Text, getFontSize } from "@/theme";
import { TouchableOpacity } from "react-native";
import { DelayedFadeIn } from "@/components/util/delayed-fade-in";
import { IntroOrbitsDiagram } from "@/components/intro/orbit";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/theme/color";
import { useTranslation } from "react-i18next";

export function IntroGeocentricSlide({ onNext }: IntroSlideProps) {
  const [skipAnimationIndex, setSkipAnimationIndex] = useState(-1);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const introSlideStyles = useThemedStyles(introSlideStylesFactory);

  const insets = useSafeAreaInsets();

  const handleTap = () => {
    setSkipAnimationIndex((prev) => Math.max(prev + 1, currentAnimationIndex));
  };

  const triggerNextAnimation = (currentAnimation: number) => {
    setCurrentAnimationIndex((prev) => Math.max(prev, currentAnimation));
  };

  const { t } = useTranslation();

  return (
    <View style={introSlideStyles.container} onTouchEnd={handleTap}>
      <AnimatedSentence
        content={t("intro.geocentric.title")}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={t("intro.geocentric.first_point")}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={[
          introSlideStyles.subtext,
          { fontSize: getFontSize({ big: true }) },
        ]}
        initialDelay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 1}
        startAnimation={currentAnimationIndex === 1}
        onAnimationFinished={() => triggerNextAnimation(2)}
      />

      <DelayedFadeIn
        delay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 2}
        startAnimation={currentAnimationIndex === 2}
        onAnimationFinished={() => triggerNextAnimation(3)}
      >
        <IntroOrbitsDiagram />
      </DelayedFadeIn>

      <DelayedFadeIn
        delay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 3}
        startAnimation={currentAnimationIndex === 3}
        style={{
          ...introSlideStyles.actionButtonContainer,
          marginBottom: insets.bottom,
        }}
      >
        <TouchableOpacity
          onPress={onNext}
          style={introSlideStyles.actionButton}
        >
          <Text large semibold background>
            {t("intro.geocentric.button")}
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
