import React from "react";
import { TithiOrbit } from "@/components/tithi/orbit";
import { MoonSlider } from "@/components/tithi/moon-phases";
import { 
  InfoPage, 
  InfoSection, 
  InfoParagraph, 
  InfoSectionTitle, 
  InfoSpacer,
  InfoNote,
  InfoLabel,
  InfoVisual
} from "@/components/util/info-page";

export function TithiInfoPage() {
  return (
    <InfoPage title="Tithi">
      <InfoSection>
        <InfoParagraph>
          A Tithi is the time the Moon takes to move 12 degrees relative to
          the Sun.
        </InfoParagraph>
        <InfoParagraph>
          Each lunar month (Masa) has 30 Tithis.
        </InfoParagraph>
        <InfoParagraph>
          Shukla Paksha (Waxing phase) refers to the period from New Moon to
          Full Moon (15 Tithis).
        </InfoParagraph>
        <InfoParagraph>
          Krishna Paksha (Waning phase) is the period from Full Moon to New
          Moon (15 Tithis).
        </InfoParagraph>
        <InfoParagraph>
          Tithi along with Masa are fundamental to determine festival dates.
        </InfoParagraph>
      </InfoSection>

      <InfoVisual>
        <InfoNote>
          Look at how the Tithi changes based on the Sun-Moon angle
        </InfoNote>
        <InfoSpacer />
        <TithiOrbit />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>
          Naming of Tithis
        </InfoSectionTitle>
        <InfoParagraph>
          Amavasya is the moment of new moon.
        </InfoParagraph>
        <InfoParagraph>
          Purnima is the moment of full moon.
        </InfoParagraph>
        <InfoParagraph>
          All other Tithis are named using Sanskrit numbers: Pratipada (1st),
          Dwitiya (2nd), Tritiya (3rd), Chaturthi (4th), and so on.
        </InfoParagraph>
      </InfoSection>

      <InfoVisual>
        <InfoLabel>🌓 Moon Phases</InfoLabel>
        <MoonSlider />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>
          Tithi Nuances
        </InfoSectionTitle>
        <InfoParagraph>
          Tithis can start and end at any time, lasting between 18 to 24 hours
          due to the elliptical nature of the moon's orbit.
        </InfoParagraph>
        <InfoParagraph>
          This makes it difficult to predict Tithi for a day without
          evaluating the moon's position at sunrise relative to the sun.
        </InfoParagraph>
        <InfoParagraph>
          Due to historical conventions, the Tithi at sunrise is considered
          the Tithi for the day.
        </InfoParagraph>
      </InfoSection>
    </InfoPage>
  );
}
