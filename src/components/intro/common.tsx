import { getFontSize, scaleFontSize } from "@/theme";
import { useGetColor } from "@/theme/color";
import { AppColor } from "@/theme/color";
import { ColorSchemeName, StyleSheet } from "react-native";

export const introSlideStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    flexDirection: "column",
    gap: "3%",
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "6%",
  },
  actionButtonContainer: {
    marginTop: "auto",
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: useGetColor(AppColor.primary, theme),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
  },
  title: {
    fontSize: getFontSize({ huge: true }),
    fontWeight: "bold",
    color: useGetColor(AppColor.primary, theme),
    lineHeight: scaleFontSize(40),
  },
  subtext: {
    fontSize: getFontSize({ bigger: true }),
    fontWeight: "400",
    color: useGetColor(AppColor.primary, theme),
    lineHeight: scaleFontSize(36),
    letterSpacing: 0.5,
  },
});

export type IntroSlideProps = {
  onNext: () => void;
};

export const STAGGER = 150;
export const WORD_DURATION = 600;
export const DELAY_PADDING = 600;