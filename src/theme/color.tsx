import { useColorScheme } from "react-native";

type AppColor =
  | "primary"
  | "background"
  | "secondary"
  | "text-primary"
  | "text-primary-tint-1"
  | "text-primary-tint-2";

const LightColors: Record<AppColor, string> = {
  primary: "#000000",
  background: "#ffffff",
  secondary: "#66C8FF",
  "text-primary": "#111111",
  "text-primary-tint-1": "#878787",
  "text-primary-tint-2": "#B7B7B7",
};

// todo: figure out dark mode colors later
const DarkColors: Record<AppColor, string> = {
  primary: "#ffffff",
  background: "#000000",
  secondary: "#000000",
  "text-primary": "#ffffff",
  "text-primary-tint-1": "#cccccc",
  "text-primary-tint-2": "#999999",
};

export function useGetColor(color: AppColor) {
  const theme = "light";
  const colors = theme === "light" ? LightColors : DarkColors;
  return colors[color];
}
