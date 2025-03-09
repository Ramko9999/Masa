import { Text as DefaultText, View as DefaultView } from "react-native";
import React from "react";
import { useGetColor } from "./color";

type TextSizeProps = {
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

function getFontSize({ small, neutral, large }: TextSizeProps) {
  if (small) {
    return 12;
  } else if (neutral) {
    return 20;
  } else if (large) {
    return 42;
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

function getFontFamily({ thin, extralight, light, regular, medium, semibold, bold, extrabold, black }: TextWeightProps) {
  if (thin) {
    return "Inter_100Thin";
  } else if (extralight) {
    return "Inter_200ExtraLight";
  } else if (light) {
    return "Inter_300Light";
  } else if (regular) {
    return "Inter_400Regular";
  } else if (medium) {
    return "Inter_500Medium";
  } else if (semibold) {
    return "Inter_600SemiBold";
  } else if (bold) {
    return "Inter_700Bold";
  } else if (extrabold) {
    return "Inter_800ExtraBold";
  } else if (black) {
    return "Inter_900Black";
  }

  // default return regular weight
  return "Inter_400Regular";
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
          fontFamily: getFontFamily(props),
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
