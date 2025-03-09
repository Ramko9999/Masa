import React from "react";
import Svg, { Circle, Path, G } from "react-native-svg";
import { ViewStyle } from "react-native";
import { useGetColor } from "../theme/color";

export interface MoonProps {
  className?: string;
  style?: ViewStyle;
  width?: number;
  height?: number;
  fill?: string;
  scale?: number;
}

const fillColor = useGetColor("secondary");

const Moon = ({
  style,
  width = 24,
  height = 24,
  scale = 0.8,
  children,
}: MoonProps & { children?: React.ReactNode }) => {
  return (
    <Svg viewBox="0 0 200 200" width={width} height={height} style={style}>
      <Circle
        cx="100"
        cy="100"
        r="90"
        stroke={fillColor}
        strokeWidth={20}
        fill="transparent"
      />
      <G
        transform={`scale(${scale}) translate(${(100 * (1 - scale)) / scale}, ${
          (100 * (1 - scale)) / scale
        })`}
      >
        {children}
      </G>
    </Svg>
  );
};

// Phase 1: New Moon (no visible moon)
const NewMoon = (props: MoonProps) => (
  <Moon {...props}>
    <Circle cx="100" cy="100" r="80" fill="transparent" />
  </Moon>
);

// Phase 2: Waxing Crescent (small sliver visible)
const WaxingCrescent1 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a65,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 3: Waxing Crescent (slightly larger)
const WaxingCrescent2 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a50,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 4: Waxing Crescent (larger still)
const WaxingCrescent3 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a35,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 5: First Quarter (half moon)
const FirstQuarter = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a0,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 6: Waxing Gibbous (more than half)
const WaxingGibbous1 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a-15,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 7: Waxing Gibbous (even more)
const WaxingGibbous2 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a-30,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 8: Waxing Gibbous (almost full)
const WaxingGibbous3 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,1 0,160 a-50,80 0 0,0 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 9: Full Moon
const FullMoon = (props: MoonProps) => (
  <Moon {...props}>
    <Circle cx="100" cy="100" r="80" fill={fillColor} />
  </Moon>
);

// Phase 10: Waning Gibbous (slightly less than full)
const WaningGibbous1 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a-50,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 11: Waning Gibbous (less full)
const WaningGibbous2 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a-30,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 12: Waning Gibbous (approaching half)
const WaningGibbous3 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a-15,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 13: Last Quarter (half moon again)
const LastQuarter = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a0,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 14: Waning Crescent
const WaningCrescent1 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a35,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// Phase 15: Waning Crescent (tiny sliver before new moon)
const WaningCrescent2 = (props: MoonProps) => (
  <Moon {...props}>
    <Path
      d="M100,20 a80,80 0 0,0 0,160 a65,80 0 0,1 0,-160"
      fill={fillColor}
      strokeLinecap="round"
    />
  </Moon>
);

// TODO: Do we want to prefix with Shukla and Krishna?
export enum Tithi {
  pratipada = 1,
  dwitiya = 2,
  tritiya = 3,
  chaturthi = 4,
  panchami = 5,
  shashthi = 6,
  saptami = 7,
  ashtami = 8,
  navami = 9,
  dashami = 10,
  ekadashi = 11,
  dwadashi = 12,
  trayodashi = 13,
  chaturdashi = 14,
  purnima = 15,
  amavasya = 30,
}

// This mapping is not complete and is inaccurate. 
// TODO: Make this more accurate. 
const tithiToPhaseComponent: Record<Tithi, React.FC<MoonProps>> = {
  [Tithi.amavasya]: NewMoon,
  [Tithi.pratipada]: WaxingCrescent1,
  [Tithi.dwitiya]: WaxingCrescent2,
  [Tithi.tritiya]: WaxingCrescent3,
  [Tithi.chaturthi]: FirstQuarter,
  [Tithi.panchami]: WaxingGibbous1,
  [Tithi.shashthi]: WaxingGibbous2,
  [Tithi.saptami]: WaxingGibbous2,
  [Tithi.ashtami]: WaxingGibbous3,
  [Tithi.navami]: FullMoon,
  [Tithi.dashami]: WaningGibbous1,
  [Tithi.ekadashi]: WaningGibbous2,
  [Tithi.dwadashi]: WaningGibbous3,
  [Tithi.trayodashi]: LastQuarter,
  [Tithi.chaturdashi]: WaningCrescent1,
  [Tithi.purnima]: WaningCrescent2,
};

export const MoonPhase = ({ tithi }: { tithi: Tithi }) => {
  const PhaseComponent = tithiToPhaseComponent[tithi];
  return <PhaseComponent />;
};
