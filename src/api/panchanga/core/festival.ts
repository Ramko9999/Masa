import {
  TithiInterval,
  TithiIndex,
  searchForTithi,
} from "@/api/panchanga/core/tithi";
import {
  Masa,
  MasaIndex,
  getPurnimantaMasaCalendarForYear,
} from "@/api/panchanga/core/masa";
import { Location } from "@/api/location";
import { getDatesBetween } from "@/util/date";
import { getSunrise } from "../util";

enum RuleType {
  Lunar = "lunar",
  Solar = "solar",
}

type LunarRule = {
  type: RuleType.Lunar;
  tithiIndex: TithiIndex;
  masaIndex: MasaIndex;
};

type SolarRule = {
  type: RuleType.Solar;
  month: number;
  day: number;
  masaIndex: MasaIndex;
};

type FestivalRule = {
  name: FestivalName;
  caption: string;
  description: string;
  celebration: string;
  image: string;
  rule: LunarRule | SolarRule;
};

export enum FestivalName {
  // Pongal/Sankranti Festivals
  Bhogi = "Bhogi",
  MakarSankranti = "Makar Sankranti",

  // Spring Festivals
  VasantPanchami = "Vasant Panchami",
  MahaShivaratri = "Maha Shivaratri",
  Holi = "Holi",

  // New Year and Spring Festivals
  Ugadi = "Ugadi",
  RamaNavami = "Rama Navami",
  HanumanJayanti = "Hanuman Jayanti",
  AkshayaTritiya = "Akshaya Tritiya",

  // Summer Festivals
  GuruPurnima = "Guru Purnima",
  NagaPanchamiShukla = "Naga Panchami (Shukla)",
  NagaPanchamiKrishna = "Naga Panchami (Krishna)",
  RakshaBandhan = "Raksha Bandhan",
  KrishnaJanmashtami = "Krishna Janmashtami",
  GaneshChaturthi = "Ganesh Chaturthi",

  // Autumn Festivals
  NavaratriStart = "Navaratri Start",
  DurgaPuja = "Durga Puja",
  Dussehra = "Dussehra",
  KarvaChauth = "Karva Chauth",
  Diwali = "Diwali",
}

