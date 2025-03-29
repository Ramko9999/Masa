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
  [AppColor.tint]: "#737373",
  [AppColor.accent]: "#66C8FF",
  [AppColor.border]: "#DCDCDC",
};

export function useGetColor(color: AppColor) {
  return LightColors[color];
}
