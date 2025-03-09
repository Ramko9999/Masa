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
  shukla_pratipada = 1,
  shukla_dwitiya = 2,
  shukla_tritiya = 3,
  shukla_chaturthi = 4,
  shukla_panchami = 5,
  shukla_shashthi = 6,
  shukla_saptami = 7,
  shukla_ashtami = 8,
  shukla_navami = 9,
  shukla_dashami = 10,
  shukla_ekadashi = 11,
  shukla_dwadashi = 12,
  shukla_trayodashi = 13,
  shukla_chaturdashi = 14,
  purnima = 15,
  krishna_pratipada = 16,
  krishna_dwitiya = 17,
  krishna_tritiya = 18,
  krishna_chaturthi = 19,
  krishna_panchami = 20,
  krishna_shashthi = 21,
  krishna_saptami = 22,
  krishna_ashtami = 23,
  krishna_navami = 24,
  krishna_dashami = 25,
  krishna_ekadashi = 26,
  krishna_dwadashi = 27,
  krishna_trayodashi = 28,
  krishna_chaturdashi = 29,
  amavasya = 30,
}

// This mapping is not complete and is inaccurate. 
// TODO: Make this more accurate. 
const tithiToPhaseComponent: Record<Tithi, React.FC<MoonProps>> = {
  [Tithi.amavasya]: NewMoon,
  [Tithi.shukla_pratipada]: WaxingCrescent1,
  [Tithi.shukla_dwitiya]: WaxingCrescent2,
  [Tithi.shukla_tritiya]: WaxingCrescent3,
  [Tithi.shukla_chaturthi]: FirstQuarter,
  [Tithi.shukla_panchami]: WaxingGibbous1,
  [Tithi.shukla_shashthi]: WaxingGibbous2,
  [Tithi.shukla_saptami]: WaxingGibbous2,
  [Tithi.shukla_ashtami]: WaxingGibbous3,
  [Tithi.shukla_navami]: WaxingGibbous3,
  [Tithi.shukla_dashami]: WaxingGibbous3,
  [Tithi.shukla_ekadashi]: WaxingGibbous3,
  [Tithi.shukla_dwadashi]: WaxingGibbous3,
  [Tithi.shukla_trayodashi]: WaxingGibbous3,
  [Tithi.shukla_chaturdashi]: WaxingGibbous3,
  [Tithi.purnima]: FullMoon,
  [Tithi.krishna_pratipada]: WaningGibbous1,
  [Tithi.krishna_dwitiya]: WaningGibbous2,
  [Tithi.krishna_tritiya]: WaningGibbous2,
  [Tithi.krishna_chaturthi]: WaningGibbous3,
  [Tithi.krishna_panchami]: WaningGibbous3,
  [Tithi.krishna_shashthi]: WaningGibbous3,
  [Tithi.krishna_saptami]: LastQuarter,
  [Tithi.krishna_ashtami]: WaningCrescent1,
  [Tithi.krishna_navami]: WaningCrescent1,
  [Tithi.krishna_dashami]: WaningCrescent1,
  [Tithi.krishna_ekadashi]: WaningCrescent1,
  [Tithi.krishna_dwadashi]: WaningCrescent2,
  [Tithi.krishna_trayodashi]: WaningCrescent2,
  [Tithi.krishna_chaturdashi]: WaningCrescent2,
};

export const MoonPhase = ({ tithi, ...props }: { tithi: Tithi } & MoonProps) => {
  const PhaseComponent = tithiToPhaseComponent[tithi];
  return <PhaseComponent {...props} />;
};
