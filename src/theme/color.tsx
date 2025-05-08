import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ColorSchemeName, useColorScheme, StyleSheet } from "react-native";

export enum AppColor {
  primary = "primary",
  background = "background",
  accent = "accent",
  tint = "tint",
  border = "border",
}

const LightColors: Record<AppColor, string> = {
  [AppColor.background]: "#FFFFFF",
  [AppColor.primary]: "#000000",
  [AppColor.tint]: "#808080",
  [AppColor.accent]: "#0097DF",
  [AppColor.border]: "#DCDCDC",
};

const DarkColors: Record<AppColor, string> = {
  [AppColor.background]: "#05010D",
  [AppColor.primary]: "#FFFFFF",
  [AppColor.accent]: "#0097DF",
  [AppColor.tint]: "#717176",
  [AppColor.border]: "#19191A",
};

export function useGetColor(color: AppColor, theme: ColorSchemeName) {
  return theme === "light" ? LightColors[color] : DarkColors[color];
}

type StyleFactory<T> = (theme: ColorSchemeName, language: string) => T;

export function useThemedStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>
>(styleFactory: StyleFactory<T>): T {
  const theme = useColorScheme();
  const { i18n } = useTranslation();

  const styles = useMemo(() => {
    const rawStyles = styleFactory(theme, i18n.language);
    return StyleSheet.create(rawStyles);
  }, [theme, styleFactory]);

  return styles;
}
