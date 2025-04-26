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
const GEOCENTRIC_TITLE = "The Hindu Calendar is Geocentric";
const GEOCENTRIC_FIRST_POINT =
  "The Hindu calendar's elements are based off the positions of the celestial bodies from the perspective of Earth.";

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

  return (
    <View style={introSlideStyles.container} onTouchEnd={handleTap}>
      <AnimatedSentence
        content={GEOCENTRIC_TITLE}
        wordDuration={WORD_DURATION}
        stagger={STAGGER}
        textStyle={introSlideStyles.title}
        forceFinishAnimation={skipAnimationIndex >= 0}
        startAnimation={currentAnimationIndex === 0}
        onAnimationFinished={() => triggerNextAnimation(1)}
        initialDelay={DELAY_PADDING}
      />
      <AnimatedSentence
        content={GEOCENTRIC_FIRST_POINT}
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
            Understood
          </Text>
        </TouchableOpacity>
      </DelayedFadeIn>
    </View>
  );
}
