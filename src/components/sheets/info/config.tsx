import React from "react";
import { StyleSheet, useWindowDimensions, View, Image } from "react-native";
import { ImageBackground } from "../info/util";
import { tintColor } from "../../../util/color";
import { Text } from "../../../theme";
import { AllMoonPhasesBackground } from "./tithi";

export type InfoSlide = {
  image: React.ReactNode;
  backgroundColor: string;
  textWrapColor: string;
  description: React.ReactNode
}

const infoSlideTextStyles = StyleSheet.create({
  base: {
    color: "white",
    fontSize: 16
  },
  italic: {
    fontStyle: "italic"
  }
})

function Sig({ children }: { children: React.ReactNode }) {
  return <Text style={[infoSlideTextStyles.base, infoSlideTextStyles.italic]} bold>{children}</Text>;
}

function Base({ children }: { children: React.ReactNode }) {
  return <Text style={infoSlideTextStyles.base}>{children}</Text>;
}

const moonStyles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: 50,
    height: 50,
  },
  shadow: {
    position: "absolute",
    left: 3,
    top: 3,
    width: 45,
    height: 45,
    borderRadius: 25,
    transform: [{translateX: -20}]
  }
})

type MoonProps = {
  shadow: number,
  shadowFillColor: string;
}

function Moon({shadow, shadowFillColor}: MoonProps) {
  return (<View style={moonStyles.container}>
    <Image resizeMode="contain" style={{width: 50, height: 50}} source={require("../../../assets/image/tithi/new-moon-bg-removed.png")} />
    <View style={[moonStyles.shadow, {backgroundColor: shadowFillColor}]} />
  </View>)
}

function ShuklaPakshaBackground() {
  const {width, height} = useWindowDimensions();
  return (<View style={{width, height: height * 0.25, backgroundColor: "#151515"}}>
    <Moon shadow={0} shadowFillColor={"#151515"} />
  </View>)
}

export const TITHI_INFO_SLIDES: InfoSlide[] = [
  {
    image: <ImageBackground image={require("../../../assets/image/tithi/moon.jpg")} />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: <Base><Sig>Tithi</Sig> is a lunar day defined by the Moon's angle with the Sun. A Tithi occupies 12 degrees of this angle.</Base>
  },
  {
    image: <AllMoonPhasesBackground />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: <Base>A lunar month consists of 30 Tithis. The first 15th correspond to <Sig>Shukla Paksha</Sig> and the last 15th correspond to <Sig>Krishna Paksha</Sig>.</Base>
  },
  {
    image: <ShuklaPakshaBackground />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: <Base>Shukla Paksha is when the moon waxes from new moon to full moon.</Base>
  },
  {
    image: <ImageBackground image={require("../../../assets/image/tithi/moon.jpg")} />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: <Base>Krishna Paksha is when the moon wanes from full moon to new moon.</Base>
  }
]