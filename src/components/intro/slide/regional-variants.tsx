import { AnimatedSentence } from "@/components/util/animated-sentence";
import {
  introSlideStyles,
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
const REGIONAL_VARIANTS_TITLE = "Calendar with Regional Differences";
const REGIONAL_VARIANTS_FIRST_POINT =
  "Festival dates can vary based on region as different regions follow slightly different systems.";
const REGIONAL_VARIANTS_SECOND_POINT =
  "Local customs can also influence festival timings.";
const REGIONAL_VARIANTS_THIRD_POINT =
  "If you see something wrong or don't feel represented, please let us know!";

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

  return (
    <View style={introSlideStyles.container} onTouchEnd={handleTap}>
      <AnimatedSentence
        content={REGIONAL_VARIANTS_TITLE}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={REGIONAL_VARIANTS_FIRST_POINT}
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
        content={REGIONAL_VARIANTS_SECOND_POINT}
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
        content={REGIONAL_VARIANTS_THIRD_POINT}
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
            Sounds good!
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
