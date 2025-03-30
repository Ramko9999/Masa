import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";
import { TithiIndex } from "@/api/panchanga/core/tithi";
import { AppColor } from "@/theme/color";
import { useGetColor } from "@/theme/color";

export interface MoonProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const Moon: React.FC<MoonProps & { children?: React.ReactNode }> = ({
  width = 96,
  height = 96,
  style,
  children,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill={useGetColor(AppColor.tint)}
      style={style}
      {...props}
    >
      {children}
    </Svg>
  );
};

export const Tithi1 = (props: MoonProps) => (
  <Moon {...props}>
    <Circle cx="100" cy="100" r="80" fill="transparent" />
  </Moon>
);

export const Tithi2 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a79.56,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi3 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a76.08,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi4 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi5 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi6 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi7 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi8 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi9 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a0,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi10 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a16.63,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi11 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a32.54,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi12 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a47.02,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi13 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a59.45,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi14 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a69.28,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi15 = (props: MoonProps) => (
  <Moon {...props}>
    <Circle cx="100" cy="100" r="80" fill={useGetColor(AppColor.tint)} />
  </Moon>
);

export const Tithi16 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a76.08,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi17 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a69.28,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi18 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a59.45,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi19 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a47.02,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi20 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a32.54,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi21 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 1,0 0,160 a16.63,80 0 0,0 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi22 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a0,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi23 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a16.63,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi24 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a32.54,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi25 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a47.02,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi26 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a59.45,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi27 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a69.28,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi28 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a76.08,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi29 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a-79.56,80 0 0,1 0,-160"
      fill={useGetColor(AppColor.tint)}
      strokeLinecap="round"
    />
  </Moon>
);

export const Tithi30 = (props: MoonProps) => (
  <Moon {...props}>
    <Circle cx="100" cy="100" r="80" fill="transparent" />
  </Moon>
);

export const TithiNameToComponent = {
  [TithiIndex.ShuklaPratipada]: Tithi1,
  [TithiIndex.ShuklaDwitiya]: Tithi2,
  [TithiIndex.ShuklaTritiya]: Tithi3,
  [TithiIndex.ShuklaChaturthi]: Tithi4,
  [TithiIndex.ShuklaPanchami]: Tithi5,
  [TithiIndex.ShuklaShashti]: Tithi6,
  [TithiIndex.ShuklaSaptami]: Tithi7,
  [TithiIndex.ShuklaAshtami]: Tithi8,
  [TithiIndex.ShuklaNavami]: Tithi9,
  [TithiIndex.ShuklaDashami]: Tithi10,
  [TithiIndex.ShuklaEkadashi]: Tithi11,
  [TithiIndex.ShuklaDwadashi]: Tithi12,
  [TithiIndex.ShuklaTrayodashi]: Tithi13,
  [TithiIndex.ShuklaChaturdashi]: Tithi14,
  [TithiIndex.Purnima]: Tithi15,
  [TithiIndex.KrishnaPratipada]: Tithi16,
  [TithiIndex.KrishnaDwitiya]: Tithi17,
  [TithiIndex.KrishnaTritiya]: Tithi18,
  [TithiIndex.KrishnaChaturthi]: Tithi19,
  [TithiIndex.KrishnaPanchami]: Tithi20,
  [TithiIndex.KrishnaShashti]: Tithi21,
  [TithiIndex.KrishnaSaptami]: Tithi22,
  [TithiIndex.KrishnaAshtami]: Tithi23,
  [TithiIndex.KrishnaNavami]: Tithi24,
  [TithiIndex.KrishnaDashami]: Tithi25,
  [TithiIndex.KrishnaEkadashi]: Tithi26,
  [TithiIndex.KrishnaDwadashi]: Tithi27,
  [TithiIndex.KrishnaTrayodashi]: Tithi28,
  [TithiIndex.KrishnaChaturdashi]: Tithi29,
  [TithiIndex.Amavasya]: Tithi30,
};
