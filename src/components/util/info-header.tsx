import { useNavigation } from "@react-navigation/native";
import { StyleUtils } from "@/theme/style-utils";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
import { ChevronLeft } from "lucide-react-native";
import { getFontSize } from "@/theme";

const infoHeaderStyles = StyleSheet.create({
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

  return (
    <View style={infoHeaderStyles.container}>
      <TouchableOpacity
        style={infoHeaderStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft
          size={getFontSize({ neutral: true })}
          color={useGetColor(AppColor.primary)}
        />
        <Text neutral style={infoHeaderStyles.backText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}