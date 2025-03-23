import { tintColor } from "../../../../util/color";
import { Base, ImageBackground, InfoSlide } from "../util";

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
    description: <Base>Nakshatra....</Base>,
  },
];
