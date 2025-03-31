import { AnimatedSentence } from "@/components/util/animated-sentence";
import { introSlideStyles, IntroSlideProps, WORD_DURATION, STAGGER, DELAY_PADDING } from "../common";
import { View, Text } from "@/theme";
import { TouchableOpacity } from "react-native";
import { DelayedFadeIn } from "@/components/util/delayed-fade-in";
import { useState } from "react";

const INTRO_QUESTION_TITLE = "Have you ever wondered";
const INTRO_QUESTION = "Why does Diwali start on a different day every year?";


export function IntroQuestionSlide({ onNext }: IntroSlideProps) {
    const [skipAnimationIndex, setSkipAnimationIndex] = useState(-1);
    const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

    const handleTap = () => {
        setSkipAnimationIndex(prev => Math.max(prev + 1, currentAnimationIndex));
    };

    const triggerNextAnimation = (currentAnimation: number) => {
        setCurrentAnimationIndex(prev => Math.max(prev, currentAnimation));
    };

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
                style={introSlideStyles.actionButtonContainer}
            >
                <TouchableOpacity onPress={onNext} style={introSlideStyles.actionButton}>
                    <Text style={introSlideStyles.actionText}>I wondered that too...</Text>
                </TouchableOpacity>
            </DelayedFadeIn>
        </View>
    );
}