const FESTIVAL_RULES: FestivalRule[] = [
  {
    name: FestivalName.MakarSankranti,
    caption: "Embracing the Sun's New Journey",
    description:
      "This festival marks the sun's transition into Capricorn, symbolizing longer days and the harvest season, a day to seek blessings for abundance and prosperity.",
    celebration:
      "Taking holy baths, flying kites, eating sesame and jaggery sweets, and performing charity.",
    image: "makar-sankranti.png",
    rule: {
      type: RuleType.Solar,
      day: 13,
      month: 0,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.VasantPanchami,
    caption: "A Celebration of Knowledge and Wisdom",
    description:
      "Honors goddess Saraswati, embodying knowledge and wisdom, a day to seek blessings for intellectual growth and start new educational endeavors.",
    celebration:
      "Worshipping Saraswati, offering prayers and flowers, wearing yellow attire, and participating in cultural events promoting learning and arts.",
    image: "vasant-panchami.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Magha,
    },
  },
  {
    name: FestivalName.MahaShivaratri,
    caption: "A Night of Spiritual Awakening",
    description:
      "Honors Lord Shiva, a night of fasting and staying awake for spiritual practices, seeking his blessings for enlightenment.",
    celebration:
      "Fasting, performing special pujas, reciting mantras, and holding all-night vigils in temples or at home.",
    image: "maha-shivaratri.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Holi,
    caption: "A Celebration of Colors and Love",
    description:
      "Celebrates the love between Lord Krishna and Radha, and the victory of good over evil, a time for colors, music, dance, and community joy.",
    celebration:
      "Playing with colors, throwing water balloons, eating special foods like gujiya, and joining cultural events and processions.",
    image: "holi.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Ugadi,
    caption: "Welcoming the New Year",
    description:
      "Marks the Hindu New Year, a time for new beginnings and auspicious activities, celebrating the start of the Chaitra month.",
    celebration:
      "Raising a gudi (flag), performing special pujas, preparing traditional foods like pachadi, and participating in cultural events.",
    image: "ugadi.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.RamaNavami,
    caption: "Celebrating the Birth of Lord Rama",
    description:
      "Celebrates Lord Rama's birth, the seventh avatar of Vishnu, a day to seek blessings for righteousness and reflect on his teachings.",
    celebration:
      "Fasting, performing special pujas, reading the Ramayana, and joining cultural events and processions.",
    image: "rama-navami.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaNavami,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.HanumanJayanti,
    caption: "Honoring the Mighty Devotee",
    description:
      "Celebrates Lord Hanuman's birth, known for strength and loyalty, a day to seek his blessings for protection and success.",
    celebration:
      "Fasting, performing special pujas, reading the Hanuman Chalisa, and participating in cultural events and processions.",
    image: "hanuman-jayanti.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.AkshayaTritiya,
    caption: "A Day of Abundance and New Beginnings",
    description:
      "Marks a highly auspicious day for starting new ventures, considered ideal for investments and seeking prosperity blessings.",
    celebration:
      "Purchasing gold or valuables, performing special pujas, and joining cultural events and fairs.",
    image: "akshaya-tritiya.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaTritiya,
      masaIndex: MasaIndex.Vaisakha,
    },
  },
  {
    name: FestivalName.GuruPurnima,
    caption: "Honoring the Spiritual Teacher",
    description:
      "Honors the Guru, guiding disciples towards enlightenment, a day to express gratitude and seek blessings for spiritual growth.",
    celebration:
      "Performing special pujas for the Guru, offering gifts and sweets, and participating in cultural events and discussions.",
    image: "guru-purnima.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Ashadha,
    },
  },
  {
    name: FestivalName.NagaPanchamiShukla,
    caption: "Seeking Blessings from Serpent Deities",
    description:
      "Honors snake gods for protection and prosperity, a day to offer prayers and rituals to ward off evil and ensure well-being.",
    celebration:
      "Fasting, performing special pujas, offering milk to snake idols, and joining cultural events and processions.",
    image: "naga-panchami.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.NagaPanchamiKrishna,
    caption: "Seeking Blessings from Serpent Deities",
    description:
      "Honors snake gods for protection and prosperity, a day to offer prayers and rituals to ward off evil and ensure well-being.",
    celebration:
      "Fasting, performing special pujas, offering milk to snake idols, and joining cultural events and processions.",
    image: "naga-panchami.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaPanchami,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.RakshaBandhan,
    caption: "A Bond of Love and Protection",
    description:
      "Sisters tie a rakhi on brothers' wrists, symbolizing love and prayers for well-being, with brothers promising protection in return.",
    celebration:
      "Sisters tie rakhis, brothers give gifts, families celebrate with feasts, and join cultural activities.",
    image: "raksha-bandhan.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.KrishnaJanmashtami,
    caption: "Celebrating the Birth of Lord Krishna",
    description:
      "Celebrates Lord Krishna's birth, known for divine playfulness and teachings, a day to seek blessings for love, wisdom, and protection.",
    celebration:
      "Fasting until midnight, performing special pujas, joining cultural events like Rasa Leela, and enjoying festive foods.",
    image: "krishna-janmashtami.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaAshtami,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.GaneshChaturthi,
    caption: "Welcoming Lord Ganesha",
    description:
      "Honors Lord Ganesha, the remover of obstacles, a time to seek blessings for success and prosperity in all endeavors.",
    celebration:
      "Installing Ganesha idols, performing special pujas, offering modaks, and joining cultural events and processions.",
    image: "ganesh-chaturthi.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturthi,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.DurgaPuja,
    caption: "Honoring the Warrior Goddess",
    description:
      "Specifically honors Durga's victory over Mahishasura, a time to seek her blessings for strength and protection, especially in eastern India.",
    celebration:
      "Installing Durga idols, performing elaborate pujas, joining cultural events and processions, and enjoying festive foods.",
    image: "durga-puja.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaShashti,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.Dussehra,
    caption: "Triumph of Good Over Evil",
    description:
      "Marks Lord Rama's victory over Ravana, symbolizing good over evil, a day to celebrate righteousness through cultural festivities.",
    celebration:
      "Burning Ravana effigies, performing Ramlila, offering special pujas, and exchanging gifts and sweets.",
    image: "dussehra.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDashami,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.KarvaChauth,
    caption: "A Vow of Love and Devotion",
    description:
      "Married women fast from sunrise to moonrise for husbands' well-being, expressing love and commitment through traditional rituals.",
    celebration:
      "Dressing traditionally, observing a strict fast, performing pujas, and breaking the fast by viewing the moon through a sieve.",
    image: "karva-chauth.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturthi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.Diwali,
    caption: "The Festival of Lights and Joy",
    description:
      "Celebrates light over darkness and good over evil, a time for lighting lamps, exchanging gifts, and enjoying festive meals with family.",
    celebration:
      "Lighting diyas and candles, decorating with rangoli, performing Lakshmi pujas, exchanging gifts and sweets, and bursting fireworks.",
    image: "diwali.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Kartika,
    },
  },
];

