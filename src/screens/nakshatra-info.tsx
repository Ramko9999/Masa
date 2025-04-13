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
      </InfoSection>

      <InfoVisual>
        <NakshatraOrbit />
      </InfoVisual>

      <InfoSection>
        <InfoSectionTitle>Naming & Relevance</InfoSectionTitle>
        <InfoParagraph>
          Each Nakshatra is named after the prominent star that lies within its segment.
        </InfoParagraph>
        <InfoParagraph>
          A person's birth Nakshatra influences rituals like naming,
          personality traits, and compatibility with other people.
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
