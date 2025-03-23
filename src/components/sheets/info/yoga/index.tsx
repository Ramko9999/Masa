import { StyleUtils } from "@/theme/style-utils";
import { View } from "react-native";
import { tintColor } from "@/util/color";
import { Base, ImageBackground, InfoSlide } from "@/components/sheets/info/util";
import VedicWheel from "@/components/sheets/info/vedic-wheel";
import { YOGA_NAMES } from "@/api/panchanga/core/yoga";

const commonSlideProps = {
  backgroundColor: "#151515",
  textWrapColor: tintColor("#151515"),
};

export const SLIDES: InfoSlide[] = [
  {
    background: (
      <ImageBackground
        image={require("../../../../../assets/yoga/moon-sun-measurement.png")}
      />
    ),
    ...commonSlideProps,
    description: (
      <Base>
        Yoga is a combination of the Sun's and Moon's longitudes, divided into
        27 equal parts of 13°20' each. Each division is called a Yoga.
      </Base>
    ),
  },
  {
    background: <VedicWheel names={YOGA_NAMES} type="yoga" />,
    ...commonSlideProps,
    description: (
      <View style={{ ...StyleUtils.flexColumn(10) }}>
        <Base>
          Just like Nakshatras, there are 27 Yogas in total, each lasting for a fixed portion of time.
        </Base>
        <Base>
          Each Yoga is associated with certain qualities that influence a
          person's nature, health, and success in activities.
        </Base>
      </View>
    ),
  },
];