export type Festival = Omit<FestivalRule, "rule"> & {
  date: Date;
};

function isFestival(
  date: Date,
  rule: LunarRule | SolarRule,
  tithi: TithiInterval[],
  masa: Masa
) {
  if (rule.type === RuleType.Lunar) {
    return (
      tithi.some((t) => t.index === rule.tithiIndex) &&
      masa.purnimanta.index === rule.masaIndex
    );
  } else if (rule.type === RuleType.Solar) {
    const month = date.getMonth();
    const day = date.getDate();
    return (
      rule.day === day &&
      rule.month === month &&
      rule.masaIndex === masa.purnimanta.index
    );
  }

  return false;
}

export function compute(day: number, tithi: TithiInterval[], masa: Masa) {
  const date = new Date(day);
  const festivals: Festival[] = [];

  for (const festival of FESTIVAL_RULES) {
    if (isFestival(date, festival.rule, tithi, masa)) {
      const { rule, ...festivalWithoutRule } = festival;
      festivals.push({ ...festivalWithoutRule, date });
    }
  }

  return festivals;
}

// todo: add makar sankranti
export function getLunarFestivals(anchorDay: number, location: Location) {
  const start = Date.now();
  const year = new Date(anchorDay).getFullYear();
  const purnimantaMasaCalendar = getPurnimantaMasaCalendarForYear(
    year,
    location
  );

  const lunarRuledFestivals = FESTIVAL_RULES.filter(
    (f) => f.rule.type === RuleType.Lunar
  );

  const lunarFestivals = lunarRuledFestivals.flatMap((festival) => {
    const lunarRule = festival.rule as LunarRule;
    const relevantMasas = purnimantaMasaCalendar.filter(
      ({ index }) => index === lunarRule.masaIndex
    );
    return relevantMasas.flatMap((masa) => {
      const festivals: Festival[] = [];
      const tithi = searchForTithi(masa.startDate, lunarRule.tithiIndex);
      const tithiDates = getDatesBetween(tithi.startDate, tithi.endDate);
      for (const date of tithiDates) {
        const sunrise = getSunrise(date, location);
        // assign the festival whose first day's sunrise is after the tithi's start date
        if (tithi.startDate <= sunrise) {
          festivals.push({ ...festival, date: new Date(date) });
          break
        }
      }
      return festivals;
    });
  });

  console.log(
    `[UPCOMING FESTIVALS] Time taken: ${(Date.now() - start) / 1000}s`
  );
  return lunarFestivals;
}
