import { View } from "@/theme";
import { useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import { ColorSchemeName, StyleSheet } from "react-native";

const paginationDotStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  on: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  off: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
});

type PaginationDotProps = {
  isOn: boolean;
};

function PaginationDot({ isOn }: PaginationDotProps) {
  const paginationDotStyles = useThemedStyles(paginationDotStylesFactory);
  return (
    <View
      style={[
        isOn ? paginationDotStyles.on : paginationDotStyles.off,
        { backgroundColor: "white" },
      ]}
    />
  );
}

const paginationStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexRowCenterAll(5),
  },
});

type PaginationProps = {
  totalItemsCount: number;
  currentIndex: number;
};

export function Pagination({ totalItemsCount, currentIndex }: PaginationProps) {
  const paginationStyles = useThemedStyles(paginationStylesFactory);
  return (
    <View style={paginationStyles.container}>
      {Array.from({ length: totalItemsCount }).map((_, index) => (
        <PaginationDot key={index} isOn={index === currentIndex} />
      ))}
    </View>
  );
}
