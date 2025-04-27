import { ColorSchemeName, StyleSheet } from "react-native";
import { View } from "@/theme";
import { StyleUtils } from "@/theme/style-utils";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  withDelay,
  useSharedValue,
  SharedValue,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import { useThemedStyles } from "@/theme/color";
const animatedSentenceStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRow(),
    flexWrap: "wrap",
  },
  word: {
    marginRight: 4,
  },
});

type AnimatedSentenceWordProps = {
  word: string;
  index: number;
  progress: SharedValue<number>;
  stagger: number;
  wordDuration: number;
  totalDuration: number;
  textStyle?: any;
};

function AnimatedSentenceWord({
  word,
  index,
  progress,
  stagger,
  wordDuration,
  totalDuration,
  textStyle,
}: AnimatedSentenceWordProps) {
  const animatedSentenceStyles = useThemedStyles(animatedSentenceStylesFactory);
  const wordProgress = useDerivedValue(() => {
    const shouldStartAt = index * stagger;
    const elapsedAnimationDuration = totalDuration * progress.value;

    if (elapsedAnimationDuration < shouldStartAt) {
      return 0;
    }

    const wordAnimationProgress =
      (elapsedAnimationDuration - shouldStartAt) / wordDuration;

    return Math.min(wordAnimationProgress, 1);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: wordProgress.value,
      transform: [
        {
          translateY: (1 - wordProgress.value) * 5,
        },
      ],
    };
  });

  return (
    <Animated.Text
      style={[animatedSentenceStyles.word, textStyle, animatedStyle]}
    >
      {word}
    </Animated.Text>
  );
}

type AnimatedSentenceProps = {
  content: string;
  wordDuration?: number;
  stagger?: number;
  style?: any;
  textStyle?: any;
  initialDelay?: number;
  forceFinishAnimation?: boolean;
  startAnimation?: boolean;
  onAnimationFinished?: () => void;
};

export function getTotalAnimationDuration(
  text: string,
  wordDuration: number,
  stagger: number
) {
  const words = text.trim().split(" ");
  return wordDuration + stagger * (words.length - 1);
}

export function AnimatedSentence({
  content,
  wordDuration = 500,
  stagger = 100,
  style,
  textStyle,
  initialDelay = 0,
  forceFinishAnimation = false,
  startAnimation = false,
  onAnimationFinished,
}: AnimatedSentenceProps) {
  const words = useMemo(() => content.trim().split(" "), [content]);
  const progress = useSharedValue(0);
  const totalDuration = getTotalAnimationDuration(
    content,
    wordDuration,
    stagger
  );

  const handleAnimationFinished = () => {
    onAnimationFinished?.();
  };

  useEffect(() => {
    if (startAnimation) {
      progress.value = withDelay(
        initialDelay,
        withTiming(
          1,
          { duration: totalDuration, easing: Easing.linear },
          (done) => {
            if (done) {
              runOnJS(handleAnimationFinished)();
            }
          }
        )
      );
    }
  }, [startAnimation]);

  useEffect(() => {
    if (forceFinishAnimation) {
      progress.value = 1;
      runOnJS(handleAnimationFinished)();
    }
  }, [forceFinishAnimation]);

  const animatedSentenceStyles = useThemedStyles(animatedSentenceStylesFactory);

  return (
    <View style={[animatedSentenceStyles.container, style]}>
      {words.map((word, index) => (
        <AnimatedSentenceWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          progress={progress}
          stagger={stagger}
          wordDuration={wordDuration}
          totalDuration={totalDuration}
          textStyle={textStyle}
        />
      ))}
    </View>
  );
}
