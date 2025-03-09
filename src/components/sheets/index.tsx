import { Text } from "../../theme";
import { StyleSheet, useWindowDimensions } from "react-native";
import { StyleUtils } from "../../theme/style-utils";
import { BottomSheet } from "../util/sheet";

const miniSheetStyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    backgroundColor: "white",
  },
});

type MiniSheetProps = {
  show: boolean;
  onHide: () => void;
  children: React.ReactNode;
};

function MiniSheet({ show, onHide, children }: MiniSheetProps) {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet
      show={show}
      onHide={onHide}
      contentHeight={height * 0.4}
      contentStyle={miniSheetStyles.container}
    >
      {children}
    </BottomSheet>
  );
}

type InfoSheetProps = {
  show: boolean;
  onHide: () => void;
};

export function TithiInfoSheet({ show, onHide }: InfoSheetProps) {
  return (
    <MiniSheet show={show} onHide={onHide}>
      <Text>Tithi Info</Text>
    </MiniSheet>
  );
}
