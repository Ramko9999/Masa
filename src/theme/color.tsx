export enum AppColor {
  primary = "primary",
  background = "background",
  accent = "accent",
  tint = "tint",
}

const LightColors: Record<AppColor, string> = {
  [AppColor.background]: "#FFFFFF",
  [AppColor.primary]: "#000000",
  [AppColor.tint]: "#87888B",
  [AppColor.accent]: "#66C8FF",
};

export function useGetColor(color: AppColor) {
  return LightColors[color];
}
