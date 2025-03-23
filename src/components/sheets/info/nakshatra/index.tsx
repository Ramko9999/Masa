import { StyleUtils } from "@/theme/style-utils";
import { View } from "react-native";
import { tintColor } from "@/util/color";
import { Base, ImageBackground, InfoSlide } from "@/components/sheets/info/util";
import VedicWheel from "@/components/sheets/info/vedic-wheel";
import { NAKSHATRA_NAMES } from "@/api/panchanga/core/nakshatra";

const commonSlideProps = {
  backgroundColor: "#151515",
  textWrapColor: tintColor("#151515"),
};

export const SLIDES: InfoSlide[] = [
  {
    background: (
      <ImageBackground
        image={require("../../../../../assets/tithi/moon.jpg")}
      />
    ),
    ...commonSlideProps,
    description: (
      <Base>
        Nakshatra refers to the lunar mansions or asterisms in Vedic astrology. 
        There are 27 Nakshatras, each covering 13°20' of the zodiac, representing 
        the Moon's journey through the sky.
      </Base>
    ),
  },
  {
    background: <VedicWheel names={NAKSHATRA_NAMES} type="nakshatra" />,
    ...commonSlideProps,
    description: (
      <View style={{ ...StyleUtils.flexColumn(10) }}>
        <Base>
          The Moon travels through all 27 Nakshatras in approximately 27.3 days, 
          spending about one day in each Nakshatra.
        </Base>
        <Base>
          Each Nakshatra has unique qualities and influences that affect a person's 
          character, life events, and spiritual journey.
        </Base>
      </View>
    ),
  },
];
