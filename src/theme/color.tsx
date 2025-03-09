import { useColorScheme } from "react-native";

type AppColor =
  | "primary"
  | "secondary"
  | "text-primary"
  | "text-primary-tint-1"
  | "text-primary-tint-2";

const LightColors: Record<AppColor, string> = {
  primary: "#000000",
  secondary: "#ffffff",
  "text-primary": "#000000",
  "text-primary-tint-1": "#333333",
  "text-primary-tint-2": "#666666",
};

// todo: figure out dark mode colors later
const DarkColors: Record<AppColor, string> = {
  primary: "#ffffff",
  secondary: "#000000",
  "text-primary": "#ffffff",
  "text-primary-tint-1": "#cccccc",
  "text-primary-tint-2": "#999999",
};

export function useGetColor(color: AppColor) {
  const theme = useColorScheme() ?? "light";
  const colors = theme === "light" ? LightColors : DarkColors;
  return colors[color];
}
