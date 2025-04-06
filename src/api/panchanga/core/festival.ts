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
import { addDays, getDatesBetween, truncateToDay } from "@/util/date";
import { getSunLongitudeMoment, getSunrise, getSunset } from "../util";

enum RuleType {
  Lunar = "lunar",
  Dynamic = "dynamic",
}

type LunarRule = {
  type: RuleType.Lunar;
  tithiIndex: TithiIndex;
  masaIndex: MasaIndex;
};

type DynamicRule = {
  type: RuleType.Dynamic;
  evaluate: (year: number, location: Location) => number;
};

type FestivalRule = {
  name: FestivalName;
  alias?: string[];
  caption: string;
  description: string;
  celebration: string;
  image: string;
  rule: LunarRule | DynamicRule;
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
  VatSavitri = "Vat Savitri",
  GuruPurnima = "Guru Purnima",
  RathYatra = "Rath Yatra",
  NagaPanchamiShukla = "Naga Panchami (Shukla)",
  NagaPanchamiKrishna = "Naga Panchami (Krishna)",
  RakshaBandhan = "Raksha Bandhan",
  KrishnaJanmashtami = "Krishna Janmashtami",
  GaneshChaturthi = "Ganesh Chaturthi",

  // Autumn Festivals
  Navaratri = "Navaratri",
  DurgaPuja = "Durga Puja",
  Dussehra = "Dussehra",
  KojagaraPuja = "Kojagara Puja",
  KarvaChauth = "Karva Chauth",
  GovardhanaPuja = "Govardhana Puja",
  Diwali = "Diwali",
  ChhathPuja = "Chhath Puja",
}

function getMakarSankrantiDate(year: number, location: Location) {
  const sankranti = getSunLongitudeMoment(
    270,
    new Date(year, 0, 0).valueOf(),
    90
  );

  const dayOfSankranti = truncateToDay(sankranti);
  const sunset = getSunset(dayOfSankranti, location);
  if (sunset > sankranti) {
    return dayOfSankranti;
  }
  return addDays(dayOfSankranti, 1);
}

