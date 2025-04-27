import { AnimatedSentence } from "@/components/util/animated-sentence";
import {
  introSlideStylesFactory,
  IntroSlideProps,
  WORD_DURATION,
  STAGGER,
  DELAY_PADDING,
} from "../common";
import { View, Text } from "@/theme";
import { TouchableOpacity } from "react-native";
import { DelayedFadeIn } from "@/components/util/delayed-fade-in";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/theme/color";

const INTRO_QUESTION_TITLE = "Have you ever wondered";
const INTRO_QUESTION = "Why does Diwali start on a different day every year?";

export function IntroQuestionSlide({ onNext }: IntroSlideProps) {
  const [skipAnimationIndex, setSkipAnimationIndex] = useState(-1);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const introSlideStyles = useThemedStyles(introSlideStylesFactory);

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
        content={INTRO_QUESTION_TITLE}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={INTRO_QUESTION}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.subtext}
        initialDelay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 1}
        startAnimation={currentAnimationIndex === 1}
        onAnimationFinished={() => triggerNextAnimation(2)}
      />

      <DelayedFadeIn
        delay={DELAY_PADDING}
        forceFinishAnimation={skipAnimationIndex >= 2}
        startAnimation={currentAnimationIndex === 2}
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
            I wondered that too...
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
