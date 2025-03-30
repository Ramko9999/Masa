import { View } from "@/theme";
import { StyleSheet } from "react-native";
import { StyleUtils } from "@/theme/style-utils";
import { SLIDES as TITHI_SLIDES } from "@/components/sheets/info/tithi";
import { SLIDES as YOGA_SLIDES } from "@/components/sheets/info/yoga";
import { SLIDES as NAKSHATRA_SLIDES } from "@/components/sheets/info/nakshatra";
import { SlideShow } from "@/components/sheets/info";
import { MiniSheet } from "@/components/util/sheet/mini";
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

function InfoSheetWrapper({
  show,
  onHide,
  children,
}: InfoSheetProps & { children: React.ReactNode }) {
  return (
    <MiniSheet
      show={show}
      onHide={onHide}
      contentStyle={{
        ...infoSheetStyles.container,
        backgroundColor: "white",
      }}
    >
      <View style={infoSheetStyles.container}>{children}</View>
    </MiniSheet>
  );
}

export function TithiInfoSheet({ show, onHide }: InfoSheetProps) {
  return (
    <InfoSheetWrapper show={show} onHide={onHide}>
      <SlideShow slides={TITHI_SLIDES} />
    </InfoSheetWrapper>
  );
}

export function YogaInfoSheet({ show, onHide }: InfoSheetProps) {
  return (
    <InfoSheetWrapper show={show} onHide={onHide}>
      <SlideShow slides={YOGA_SLIDES} />
    </InfoSheetWrapper>
  );
}

export function NakshatraInfoSheet({ show, onHide }: InfoSheetProps) {
  return (
    <InfoSheetWrapper show={show} onHide={onHide}>
      <SlideShow slides={NAKSHATRA_SLIDES} />
    </InfoSheetWrapper>
  );
}
