import { Text, View } from "../../theme";
import {
  StyleSheet,
  useWindowDimensions,
  Image,
  ViewStyle,
} from "react-native";
import { StyleUtils } from "../../theme/style-utils";
import { BottomSheet } from "../util/sheet";
import { SLIDES as TITHI_SLIDES } from "./info/tithi";
import { SlideShow } from "./info";

const miniSheetDraggerStyles = StyleSheet.create({
  container: {
    width: 90,
    height: 4,
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    top: 5,
    left: "50%",
    transform: [{ translateX: -45 }],
  },
});

function MiniSheetDragger() {
  return <View style={miniSheetDraggerStyles.container} />;
}

const miniSheetStyles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flex: 1,
    overflow: "hidden",
  },
});

type MiniSheetProps = {
  show: boolean;
  onHide: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

function MiniSheet({ show, onHide, children, contentStyle }: MiniSheetProps) {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet
      show={show}
      onHide={onHide}
      contentHeight={height * 0.5}
      contentStyle={{ ...miniSheetStyles.container, ...contentStyle }}
    >
      {children}
      <MiniSheetDragger />
    </BottomSheet>
  );
}

const infoSheetStyles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleUtils.flexColumn(5),
    justifyContent: "flex-start",
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  explanation: {
    marginHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 20,
    backgroundColor: "white",
  },
});

type InfoSheetProps = {
  show: boolean;
  onHide: () => void;
};

export function TithiInfoSheet({ show, onHide }: InfoSheetProps) {
  const { width, height } = useWindowDimensions();

  return (
    <MiniSheet
      show={show}
      onHide={onHide}
      contentStyle={{
        ...infoSheetStyles.container,
        backgroundColor: "white",
      }}
    >
      <View style={infoSheetStyles.container}>
        <SlideShow slides={TITHI_SLIDES} />
      </View>
    </MiniSheet>
  );
}
