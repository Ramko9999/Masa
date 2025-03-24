import React from "react";
import Svg, { Path } from "react-native-svg";

interface SunsetIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export const SunsetIcon: React.FC<SunsetIconProps> = ({
  width = 24,
  height = 24,
  fill = "#EE9321",
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 10V2" />
      <Path d="m4.93 10.93 1.41 1.41" />
      <Path d="M2 18h2" />
      <Path d="M20 18h2" />
      <Path d="m19.07 10.93-1.41 1.41" />
      <Path d="M22 22H2" />
      <Path d="m16 6-4 4-4-4" />
      <Path d="M16 18a4 4 0 0 0-8 0" />
    </Svg>
  );
};

export default SunsetIcon;
