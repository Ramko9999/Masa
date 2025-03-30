import { SvgXml, Svg, Use, Defs, G, Path, Circle } from "react-native-svg";
import React, { useEffect } from 'react';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { StyleSheet } from "react-native";
import { View } from "@/theme";

const LOGO_SVG_XML = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <defs>
          <g id="segment-h">
            <path d="M0 0 q 40 15 80 0" />
          </g>
          <g id="segment-v">
            <path d="M0 0 q 15 40 0 80" />
          </g>
          <g id="loop">
            <path d="M 0 0 c -18 -7 3 -28 10 -10" />
          </g>
        </defs>
        <use href="#segment-h" x="10" y="20" />
        <use href="#segment-v" x="20" y="10" />
        <use href="#segment-h" x="90" y="80" transform="rotate(180, 90, 80)" />
        <use href="#segment-v" x="80" y="90" transform="rotate(180, 80, 90)" />
        <use href="#loop" x="10" y="20" />
        <use href="#loop" x="80" y="10" transform="rotate(90, 80, 10)" />
        <use href="#loop" x="20" y="90" transform="rotate(270, 20, 90)" />
        <use href="#loop" x="90" y="80" transform="rotate(180, 90, 80)" />
        <path d="M 35 35 l 30 30" />
        <path d="M 65 35 l -30 30" />
        <circle cx="50" cy="36" stroke-width="2" r="2" fill="black" />
        <circle cx="50" cy="64" stroke-width="2" r="2" fill="black" />
        <circle cx="36" cy="50" stroke-width="2" r="2" fill="black" />
        <circle cx="64" cy="50" stroke-width="2" r="2" fill="black" />
    </svg>
`;

type LogoProps = {
    width: number;
    height: number;
    color: string;
}

export function Logo({ width, height, color }: LogoProps) {
    return <SvgXml xml={LOGO_SVG_XML} stroke={color} height={height} width={width} />
}


const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedUse = Animated.createAnimatedComponent(Use);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type SplashLogoProps = {
    shouldAnimate: boolean;
    onAnimationComplete: () => void;
}

export function SplashLogo({ shouldAnimate, onAnimationComplete }: SplashLogoProps) {

    const strokeDashoffset = useSharedValue(100);
    const circleOpacity = useSharedValue(0);

    useEffect(() => {
        if (shouldAnimate) {
            strokeDashoffset.value = withTiming(0, {
                duration: 3000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (done) => {
                if (done) {
                    runOnJS(onAnimationComplete)()
                }
            });

            circleOpacity.value = withDelay(1500, withTiming(1, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }));
        }
    }, [shouldAnimate]);

    const animatedCircleProps = useAnimatedProps(() => ({ opacity: circleOpacity.value }));

    const commonPathProps = { strokeDasharray: 100 };

    const animatedPathProps = useAnimatedProps(() => ({
        strokeDashoffset: strokeDashoffset.value,
    }));


    return (
        <Svg width="200"
            height="200"
            viewBox="0 0 100 100"
            fill="none"
            stroke="black"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round">

            <Defs>
                <G id="segment-h">
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        {...commonPathProps}
                        d="M0 0 q 40 15 80 0" />
                </G>
                <G id="segment-v">
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        {...commonPathProps}
                        d="M0 0 q 15 40 0 80" />
                </G>
                <G id="loop">
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        {...commonPathProps}
                        d="M 0 0 c -18 -7 3 -28 10 -10" />
                </G>
            </Defs>

            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#segment-h"
                x="10"
                y="20" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#segment-v"
                x="20"
                y="10" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#segment-h"
                x="90"
                y="80"
                transform="rotate(180, 90, 80)" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#segment-v"
                x="80"
                y="90"
                transform="rotate(180, 80, 90)" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#loop"
                x="10"
                y="20" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#loop"
                x="80"
                y="10"
                transform="rotate(90, 80, 10)" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#loop"
                x="20"
                y="90"
                transform="rotate(270, 20, 90)" />
            <AnimatedUse
                animatedProps={animatedPathProps}
                href="#loop"
                x="90"
                y="80"
                transform="rotate(180, 90, 80)" />

            <AnimatedPath
                animatedProps={animatedPathProps}
                {...commonPathProps}
                d="M 35 35 l 30 30" />
            <AnimatedPath
                animatedProps={animatedPathProps}
                {...commonPathProps}
                d="M 65 35 l -30 30" />

            <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx="50"
                cy="38"
                r="2"
                strokeWidth="2"
                fill="black" />
            <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx="50"
                cy="62"
                r="2"
                strokeWidth="2"
                fill="black" />
            <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx="38"
                cy="50"
                r="2"
                strokeWidth="2"
                fill="black" />
            <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx="62"
                cy="50"
                r="2"
                strokeWidth="2"
                fill="black" />
        </Svg>
    );
}

const sheetDraggerStyles = StyleSheet.create({
    container: {
        width: 90,
        height: 4,
        backgroundColor: "white",
        borderRadius: 10,
        position: "absolute",
        top: 5,
        left: "50%",
        transform: [{ translateX: -45 }],
    },
});

type SheetDraggerProps = {
    color?: string;
}

export function SheetDragger({ color }: SheetDraggerProps) {
    return <View style={[sheetDraggerStyles.container, { backgroundColor: color }]} />;
}