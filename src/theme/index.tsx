import { Text as DefaultText, View as DefaultView } from "react-native";
import React from "react";
import { useGetColor } from "./color";

type TextSizeProps = {
  xSmall?: boolean;
  small?: boolean;
  neutral?: boolean;
  large?: boolean;
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
  primary?: boolean;
  tint1?: boolean;
  tint2?: boolean;
};

type TextProps = DefaultText["props"] &
  TextSizeProps &
  TextColorProps &
  TextWeightProps;

function getFontSize({ xSmall, small, neutral, large }: TextSizeProps) {
  if (xSmall) {
    return 12;
  } else if (small) {
    return 16;
  } else if (neutral) {
    return 20;
  } else if (large) {
    return 28;
  }

  // default return neutral size
  return 20;
}

function getFontColor({ primary, tint1, tint2 }: TextColorProps) {
  if (primary) {
    return "text-primary";
  } else if (tint1) {
    return "text-primary-tint-1";
  } else if (tint2) {
    return "text-primary-tint-2";
  }

  // default return primary color
  return "text-primary";
}

function getFontWeight({ thin, extralight, light, regular, medium, semibold, bold, extrabold, black }: TextWeightProps) {
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

  // default return regular weight
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
