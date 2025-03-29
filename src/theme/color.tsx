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

export function useGetColor(color: AppColor) {
  return LightColors[color];
}
