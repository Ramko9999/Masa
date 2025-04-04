import React, { forwardRef } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { StyleProp, View, ViewStyle, Text } from "react-native";
import { TithiIndex, TITHI_NAMES } from "@/api/panchanga/core/tithi";
import { AppColor } from "@/theme/color";
import { useGetColor } from "@/theme/color";

export interface MoonProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  tithiIndex: TithiIndex;
}

export const MoonGrid = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.entries(TITHI_MAP).map(([tithiIndex, _]) => {
        // Get the name of the tithi from the TITHI_NAMES array
        const index = Number(tithiIndex);
        const tithiName = TITHI_NAMES[index];
        
        return (
          <View 
            key={tithiIndex} 
            style={{ 
              width: 70, 
              height: 70, 
              alignItems: 'center', 
              margin: 5 
            }}
          >
            <Moon 
              tithiIndex={index as TithiIndex} 
              width={40} 
              height={40} 
            />
            <View style={{ marginTop: 4, alignItems: 'center' }}>
              <Text 
                style={{ 
                  fontSize: 10, 
                  textAlign: 'center', 
                  color: useGetColor(AppColor.primary) 
                }}
              >
                {tithiName}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export const Moon = forwardRef<
  React.ComponentRef<typeof Svg>,
  MoonProps & { children?: React.ReactNode }
>(({ width = 96, height = 96, style, tithiIndex, ...props }, ref) => {
  const TithiComponent = TITHI_MAP[tithiIndex];

  return (
    <Svg
      ref={ref}
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill={useGetColor(AppColor.tint)}
      style={style}
      {...props}
    >
      <TithiComponent />
    </Svg>
  );
});

export const ShuklaPratipada = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a79.56,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDwitiya = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a76.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaTritiya = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a73.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaChaturthi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaPanchami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaShashti = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaSaptami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaAshtami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaNavami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a0,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDashami = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaEkadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaDwadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaTrayodashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const ShuklaChaturdashi = () => (
  <Path
    d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const Purnima = () => (
  <Circle cx="100" cy="100" r="80" fill={useGetColor(AppColor.tint)} />
);

export const KrishnaPratipada = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a76.08,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDwitiya = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a69.28,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaTritiya = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a59.45,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaChaturthi = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a47.02,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaPanchami = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a32.54,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaShashti = () => (
  <Path
    d="M100,20 a80,80 0 1,0 0,160 a16.63,80 0 0,0 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaSaptami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a0,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaAshtami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a16.63,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaNavami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a32.54,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDashami = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a47.02,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaEkadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a59.45,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaDwadashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a69.28,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaTrayodashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a76.08,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const KrishnaChaturdashi = () => (
  <Path
    d="M100,20 a80,80 0 0,0 0,160 a79.56,80 0 0,1 0,-160"
    fill={useGetColor(AppColor.tint)}
    strokeLinecap="round"
  />
);

export const Amavasya = () => (
  <Circle cx="100" cy="100" r="80" fill="transparent" />
);

const TITHI_MAP = {
  [TithiIndex.ShuklaPratipada]: ShuklaPratipada,
  [TithiIndex.ShuklaDwitiya]: ShuklaDwitiya,
  [TithiIndex.ShuklaTritiya]: ShuklaTritiya,
  [TithiIndex.ShuklaChaturthi]: ShuklaChaturthi,
  [TithiIndex.ShuklaPanchami]: ShuklaPanchami,
  [TithiIndex.ShuklaShashti]: ShuklaShashti,
  [TithiIndex.ShuklaSaptami]: ShuklaSaptami,
  [TithiIndex.ShuklaAshtami]: ShuklaAshtami,
  [TithiIndex.ShuklaNavami]: ShuklaNavami,
  [TithiIndex.ShuklaDashami]: ShuklaDashami,
  [TithiIndex.ShuklaEkadashi]: ShuklaEkadashi,
  [TithiIndex.ShuklaDwadashi]: ShuklaDwadashi,
  [TithiIndex.ShuklaTrayodashi]: ShuklaTrayodashi,
  [TithiIndex.ShuklaChaturdashi]: ShuklaChaturdashi,
  [TithiIndex.Purnima]: Purnima,
  [TithiIndex.KrishnaPratipada]: KrishnaPratipada,
  [TithiIndex.KrishnaDwitiya]: KrishnaDwitiya,
  [TithiIndex.KrishnaTritiya]: KrishnaTritiya,
  [TithiIndex.KrishnaChaturthi]: KrishnaChaturthi,
  [TithiIndex.KrishnaPanchami]: KrishnaPanchami,
  [TithiIndex.KrishnaShashti]: KrishnaShashti,
  [TithiIndex.KrishnaSaptami]: KrishnaSaptami,
  [TithiIndex.KrishnaAshtami]: KrishnaAshtami,
  [TithiIndex.KrishnaNavami]: KrishnaNavami,
  [TithiIndex.KrishnaDashami]: KrishnaDashami,
  [TithiIndex.KrishnaEkadashi]: KrishnaEkadashi,
  [TithiIndex.KrishnaDwadashi]: KrishnaDwadashi,
  [TithiIndex.KrishnaTrayodashi]: KrishnaTrayodashi,
  [TithiIndex.KrishnaChaturdashi]: KrishnaChaturdashi,
  [TithiIndex.Amavasya]: Amavasya,
};
