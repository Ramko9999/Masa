import { useNavigation } from "@react-navigation/native";
import { StyleUtils } from "@/theme/style-utils";
import {
  ColorSchemeName,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { View, Text } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { ChevronLeft } from "lucide-react-native";
import { getFontSize } from "@/theme";

const infoHeaderStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    paddingHorizontal: "1%",
    marginTop: "2%",
    ...StyleUtils.flexRow(),
    alignItems: "center",
  },
  backButton: {
    ...StyleUtils.flexRow(),
    alignItems: "center",
    opacity: 0.9,
  },
  backText: {
    opacity: 0.9,
  },
});

export function InfoHeader() {
  const navigation = useNavigation();
  const infoHeaderStyles = useThemedStyles(infoHeaderStylesFactory);
  const theme = useColorScheme();
  return (
    <View style={infoHeaderStyles.container}>
      <TouchableOpacity
        style={infoHeaderStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft
          size={getFontSize({ neutral: true })}
          color={useGetColor(AppColor.primary, theme)}
        />
        <Text neutral style={infoHeaderStyles.backText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
