import React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  Dimensions,
  PixelRatio,
} from "react-native";
import { AppColor, useGetColor } from "@/theme/color";

type TextSizeProps = {
  micro?: boolean;
  xtiny?: boolean;
  tiny?: boolean;
  smaller?: boolean;
  small?: boolean;
  sneutral?: boolean;
  neutral?: boolean;
  large?: boolean;
  larger?: boolean;
  big?: boolean;
  bigger?: boolean;
  huge?: boolean;
};

type TextWeightProps = {
  thin?: boolean;
  extralight?: boolean;
  light?: boolean;
  regular?: boolean;
  medium?: boolean;
  semibold?: boolean;
  bold?: boolean;
  extrabold?: boolean;
  black?: boolean;
};

type TextColorProps = {
  background?: boolean;
  primary?: boolean;
  accent?: boolean;
  tint?: boolean;
};

type TextProps = DefaultText["props"] &
  TextSizeProps &
  TextColorProps &
  TextWeightProps;

export function scaleFontSize(size: number) {
  const { width, height } = Dimensions.get("window");
  const scale = Math.min(width / 375, height / 810);
  const newSize = size * scale * PixelRatio.getFontScale();
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function getFontSize({
  micro,
  xtiny,
  tiny,
  smaller,
  small,
  sneutral,
  neutral,
  large,
  larger,
  big,
  bigger,
  huge,
}: TextSizeProps) {
  if (micro) return scaleFontSize(8);
  if (xtiny) return scaleFontSize(9.5);
  if (tiny) return scaleFontSize(11);
  if (smaller) return scaleFontSize(12);
  if (small) return scaleFontSize(13);
  if (sneutral) return scaleFontSize(14);
  if (neutral) return scaleFontSize(16);
  if (large) return scaleFontSize(18);
  if (larger) return scaleFontSize(20);
  if (big) return scaleFontSize(23);
  if (bigger) return scaleFontSize(26);
  if (huge) return scaleFontSize(30);

  return scaleFontSize(14);
}

function getFontColor({ background, primary, accent, tint }: TextColorProps) {
  if (background) return AppColor.background;
  if (primary) return AppColor.primary;
  if (accent) return AppColor.accent;
  if (tint) return AppColor.tint;

  return AppColor.primary;
}

function getFontWeight({
  thin,
  extralight,
  light,
  regular,
  medium,
  semibold,
  bold,
  extrabold,
  black,
}: TextWeightProps) {
  if (thin) {
    return "100";
  } else if (extralight) {
    return "200";
  } else if (light) {
    return "300";
  } else if (regular) {
    return "400";
  } else if (medium) {
    return "500";
  } else if (semibold) {
    return "600";
  } else if (bold) {
    return "700";
  } else if (extrabold) {
    return "800";
  } else if (black) {
    return "900";
  }

  return "400";
}

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = useGetColor(getFontColor(props));
  return (
    <DefaultText
      style={[
        {
          fontSize: getFontSize(props),
          color,
          fontWeight: getFontWeight(props),
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export const View = React.forwardRef(
  (props: DefaultView["props"], ref: React.ForwardedRef<DefaultView>) => {
    return <DefaultView ref={ref} {...props} />;
  }
);
