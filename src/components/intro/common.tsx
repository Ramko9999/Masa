import { useGetColor } from "@/theme/color";
import { AppColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { StyleSheet } from "react-native";

export const introSlideStyles = StyleSheet.create({
    container: {
        ...StyleUtils.flexColumn(30),
        flex: 1,
        paddingHorizontal: "5%",
        paddingTop: "6%",
    },
    actionButtonContainer: {
        marginTop: "auto",
        marginBottom: "10%",
        alignSelf: "center",
    },
    actionButton: {
        backgroundColor: useGetColor(AppColor.primary),
        paddingHorizontal: "8%",
        paddingVertical: "4%",
        borderRadius: 12,
    },
    actionText: {
        color: useGetColor(AppColor.background),
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: useGetColor(AppColor.primary),
        lineHeight: 40,
    },
    subtext: {
        fontSize: 28,
        fontWeight: "400",
        color: useGetColor(AppColor.primary),
        lineHeight: 36,
        letterSpacing: 0.5,
    },
});

export type IntroSlideProps = {
    onNext: () => void;
}

export const STAGGER = 150;
export const WORD_DURATION = 600;
export const DELAY_PADDING = 600;
