import React, { useState, useEffect } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    useDerivedValue,
    withTiming,
    Easing,
    cancelAnimation,
    withRepeat,
    interpolate,
} from "react-native-reanimated";
import { View, Text } from "@/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const orbitsStyles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: "4%",
        paddingVertical: "4%",
    },
    svgContainer: {
        width: "100%",
        alignItems: "center",
    },
});

type OrbitsProps = {
    isHeliocentric: boolean;
    size: number;
};

function Orbits({ isHeliocentric, size }: OrbitsProps) {
    const centerX = size / 2;
    const centerY = size / 2;
    const tintColor = useGetColor(AppColor.tint);

    // Animation timing config
    const transitionDuration = 1000; // 1 second for the transition

    // Orbital motion
    const time = useSharedValue(0);

    // Animation progress for model transition (0 = heliocentric, 1 = geocentric)
    const transitionProgress = useSharedValue(0);

    // Motion constants
    const orbitalSpeed = 0.1; // degrees per animation frame
    const moonRelativeSpeed = 1.2; // Moon orbits at a different pace

    // Calculate angles
    const baseAngleDeg = useDerivedValue(() => (time.value * orbitalSpeed) % 360);
    const moonAngleDeg = useDerivedValue(
        () => (time.value * (orbitalSpeed + moonRelativeSpeed)) % 360
    );

    const baseAngleRad = useDerivedValue(
        () => baseAngleDeg.value * (Math.PI / 180)
    );
    const moonAngleRad = useDerivedValue(
        () => moonAngleDeg.value * (Math.PI / 180)
    );

    // SUN POSITION
    // In heliocentric (0): sun is at center
    // In geocentric (1): sun orbits earth
    const sunOrbitRadius = useDerivedValue(
        () => size * 0.4 * transitionProgress.value // 0 when heliocentric, 0.4*size when geocentric
    );

    const sunX = useDerivedValue(
        () => centerX + Math.cos(baseAngleRad.value) * sunOrbitRadius.value
    );

    const sunY = useDerivedValue(
        () => centerY + Math.sin(baseAngleRad.value) * sunOrbitRadius.value
    );

    // EARTH POSITION
    // In heliocentric (0): earth orbits sun
    // In geocentric (1): earth is at center
    const earthOrbitRadius = useDerivedValue(
        () => size * 0.3 * (1 - transitionProgress.value) // 0.3*size when heliocentric, 0 when geocentric
    );

    const earthX = useDerivedValue(
        () => centerX + Math.cos(baseAngleRad.value) * earthOrbitRadius.value
    );

    const earthY = useDerivedValue(
        () => centerY + Math.sin(baseAngleRad.value) * earthOrbitRadius.value
    );

    // MOON POSITION - improved transition
    // We'll calculate both the heliocentric and geocentric moon positions separately
    // and then interpolate between them based on transition progress

    // Moon position in heliocentric model (orbits around Earth)
    const helioMoonX = useDerivedValue(
        () => earthX.value + Math.cos(moonAngleRad.value) * 20
    );

    const helioMoonY = useDerivedValue(
        () => earthY.value + Math.sin(moonAngleRad.value) * 20
    );

    // Moon position in geocentric model (orbits around center)
    const geoMoonX = useDerivedValue(
        () => centerX + Math.cos(moonAngleRad.value) * (size * 0.2)
    );

    const geoMoonY = useDerivedValue(
        () => centerY + Math.sin(moonAngleRad.value) * (size * 0.2)
    );

    // Interpolate between the two positions
    const moonX = useDerivedValue(() =>
        interpolate(
            transitionProgress.value,
            [0, 1],
            [helioMoonX.value, geoMoonX.value]
        )
    );

    const moonY = useDerivedValue(() =>
        interpolate(
            transitionProgress.value,
            [0, 1],
            [helioMoonY.value, geoMoonY.value]
        )
    );

    // Set up animated props
    const sunProps = useAnimatedProps(() => ({
        cx: sunX.value,
        cy: sunY.value,
    }));

    const earthProps = useAnimatedProps(() => ({
        cx: earthX.value,
        cy: earthY.value,
    }));

    const moonProps = useAnimatedProps(() => ({
        cx: moonX.value,
        cy: moonY.value,
    }));

    // Orbit opacity animations
    const heliocentricOrbitOpacity = useSharedValue(1); // Start with heliocentric
    const geocentricSunOrbitOpacity = useSharedValue(0);
    const geocentricMoonOrbitOpacity = useSharedValue(0);

    // Animated props for orbit lines
    const heliocentricOrbitProps = useAnimatedProps(() => ({
        opacity: heliocentricOrbitOpacity.value,
    }));

    const geocentricSunOrbitProps = useAnimatedProps(() => ({
        opacity: geocentricSunOrbitOpacity.value,
    }));

    const geocentricMoonOrbitProps = useAnimatedProps(() => ({
        opacity: geocentricMoonOrbitOpacity.value,
    }));

    // Continuous orbital animation
    useEffect(() => {
        time.value = withRepeat(
            withTiming(time.value + 3600, {
                duration: 36000, // 36 seconds for one cycle
                easing: Easing.linear,
            }),
            -1,
            false
        );

        return () => {
            cancelAnimation(time);
        };
    }, []);

    // Update transition animation to use the prop
    useEffect(() => {
        transitionProgress.value = withTiming(
            isHeliocentric ? 0 : 1,
            {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            }
        );

        // Update orbit opacities based on model
        if (!isHeliocentric) {
            heliocentricOrbitOpacity.value = withTiming(0, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
            geocentricSunOrbitOpacity.value = withTiming(1, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
            geocentricMoonOrbitOpacity.value = withTiming(1, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
        } else {
            heliocentricOrbitOpacity.value = withTiming(1, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
            geocentricSunOrbitOpacity.value = withTiming(0, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
            geocentricMoonOrbitOpacity.value = withTiming(0, {
                duration: transitionDuration,
                easing: Easing.inOut(Easing.cubic),
            });
        }

    }, [isHeliocentric]);

    return (
        <View style={orbitsStyles.container}>
            <View style={orbitsStyles.svgContainer}>
                <Svg height={size} width={size}>
                    {/* Heliocentric orbit (Earth around Sun) */}
                    <AnimatedCircle
                        cx={centerX}
                        cy={centerY}
                        r={size * 0.3}
                        stroke={tintColor}
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="transparent"
                        animatedProps={heliocentricOrbitProps}
                    />

                    {/* Geocentric orbits (Sun and Moon around Earth) */}
                    <AnimatedCircle
                        cx={centerX}
                        cy={centerY}
                        r={size * 0.4}
                        stroke={tintColor}
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="transparent"
                        animatedProps={geocentricSunOrbitProps}
                    />

                    <AnimatedCircle
                        cx={centerX}
                        cy={centerY}
                        r={size * 0.2}
                        stroke={tintColor}
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="transparent"
                        animatedProps={geocentricMoonOrbitProps}
                    />

                    {/* Animated celestial bodies */}
                    <AnimatedCircle animatedProps={sunProps} r={15} fill="orange" />
                    <AnimatedCircle
                        animatedProps={earthProps}
                        r={10}
                        fill="deepskyblue"
                    />
                    <AnimatedCircle animatedProps={moonProps} r={5} fill="#999" />
                </Svg>
            </View>
        </View>
    );
}

// Create a new container component
const introOrbitsDiagramStyles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: "4%",
        paddingVertical: "4%",
    },
    title: {
        marginBottom: "4%",
    },
    orbitsContainer: {
        width: "100%",
        aspectRatio: 1,
        borderColor: useGetColor(AppColor.primary),
        position: 'relative',
    },
    tabsContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        ...StyleUtils.flexRow(),
        backgroundColor: useGetColor(AppColor.background),
        borderWidth: 2,
        height: 40,
    },
    tab: {
        flex: 1,
        paddingHorizontal: "4%",
        ...StyleUtils.flexRowCenterAll(),
        borderColor: useGetColor(AppColor.primary),
    },
    tabActive: {
        backgroundColor: useGetColor(AppColor.primary),
    },
});

type IntroOrbitsDiagramProps = {
    size?: number; // Optional, will calculate from window width if not provided
};

export function IntroOrbitsDiagram({ size: providedSize }: IntroOrbitsDiagramProps) {
    const [isHeliocentric, setIsHeliocentric] = useState(false);
    const { width } = useWindowDimensions();

    // If size is not provided, calculate it from window width
    const size = providedSize ?? width * 0.9;

    return (
        <View style={introOrbitsDiagramStyles.container}>
            <View style={[introOrbitsDiagramStyles.orbitsContainer, { width: size }]}>
                <Orbits
                    isHeliocentric={isHeliocentric}
                    size={size}
                />
                <View style={[introOrbitsDiagramStyles.tabsContainer, { width: size * 0.5 }]}>
                    <TouchableOpacity
                        style={[
                            introOrbitsDiagramStyles.tab,
                            isHeliocentric && introOrbitsDiagramStyles.tabActive
                        ]}
                        onPress={() => setIsHeliocentric(true)}
                    >
                        <Text
                            sneutral
                            primary={!isHeliocentric}
                            background={isHeliocentric}
                        >
                            Heliocentric
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            introOrbitsDiagramStyles.tab,
                            !isHeliocentric && introOrbitsDiagramStyles.tabActive
                        ]}
                        onPress={() => setIsHeliocentric(false)}
                    >
                        <Text
                            sneutral
                            primary={isHeliocentric}
                            background={!isHeliocentric}
                        >
                            Geocentric
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
