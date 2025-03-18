import { StyleSheet, Image, useWindowDimensions } from "react-native";
import { View, Text } from "../../../../theme";
import { StyleUtils } from "../../../../theme/style-utils";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle, withRepeat, useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { TITHI_NAMES } from "../../../../api/panchanga/core/tithi";
import { tintColor } from "../../../../util/color";

const moonStyles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleUtils.flexColumn(5),
        alignItems: "center",
    },
    moon: {
        overflow: "hidden",
    },
    shadow: {
        position: "absolute",
    },
    label: {
        fontSize: 20,
        color: tintColor("#151515", 0.6),
    }
})

type MoonProps = {
    shadowFillColor: string;
}

function Moon({ shadowFillColor }: MoonProps) {
    const shadowTranslationX = useSharedValue(-1);
    const [currentTithi, setCurrentTithi] = useState("Amavasya");
    const { width } = useWindowDimensions();
    const dimensions = { width: width * 0.25, height: width * 0.25 };

    useAnimatedReaction(() => (shadowTranslationX.value + 1) * 360, (angle) => {
        const index = (Math.floor(angle / 12) - 1) % 30;
        runOnJS(setCurrentTithi)(TITHI_NAMES[index])
    })

    useEffect(() => {
        shadowTranslationX.value = withRepeat(withTiming(1, { duration: 60000, easing: Easing.linear }), -1);
    }, []);

    const shadowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: dimensions.width * shadowTranslationX.value }]
    }))


    return (
        <View style={moonStyles.container}>
            <View style={[moonStyles.moon, dimensions]}>
                <Image resizeMode="contain" style={dimensions} source={require("../../../../assets/image/tithi/new-moon-bg-removed.png")} />
                <Animated.View style={[moonStyles.shadow, { backgroundColor: shadowFillColor, ...dimensions, borderRadius: dimensions.width / 2 }, shadowAnimatedStyle]} />
            </View>
            <Text style={moonStyles.label}>{currentTithi}</Text>
        </View>)
}

const allMoonPhasesBackgroundStyles = StyleSheet.create({
    container: {
        ...StyleUtils.flexRowCenterAll(5),
        backgroundColor: "#151515",
    }
})

export function AllMoonPhasesBackground() {
    const { width, height } = useWindowDimensions();
    return (<View style={[allMoonPhasesBackgroundStyles.container, { width, height: height * 0.25 }]}>
        <Moon shadowFillColor={"#151515"} />
    </View>)
}