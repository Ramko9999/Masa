import { ViewStyle } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

type DelayedFadeInProps = {
    children: React.ReactNode;
    delay: number;
    forceFinishAnimation?: boolean;
    style?: ViewStyle;
    startAnimation?: boolean;
    onAnimationFinished?: () => void;
};

export function DelayedFadeIn({
    children,
    delay,
    forceFinishAnimation = false,
    style,
    startAnimation = false,
    onAnimationFinished,
}: DelayedFadeInProps) {
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handleAnimationFinished = () => {
        onAnimationFinished?.();
    }

    useEffect(() => {
        if (forceFinishAnimation) {
            opacity.value = 1;
            runOnJS(handleAnimationFinished)();
        }
    }, [forceFinishAnimation]);


    useEffect(() => {
        if (startAnimation) {
            opacity.value = withDelay(
                delay,
                withTiming(1, { }, (done) => {
                    if (done) {
                        runOnJS(handleAnimationFinished)();
                    }
                })
            );
        }
    }, [startAnimation]);


    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
} 