import { forwardRef, ForwardedRef, MutableRefObject } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { PopupBottomSheet } from "@/components/util/sheet";
import { View, Text } from "@/theme";
import { StyleSheet, ColorSchemeName, TouchableOpacity } from "react-native";
import { useThemedStyles, useGetColor, AppColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { shadeColor, tintColor } from "@/util/color";
import { useTranslation } from "react-i18next";

export const LANGUAGE_OPTIONS = {
  en: "English",
  te: "తెలుగు / Telugu",
};

const languageSheetStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(20),
    paddingHorizontal: "5%",
    paddingTop: "10%",
  },
  title: {
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageContainer: {
    ...StyleUtils.flexRowCenterAll(10),
    backgroundColor: (theme === "dark" ? shadeColor : tintColor)(
      useGetColor(AppColor.primary, theme),
      0.95
    ),
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 12,
  },
  selectedContainer: {
    backgroundColor: useGetColor(AppColor.primary, theme),
  },
  textContainer: {
    flex: 1,
  },
  languageScrollContent: {
    ...StyleUtils.flexColumn(10),
  },
});

type LanguageSelectionProps = {
  onSelectLanguage: (language: string) => void;
  currentLanguage: string;
};

function LanguageSelection({
  onSelectLanguage,
  currentLanguage,
}: LanguageSelectionProps) {
  const insets = useSafeAreaInsets();
  const languageSheetStyles = useThemedStyles(languageSheetStylesFactory);
  const { t } = useTranslation();

  return (
    <BottomSheetView
      style={[languageSheetStyles.container, { bottom: insets.bottom }]}
    >
      <View style={languageSheetStyles.title}>
        <Text larger semibold tint>
          {t("settings.settings_items.language.title")}
        </Text>
      </View>
      <View style={languageSheetStyles.languageScrollContent}>
        {Object.entries(LANGUAGE_OPTIONS).map(([code, label]) => (
          <TouchableOpacity
            key={code}
            style={[
              languageSheetStyles.languageContainer,
              currentLanguage === code && languageSheetStyles.selectedContainer,
            ]}
            onPress={() => onSelectLanguage(code)}
          >
            <View style={languageSheetStyles.textContainer}>
              <Text
                large
                semibold
                primary={currentLanguage !== code}
                background={currentLanguage === code}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetView>
  );
}

type LanguageSettingSheetProps = {
  show: boolean;
  onHide: () => void;
  onSelectLanguage: (language: string) => void;
  currentLanguage: string;
};

export const LanguageSettingSheet = forwardRef(
  (
    {
      show,
      onHide,
      onSelectLanguage,
      currentLanguage,
    }: LanguageSettingSheetProps,
    ref: ForwardedRef<BottomSheet>
  ) => {
    return (
      <PopupBottomSheet ref={ref} show={show} onHide={onHide}>
        <LanguageSelection
          onSelectLanguage={(language) => {
            onSelectLanguage(language);
            (ref as MutableRefObject<BottomSheet>).current?.close();
          }}
          currentLanguage={currentLanguage}
        />
      </PopupBottomSheet>
    );
  }
);
