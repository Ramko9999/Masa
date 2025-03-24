import React from "react";
import Svg, { Path } from "react-native-svg";

interface MoonsetIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export const MoonsetIcon: React.FC<MoonsetIconProps> = ({
  width = 24,
  height = 24,
  fill = "#6F60C0",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path d="M9.36 3.293a1 1 0 0 1 .187 1.157A7.45 7.45 0 0 0 19.55 14.453a1 1 0 0 1 1.343 1.343 9.45 9.45 0 1 1-12.69-12.69 1 1 0 0 1 1.158.187zM6.823 6.67A7.45 7.45 0 0 0 17.33 17.179 9.45 9.45 0 0 1 6.821 6.67z" />

      <Path
        d="M17 12v-8"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="m13 8 4 4 4-4"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default MoonsetIcon;
