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
const HINDU_CALENDAR_TITLE = "Two Calendars, Two Systems";
const HINDU_CALENDAR_FIRST_POINT =
  "It's not changing! Diwali is based off the Hindu calendar which has a different astronomical basis than the Gregorian calendar.";
const HINDU_CALENDAR_SECOND_POINT =
  "The Gregorian calendar tracks Earth's journey around the Sun, while the Hindu calendar also considers the Moon's phases and positions.";
const HINDU_CALENDAR_THIRD_POINT =
  "Here are a couple other things to keep in mind:";

export function IntroHinduCalendarSlide({ onNext }: IntroSlideProps) {
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
        content={HINDU_CALENDAR_TITLE}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={HINDU_CALENDAR_FIRST_POINT}
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
        content={HINDU_CALENDAR_SECOND_POINT}
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
        content={HINDU_CALENDAR_THIRD_POINT}
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
        style={{...introSlideStyles.actionButtonContainer,  marginBottom: insets.bottom }}
      >
        <TouchableOpacity
          onPress={onNext}
          style={introSlideStyles.actionButton}
        >
          <Text large semibold background>
            Tell me more
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
