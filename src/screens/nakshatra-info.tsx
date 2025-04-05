import React from "react";
import { NakshatraOrbit } from "@/components/nakshatra/orbit";
import {
  InfoPage,
  InfoSection,
  InfoParagraph,
  InfoSectionTitle,
  InfoVisual,
} from "@/components/util/info-page";

export function NakshatraInfoPage() {
  return (
    <InfoPage title="Nakshatra">
      <InfoSection>
        <InfoParagraph>
          Nakshatra can refer to both a single star and a group of stars
          (asterism).
        </InfoParagraph>
        <InfoParagraph>
          In the Hindu Calendar, a Nakshatra is a segment of the Moon's
          ecliptic orbit.
        </InfoParagraph>
        <InfoParagraph>
          The Moon takes about 27 days to complete its orbit, so there are 27
          Nakshatras, with the Moon spending roughly one day in each.
        </InfoParagraph>
        <InfoParagraph>
          Meshadi, the starting point of the Nakshatras, is determined as the
          point opposite Chitra Nakshatra.
        </InfoParagraph>
      </InfoSection>

      <InfoVisual>
        <NakshatraOrbit />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>Naming & Relevance</InfoSectionTitle>
        <InfoParagraph>
          Each Nakshatra is named after a prominent star, known as the Yogatara,
          that lies within the segment.
        </InfoParagraph>
        <InfoParagraph>
          Nakshatras play a key role in the Hindu Calendar, rituals, and
          astrology. A person's Janma Nakshatra (birth Nakshatra) is determined
          by the Moon's position at birth, influencing rituals like naming,
          personality traits, and compatibility.
        </InfoParagraph>
        <InfoParagraph>
          Nakshatras also serve as a convenient coordinate system to locate the
          positions of planets in the sky. For example, one might say "Saturn is
          in Dhanishtha Nakshatra."
        </InfoParagraph>
      </InfoSection>
    </InfoPage>
  );
}