const FESTIVAL_RULES: FestivalRule[] = [
  {
    name: FestivalName.MakarSankranti,
    alias: ["Pongal"],
    caption: "Embracing the Sun's New Journey",
    description:
      "Makar Sankranti is a festival dedicated to Lord Surya, the Sun God. Signifying the end of winter and the onset of longer, warmer days. It is usually celebrated annually on January 14th (or January 15th in leap years), this day is considered highly auspicious for new beginnings and spiritual practices.",
    celebration:
      "Makar Sankranti is celebrated in different ways across India. Many people wake up early to take a holy dip in rivers, which is believed to cleanse the soul. Prayers are offered to the Sun, thanking it for its light and energy. Families prepare sweets made from sesame seeds and jaggery, which are shared with loved ones to promote harmony and warmth. In places like Gujarat, people fly colorful kites to celebrate the arrival of brighter days. In some regions, people also gather around bonfires, sing songs, and enjoy time together in the spirit of the season.",
    image: "makar-sankranti.png",
    rule: {
      type: RuleType.Dynamic,
      evaluate: getMakarSankrantiDate,
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
    name: FestivalName.VatSavitri,
    caption: "A Devotion of Wifely Duty",
    description:
      "Observed by married women for the longevity and well-being of their husbands, commemorating the devotion of Savitri who rescued her husband Satyavan from Yama, the god of death.",
    celebration:
      "Fasting for 24 hours, tying sacred threads around banyan (vat) trees, performing rituals while circling the tree, and offering prayers for husband's health and long life.",
    image: "vat-savitri.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Jyeshtha,
    },
  },
  {
    name: FestivalName.RathYatra,
    caption: "The Chariot Festival of Lord Jagannath",
    description:
      "Celebrates the annual journey of Lord Jagannath, Lord Balabhadra, and Goddess Subhadra from their temple to Gundicha Temple, symbolizing Krishna's return to Vrindavan.",
    celebration:
      "Pulling elaborately decorated chariots through the streets, singing devotional songs, offering prayers, and participating in the grand procession.",
    image: "rath-yatra.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDwitiya,
      masaIndex: MasaIndex.Ashadha,
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
    name: FestivalName.Navaratri,
    caption: "Nine Nights of Divine Feminine",
    description:
      "A nine-night celebration honoring the divine feminine energy (Shakti) in her various forms of Durga, Lakshmi, and Saraswati, representing the triumph of good over evil.",
    celebration:
      "Setting up golu (display of dolls), performing special pujas, fasting, dancing garba and dandiya raas, and worshipping young girls as embodiments of the goddess.",
    image: "navaratri.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Ashwin,
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
    name: FestivalName.KojagaraPuja,
    caption: "The Festival of Goddess Lakshmi",
    description:
      "Also known as Sharad Purnima or Kojagiri Purnima, it celebrates Goddess Lakshmi, believed to roam the earth on this night asking 'Ko Jagarti?' (Who is awake?), blessing those awake with prosperity.",
    celebration:
      "Staying awake all night, preparing rice kheer to offer under moonlight, decorating homes with lights, and performing special pujas to Goddess Lakshmi.",
    image: "kojagara-puja.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
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
    name: FestivalName.GovardhanaPuja,
    caption: "Honoring the Sacred Mountain",
    description:
      "Celebrates Lord Krishna's lifting of Govardhana Hill to protect villagers from Indra's wrath, symbolizing the importance of environmental protection and the triumph of devotion over pride.",
    celebration:
      "Creating miniature Govardhana hills from cow dung, offering Annakut (mountain of food) to Lord Krishna, performing circumambulation of the hill or its representation, and feeding cows.",
    image: "govardhana-puja.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
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
  {
    name: FestivalName.ChhathPuja,
    caption: "A Celebration of the Sun God",
    description:
      "A four-day festival dedicated to Surya (the Sun God) and Chhathi Maiya (Goddess Shashti), seeking blessings for prosperity, well-being, and longevity of family members.",
    celebration:
      "Devotees observe rigorous fasting, offer prayers at riverbanks or water bodies during sunset and sunrise, and prepare special prasad like thekua and kheer.",
    image: "chhath-puja.png",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaShashti,
      masaIndex: MasaIndex.Kartika,
    },
  },
];

export type Festival = Omit<FestivalRule, "rule"> & {
  date: number;
};

function getLunarFestivals(anchorDay: number, location: Location) {
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
          festivals.push({ ...festival, date });
          break;
        }
      }
      return festivals;
    });
  });
  return lunarFestivals;
}

function getDynamicFestivals(anchorDay: number, location: Location) {
  const year = new Date(anchorDay).getFullYear();
  const festivals: Festival[] = [];

  for (const festival of FESTIVAL_RULES) {
    if (festival.rule.type === RuleType.Dynamic) {
      const dynamicRule = festival.rule as DynamicRule;
      const date = dynamicRule.evaluate(year, location);
      festivals.push({ ...festival, date });
    }
  }

  return festivals;
}

// Cache for storing festival results
type CacheKey = string;
type CacheEntry = {
  festivals: Festival[];
};

// In-memory cache
const festivalsCache = new Map<CacheKey, CacheEntry>();

// Generate a cache key from anchorDay and location
function generateCacheKey(anchorDay: number, location: Location): CacheKey {
  // Use day-level precision for the anchorDay (ignore time)
  const day = truncateToDay(anchorDay);
  // Create a unique key based on day and location coordinates
  return `${day}:${location.latitude.toFixed(4)}:${location.longitude.toFixed(
    4
  )}`;
}

export function getUpcomingFestivals(anchorDay: number, location: Location) {
  // Generate cache key
  const cacheKey = generateCacheKey(anchorDay, location);

  // Check if we have a cached result
  const cachedResult = festivalsCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult.festivals;
  }

  // If not cached, calculate festivals
  const lunarFestivals = getLunarFestivals(anchorDay, location);
  const dynamicFestivals = getDynamicFestivals(anchorDay, location);
  const festivals = [...lunarFestivals, ...dynamicFestivals].sort(
    (a, b) => a.date - b.date
  );

  // Cache the result
  festivalsCache.set(cacheKey, {
    festivals,
  });

  return festivals;
}
