import Svg, { ClipPath, Defs, Path, Image } from "react-native-svg";
import Animated, { interpolate, useAnimatedProps, SharedValue } from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

function getMoonPhaseSvgProps(phase: number) {
    "worklet";
    const arcDirection = phase >= 1 ? 0 : 1;
    const normalizedPhase = phase >= 1 ? 2 - phase : phase;
    const returnArcDirection = normalizedPhase > 0.5 ? arcDirection : (arcDirection + 1) % 2;

    const arcRadiusX = interpolate(Math.abs(normalizedPhase - 0.5), [0, 0.5], [0, 1]);

    return {
        "d": `M 24 12 a 1 1 0 0 ${arcDirection} 0 24 a ${arcRadiusX} 1 0 0 ${returnArcDirection} 0 -24`
    }
}

type AnimatedMoonInPhaseProps = {
    phase: SharedValue<number>;
    width: number;
    height: number;
}

// todo: consider a brighter, less detailed moon that is fully fits the dimesions of the image
export function AnimatedMoonInPhase({ phase, width, height }: AnimatedMoonInPhaseProps) {
    const svgProps = useAnimatedProps(() => getMoonPhaseSvgProps(phase.value));

    return (
        <Svg width={width} height={height} viewBox="0 0 48 48">
            <Defs>
                <ClipPath id="moon-clip">
                    <AnimatedPath animatedProps={svgProps} />
                </ClipPath>
            </Defs>
            <Image width={"100%"} height={"100%"} href={require("../../../../../assets/tithi/full-moon-bg-removed.png")} preserveAspectRatio="xMidYMid slice" clipPath="url(#moon-clip)" />
        </Svg>
    );
}

type MoonInPhaseProps = {
    phase: number;
    width: number;
    height: number;
}

export function MoonInPhase({ phase, width, height }: MoonInPhaseProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 48 48">
            <Defs>
                <ClipPath id="moon-clip">
                    <Path {...getMoonPhaseSvgProps(phase)} />
                </ClipPath>
            </Defs>
            <Image width={"100%"} height={"100%"} href={require("../../../../../assets/tithi/full-moon-bg-removed.png")} preserveAspectRatio="xMidYMid slice" clipPath="url(#moon-clip)" />
        </Svg>
    );
}
