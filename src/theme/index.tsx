import { Text as DefaultText, View as DefaultView } from "react-native";
import React from "react";

type TextSizeProps = {
  small?: boolean;
  neutral?: boolean;
  large?: boolean;
};

type TextProps = DefaultText["props"] & TextSizeProps;

function getFontSize({ small, neutral, large }: TextSizeProps) {
  if (small) {
    return 12;
  } else if (neutral) {
    return 16;
  } else if (large) {
    return 20;
  }

  // default return neutral size
  return 16;
}

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  return (
    <DefaultText
      style={[{ fontSize: getFontSize(props) }, style]}
      {...otherProps}
    />
  );
}

export const View = React.forwardRef(
  (props: DefaultView["props"], ref: React.ForwardedRef<DefaultView>) => {
    return <DefaultView ref={ref} {...props} />;
  }
);
