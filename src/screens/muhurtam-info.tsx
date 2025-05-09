import { InfoPage, InfoParagraph, InfoSection, InfoSectionTitle } from "@/components/util/info-page";


export function MuhurtamInfoPage() {
  return <InfoPage title="Muhurtam">
    <InfoSection>
      <InfoParagraph>
        Muhurtam is a Hindu unit of time, roughly 48 minutes long. It also refers to auspicious/inauspicious periods.
      </InfoParagraph>
      <InfoParagraph>
      Auspicious periods bring prosperity while inauspicious ones bring misfortune.
      </InfoParagraph>
      <InfoParagraph>
      The timing of auspicious and inauspicious periods depends on the alignment of celestial bodies and sunrise and sunset times.
      </InfoParagraph>
      <InfoParagraph>
      It is important to align signifcant events, like Marriage and House Warming, with auspicious periods to ensure success.
      </InfoParagraph>
      <InfoSection>
      <InfoSectionTitle>Negative Muhurtams</InfoSectionTitle>
        <InfoParagraph>
            Rahu Kalam, Yama Gandam, Gulika Kalam and Varjyam are negative muhurtams. 
        </InfoParagraph>
        <InfoParagraph>
            Avoid starting new businesses/projects, significant purchases, journeys and auspicious activities during these periods. 
        </InfoParagraph>
      </InfoSection>
      <InfoSection>
      <InfoSectionTitle>Positive Muhurtams</InfoSectionTitle>
        <InfoParagraph>
            Abhijit Muhurtam is one of the most auspicious periods. 
        </InfoParagraph>
        <InfoParagraph>
            Use this time to start new businesses/projects, perform rituals/pujas, and make signifcant purchases and other important decisions. 
        </InfoParagraph>
      </InfoSection>
    </InfoSection>
  </InfoPage>;
}
