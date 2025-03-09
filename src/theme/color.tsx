import { useColorScheme } from "react-native";

type AppColor =
  | "primary"
  | "background"
  | "secondary"
  | "secondary-light"
  | "button-background" 
  | "button-text"
  | "text-primary"
  | "text-primary-tint-1"
  | "text-primary-tint-2";

const LightColors: Record<AppColor, string> = {
  primary: "#000000",
  background: "#FFFFFF",
  secondary: "#66C8FF",
  "button-background": "#F5F5F5",
  "button-text": "#868586",
  "secondary-light": "#F5F5F5",
  "text-primary": "#111111",
  "text-primary-tint-1": "#878787",
  "text-primary-tint-2": "#B7B7B7",
};

// todo: figure out dark mode colors later
const DarkColors: Record<AppColor, string> = {
  primary: "#ffffff",
  background: "#000000",
  secondary: "#000000",
  "secondary-light": "#000000",
  "button-background": "#000000",
  "button-text": "#ffffff",
  "text-primary": "#ffffff",
  "text-primary-tint-1": "#cccccc",
  "text-primary-tint-2": "#999999",
};

export function useGetColor(color: AppColor) {
  const theme = "light";
  const colors = theme === "light" ? LightColors : DarkColors;
  return colors[color];
}
