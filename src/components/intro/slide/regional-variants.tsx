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
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/theme/color";
import { useTranslation } from "react-i18next";

export function IntroRegionalVariantsSlide({ onNext }: IntroSlideProps) {
  const [skipAnimationIndex, setSkipAnimationIndex] = useState(-1);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  const handleTap = () => {
    setSkipAnimationIndex((prev) => Math.max(prev + 1, currentAnimationIndex));
  };

  const triggerNextAnimation = (currentAnimation: number) => {
    setCurrentAnimationIndex((prev) => Math.max(prev, currentAnimation));
  };

  const insets = useSafeAreaInsets();

  const introSlideStyles = useThemedStyles(introSlideStylesFactory);

  const { t } = useTranslation();

  return (
    <View style={introSlideStyles.container} onTouchEnd={handleTap}>
      <AnimatedSentence
        content={t("intro.regional_variants.title")}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={t("intro.regional_variants.first_point")}
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
      <AnimatedSentence
        content={t("intro.regional_variants.second_point")}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={[
          introSlideStyles.subtext,
          { fontSize: getFontSize({ big: true }) },
        ]}
        initialDelay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 2}
        startAnimation={currentAnimationIndex === 2}
        onAnimationFinished={() => triggerNextAnimation(3)}
      />
      <AnimatedSentence
        content={t("intro.regional_variants.third_point")}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={[
          introSlideStyles.subtext,
          { fontSize: getFontSize({ big: true }) },
        ]}
        initialDelay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 3}
        startAnimation={currentAnimationIndex === 3}
        onAnimationFinished={() => triggerNextAnimation(4)}
      />

      <DelayedFadeIn
        delay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 4}
        startAnimation={currentAnimationIndex === 4}
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
            {t("intro.regional_variants.button")}
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
