import { forwardRef, ForwardedRef, MutableRefObject, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { PopupBottomSheet } from "@/components/util/sheet";
import { View, Text } from "@/theme";
import {
  StyleSheet,
  ColorSchemeName,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useThemedStyles, useGetColor, AppColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { shadeColor, tintColor } from "@/util/color";
import { useTranslation } from "react-i18next";
import { UserApi } from "@/api/user";
import Animated, { LinearTransition } from "react-native-reanimated";

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
    paddingTop: "2%",
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
  loadingIndicator: {
    marginBottom: "5%",
  },
});

type LanguageSelectionProps = {
  onSelectLanguageFinished: () => void;
};

function LanguageSelection({
  onSelectLanguageFinished,
}: LanguageSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const languageSheetStyles = useThemedStyles(languageSheetStylesFactory);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const theme = useColorScheme();

  const onSelectLanguage = async (language: string) => {
    setIsLoading(true);
    await i18n.changeLanguage(language);
    await UserApi.setLanguage(language);
    onSelectLanguageFinished();
    setIsLoading(false);
  };

  return (
    <BottomSheetView
      style={[languageSheetStyles.container, { paddingBottom: insets.bottom + 10}]}
    >
      <View style={languageSheetStyles.title}>
        <Text larger semibold tint>
          {t("settings.settings_items.language.title")}
        </Text>
      </View>
      <Animated.View
        key={"language-scroll-content"}
        style={languageSheetStyles.languageScrollContent}
        layout={LinearTransition.duration(300)}
      >
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
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={useGetColor(AppColor.primary, theme)}
            style={languageSheetStyles.loadingIndicator}
          />
        )}
      </Animated.View>
    </BottomSheetView>
  );
}

type LanguageSettingSheetProps = {
  show: boolean;
  onHide: () => void;
};

export const LanguageSettingSheet = forwardRef(
  (
    { show, onHide }: LanguageSettingSheetProps,
    ref: ForwardedRef<BottomSheet>
  ) => {
    return (
      <PopupBottomSheet ref={ref} show={show} onHide={onHide}>
        <LanguageSelection
          onSelectLanguageFinished={() =>
            (ref as MutableRefObject<BottomSheet>).current?.close()
          }
        />
      </PopupBottomSheet>
    );
  }
);
