import React from "react";
import { StyleSheet, useWindowDimensions, View, Image } from "react-native";
import { ImageBackground } from "../info/util";
import { tintColor } from "../../../util/color";
import { Text } from "../../../theme";
import { KrishnaPakshaBackground, ShuklaPakshaBackground, TithiProgressBackground, TransitioningMoonBackground } from "./tithi";
import { StyleUtils } from "../../../theme/style-utils";

export type InfoSlide = {
  background: React.ReactNode;
  backgroundColor: string;
  textWrapColor: string;
  description: React.ReactNode;
};

const infoSlideTextStyles = StyleSheet.create({
  base: {
    color: "white",
    fontSize: 16,
  },
  italic: {
    fontStyle: "italic",
  },
});

function Sig({ children }: { children: React.ReactNode }) {
  return (
    <Text style={[infoSlideTextStyles.base, infoSlideTextStyles.italic]} bold>
      {children}
    </Text>
  );
}

function Base({ children }: { children: React.ReactNode }) {
  return <Text style={infoSlideTextStyles.base}>{children}</Text>;
}

export const TITHI_INFO_SLIDES: InfoSlide[] = [
  {
    background: (
      <ImageBackground image={require("../../../../assets/tithi/moon.jpg")} />
    ),
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: (
      <Base>
        <Sig>Tithi</Sig> is a lunar day defined by the Moon's angle with the
        Sun. A tithi's duration is how long it takes the Moon to travel 12 degrees along this angle.
      </Base>
    ),
  },
  {
    background: <TransitioningMoonBackground />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: <Base>A lunar month consists of 30 Tithis.</Base>,
  },
  {
    background: <ShuklaPakshaBackground />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: (
      <Base>
        The first 15 tithis correspond to Shukla Paksha which is the waxing phase of the moon.
      </Base>
    ),
  },
  {
    background: <KrishnaPakshaBackground />,
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
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
    backgroundColor: "#151515",
    textWrapColor: tintColor("#151515"),
    description: (
      <Base>
        We are in the current tithi.
      </Base>
    ),
  }
];
