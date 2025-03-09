import { Text as DefaultText, View as DefaultView } from "react-native";
import React from "react";
import { useGetColor } from "./color";

type TextSizeProps = {
  small?: boolean;
  neutral?: boolean;
  large?: boolean;
};

type TextWeightProps = {
  light?: boolean;
  bold?: boolean;
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

function getFontWeight({ light, bold }: TextWeightProps) {
  if (light) {
    return "300";
  } else if (bold) {
    return "600";
  }

  // default return neutral weight
  return "500";
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
