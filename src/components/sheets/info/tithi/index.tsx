import { StyleSheet, useWindowDimensions } from "react-native";
import { View, Text } from "../../../../theme";
import { StyleUtils } from "../../../../theme/style-utils";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withRepeat,
  useAnimatedReaction,
  runOnJS,
  FadeIn,
} from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { tintColor } from "../../../../util/color";
import { AnimatedMoonInPhase, MoonInPhase } from "./util";
import { positiveModulo } from "../../../../util/math";
import { TITHI_NAMES } from "../../../../api/panchanga/core/tithi";
import { ImageBackground, Base, Sig, InfoSlide } from "../util";


function getTithiIndexFromMoonPhase(phase: number) {
  const angle = phase * 180;
  return positiveModulo(Math.floor(angle / 12) - 1, 30);
}

function removePakshaPrefix(tithiName: string) {
  if (!(tithiName.includes(" "))) {
    return tithiName;
  }
  return tithiName.split(" ")[1];
}

const transitionMoonBackgroundStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(5),
    alignItems: "center",
  },
  shadow: {
    position: "absolute",
  },
  label: {
    fontSize: 20,
    color: tintColor("#151515", 0.6),
  },
});

export function TransitioningMoonBackground() {
  const phase = useSharedValue(0);
  const [tithiIndex, setTithiIndex] = useState(0);
  const { width, height } = useWindowDimensions();

  const onSetTithi = (phase: number) =>
    setTithiIndex(getTithiIndexFromMoonPhase(phase));

  useAnimatedReaction(
    () => phase.value,
    (phase) => {
      runOnJS(onSetTithi)(phase);
    }
  );

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(2, { duration: 30000, easing: Easing.linear }),
      -1
    );
  }, []);

  return (
    <View
      style={[
        transitionMoonBackgroundStyles.container,
        { width, height: height * 0.3 },
      ]}
    >
      <AnimatedMoonInPhase phase={phase} height={height * 0.25} width={width} />
      <Text style={transitionMoonBackgroundStyles.label}>
        {TITHI_NAMES[tithiIndex]}
      </Text>
    </View>
  );
}

const pakshaBackgroundStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRowCenterAll(5),
    flexWrap: "wrap",
    paddingTop: "3%",
    paddingHorizontal: "2%",
    backgroundColor: "#151515",
  },
  moon: {
    ...StyleUtils.flexColumn(0),
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: tintColor("#151515", 0.6),
  },
});

type PakshaBackgroundProps = {
  tithiIndexes: number[];
}

function PakshaBackground({ tithiIndexes }: PakshaBackgroundProps) {
  const { width, height } = useWindowDimensions();

  const dimension = width * 0.15

  return (
    <View style={[pakshaBackgroundStyles.container, { width, height: height * 0.3 }]}>
      {tithiIndexes.map((index, arrayIndex) => (
        <Animated.View key={index} style={pakshaBackgroundStyles.moon} entering={FadeIn.delay(arrayIndex * 500)}>
          <MoonInPhase phase={(index + 1) * 12 / 180} width={dimension} height={dimension} />
          <Text style={pakshaBackgroundStyles.label}>{removePakshaPrefix(TITHI_NAMES[index])}</Text>
        </Animated.View>
      ))}
    </View>
  )
}

export function ShuklaPakshaBackground() {
  return <PakshaBackground tithiIndexes={Array.from({ length: 15 }, (_, i) => i)} />
}

export function KrishnaPakshaBackground() {
  return <PakshaBackground tithiIndexes={Array.from({ length: 15 }, (_, i) => i + 15)} />
}

const tithiProgressBackgroundStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRowCenterAll(0),
  },
  moonBorder: {
    ...StyleUtils.flexRowCenterAll(0),
    borderWidth: 1,
    backgroundColor: tintColor("#151515", 0.3),
    borderColor: tintColor("#151515", 0.3),
  },
  progress: {
    position: "absolute",
    height: "10%",
    width: "100%",
    backgroundColor: tintColor("#151515", 0.1),
  }
});

export function TithiProgressBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[tithiProgressBackgroundStyles.container, { width, height: height * 0.3 }]}>
      <View style={tithiProgressBackgroundStyles.progress}></View>
    </View>
  )
}

const commonSlideProps = {
  backgroundColor: "#151515",
  textWrapColor: tintColor("#151515"),
}

export const SLIDES: InfoSlide[] = [
  {
    background: (
      <ImageBackground image={require("../../../../../assets/tithi/moon.jpg")} />
    ),
    ...commonSlideProps,
    description: (
      <Base>
        <Sig>Tithi</Sig> is a lunar day defined by the Moon's angle with the
        Sun. A tithi's duration is how long it takes the Moon to travel 12 degrees along this angle.
      </Base>
    ),
  },
  {
    background: <TransitioningMoonBackground />,
    ...commonSlideProps,
    description: <Base>A lunar month consists of 30 Tithis.</Base>,
  },
  {
    background: <ShuklaPakshaBackground />,
    ...commonSlideProps,
    description: (
      <Base>
        The first 15 tithis correspond to Shukla Paksha which is the waxing phase of the moon.
      </Base>
    ),
  },
  {
    background: <KrishnaPakshaBackground />,
    ...commonSlideProps,
    description: (
      <View style={{ ...StyleUtils.flexColumn(10) }}>
        <Base>
          The last 15 tithis correspond to Krishna Paksha which is the waning phase of the moon.
        </Base>
        <Base>
          The tithi names from Pratipada to Chaturdashi are used in both pakshas.
        </Base>
      </View>
    ),
  },
  {
    background: <TithiProgressBackground />,
    ...commonSlideProps,
    description: (
      <Base>
        We are in the current tithi.
      </Base>
    ),
  }
];