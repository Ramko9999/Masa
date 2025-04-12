import { TithiIndex, searchForTithi } from "@/api/panchanga/core/tithi";
import {
  MasaIndex,
  getPurnimantaMasaCalendarForYear,
} from "@/api/panchanga/core/masa";
import { Location } from "@/api/location";
import { addDays, getDatesBetween, truncateToDay } from "@/util/date";
import { getSunLongitudeMoment, getSunrise, getSunset } from "../util";

export enum RuleType {
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
  deities?: string[];
  caption: string;
  description: string;
  celebration: string;
  rule: LunarRule | DynamicRule;
};

export enum FestivalName {
  // Pongal/Sankranti Festivals
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
  NagaPanchami = "Naga Panchami",
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
    deities: ["Surya"],
    caption:
      "A sacred turning point honoring Surya and the light that guides new beginnings",
    description:
      "Makar Sankranti signifies the end of winter and the onset of longer, warmer days. It is usually occurs on January 14th (or January 15th in leap years). It is a highly auspicious day for new beginnings and spiritual practices.",
    celebration:
      "People wake up early to take dips in rivers to cleanse their souls. Prayers are offered to the Sun, thanking it for its light and energy. Families prepare sesame seed and jaggery sweets to share with loved ones to promote harmony and warmth. People fly colorful kites, gather around bonfires, and enjoy company to celebrate the arrival of brighter days.",
    rule: {
      type: RuleType.Dynamic,
      evaluate: getMakarSankrantiDate,
    },
  },
  {
    name: FestivalName.VasantPanchami,
    alias: ["Saraswati Jayanti"],
    deities: ["Saraswati"],
    caption:
      "Honor Goddess Saraswati, embracing wisdom and new educational endeavors",
    description:
      "Vasant Panchami is dedicated to Goddess Saraswati, the Hindu deity of knowledge, music, arts, wisdom, and learning. It is believed to be her birth anniversary.",
    celebration:
      "People perform Saraswati Puja at homes, schools, and colleges, wearing white and yellow attire and offering mustard and marigold flowers to Goddess Saraswati. Parents initiate their young children into learning. Flying kites is a popular activity during this day as well.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Magha,
    },
  },
  {
    name: FestivalName.MahaShivaratri,
    deities: ["Shiva", "Parvati"],
    caption: "A Night of Spiritual Awakening",
    description:
      "Maha Shivaratri celebrates the divine marriage of Lord Shiva and Goddess Parvati. It is believed that Lord Shiva's cosmic dance, or Tandava, took place on this day, representing creation, preservation, and destruction in the universe.",
    celebration:
      "Devotees fast, meditate, and offer prayers throughout the night, focusing on the worship of Lord Shiva, especially the Shiva Lingam. Mantras and rituals like Abhishekam (bathing the Shiva Lingam with water, milk and honey) are performed for spiritual growth and purification.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Holi,
    deities: ["Vishnu"],
    caption: "A Celebration of Colors and Love",
    description:
      'Holi is a joyous and vibrant Hindu festival that celebrates the victory of good over evil. It originates from the legend of Prahlada, a devotee of Lord Vishnu, who was saved from the fire while the demoness Holika was burned. This symbolizes the triumph of devotion and righteousness. Holi also welcomes the arrival of spring and is known as the "Festival of Colors."',
    celebration:
      "Celebrations begin with Holika Dahan, a sacred bonfire on the night before Holi that symbolizes the burning of negativity. The next day is marked by joyous gatherings where people apply colored powders with water, dance, and celebrate with music and sweets, spreading unity and love.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Ugadi,
    caption: "Welcoming the New Year",
    alias: ["Gudi Padwa"],
    description:
      "Ugadi marks the beginning of the New Year, celebrated on the first day of Chaitra masa. The term 'Ugadi' signifies the beginning of a new age, symbolizing renewal and the ushering in of prosperity and hope.",
    celebration:
      "The day begins with a ritual oil bath, followed by prayers and temple visits. Homes are cleaned and adorned with fresh mango leaves and vibrant rangoli designs. Families hoist flags in their home and prepare and share 'Ugadi Pachadi,' a special dish combining six distinct flavors—sweet, sour, salty, bitter, astringent, and spicy—representing the varied experiences of life in the coming year.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.RamaNavami,
    deities: ["Rama"],
    caption: "Celebrating the Birth of Lord Rama",
    description:
      "Rama Navami is the birth anniversary of Lord Rama. Lord Rama, the seventh incarnation of Lord Vishnu, is revered for his virtues and righteousness. The festival commemorates his birth in Ayodhya to King Dasharatha and Queen Kausalya",
    celebration:
      "Devotees observe a day-long fast, engage in prayers, and recite verses from the Ramayana. In many regions, the day includes processions and the ceremonial marriage of Lord Rama and Goddess Sita. Temples are decorated, and special rituals are performed to honor Lord Rama and Goddess Sita.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaNavami,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.HanumanJayanti,
    deities: ["Hanuman"],
    caption: "Honoring the Mighty Devotee",
    description:
      "Hanuman Jayanti commemorates the birth of Lord Hanuman, the devoted disciple of Lord Rama, symbolizing unwavering devotion, strength, and selfless service",
    celebration:
      "Devotees observe the day with day-long fasts, recitations of the Hanuman Chalisa, and readings from the Ramayana. Visiting Hanuman temples, offering sindoor (vermilion), and participating in spiritual discourses are common practices.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.AkshayaTritiya,
    deities: ["Vishnu", "Lakshmi"],
    caption: "A Day of Abundance and New Beginnings",
    description:
      'The word Akshaya means "that which never diminishes," symbolizing eternal prosperity, virtue, and success. It is believed that this day marks the beginning of the Treta Yuga, the second of the four Yugas in Hindu cosmology. The day is celebrated for its spiritual potency, as any good deeds performed are believed to yield unending and timeless merit.',
    celebration:
      "Akshaya Tritiya is observed with devotion by worshipping Lord Vishnu, seeking blessings for unending prosperity and spiritual growth. Acts of charity—such as donating food, clothing, and essentials—are encouraged, believed to bring lasting merit. Many begin new ventures, spiritual practices, or investments on this day, as it is considered highly auspicious. It is also a sacred day for marriages, with the belief that unions solemnized on Akshaya Tritiya are blessed with harmony, abundance, and enduring fortune",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaTritiya,
      masaIndex: MasaIndex.Vaisakha,
    },
  },
  {
    name: FestivalName.VatSavitri,
    caption:
      "A celebration of unwavering marital devotion and the triumph of love over death",
    description:
      "Observed by married women for the longevity and well-being of their husbands, commemorating the devotion of Savitri who rescued her husband Satyavan from Yama, the god of death. The festival signifies the deep love, devotion, and strength within the marital bond.",
    celebration:
      "Married women often observe a fast. They gather near a Banyan tree which is considered sacred and symbolic of long life and stability. They offer prayers, tie threads around the tree, and walk around it as a symbol of their devotion and prayers for their husbands' health and longevity. Some women also listen to or narrate the story of Savitri and Satyavan.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Jyeshtha,
    },
  },
  {
    name: FestivalName.RathYatra,
    deities: ["Krishna"],
    caption: "The Chariot Festival of Lord Jagannath",
    description:
      "Celebrates the annual journey of Lord Jagannath (Krishna), Lord Balabhadra, and Goddess Subhadra from their temple to Gundicha Temple, symbolizing Krishna's return to Vrindavan.",
    celebration:
      "Pulling elaborately decorated chariots through the streets, singing devotional songs, offering prayers, and participating in the grand procession.",
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
      "Honors the Guru, who guides disciples in their spiritual journey. It is a day to express gratitude and seek blessings for spiritual growth.",
    celebration:
      "Perform special pujas for the Guru, offering gifts and sweets. Reflect on the teachings of your Guru and seek their blessings for future spiritual growth, and connect with fellow disciples.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Ashadha,
    },
  },
  {
    name: FestivalName.NagaPanchami,
    caption: "Seek Blessings from Serpent Deities",
    description:
      "Honors snake gods for protection and prosperity, a day to offer prayers and rituals to ward off evil and ensure well-being.",
    celebration:
      "People observe Naga Panchami by fasting and performing special pujas and offering milk to snake idols to ward off evil and ensure well-being.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.RakshaBandhan,
    alias: ["Rakhi"],
    caption: "A Bond of Love and Protection",
    description:
      "Raksha Bandhan celebrates the loving bond between brothers and sisters. Its origin stems from when the Goddess Indrani tied a sacred thread to Indra that ultimately led to his victory over the asuras. In modern time, it is celebrated between brothers and sisters.",
    celebration:
      "Sisters often prepare a puja plate with a Rakhi, tilak, and sweets. The celebration involves the sister tying the Rakhi on her brother's wrist after applying a tilak and offering prayers. She may perform an aarti. Siblings exchange sweets, and brothers often give gifts to their sisters. It's a time for families to gather and celebrate their loving bond.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.KrishnaJanmashtami,
    deities: ["Krishna"],
    caption: "Celebrating the Birth of Lord Krishna",
    description:
      "Celebrates Lord Krishna's birth, known for divine playfulness and teachings, a day to seek blessings for love, wisdom, and protection.",
    celebration:
      "It is celebrated by fasting until midnight, performing special pujas, and enjoying festive foods. Some regions participate in Dahi Handi which is a game where a pot filled with curd is suspended from the ceiling and players must form pyramids with their bodies to reach and break it.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaAshtami,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.GaneshChaturthi,
    deities: ["Ganesha"],
    alias: ["Vinayaka Chaturthi"],
    caption: "Welcoming Lord Ganesha",
    description:
      "Ganesh Chaturthi is a joyous festival dedicated to Lord Ganesha, the remover of obstacles and the god of wisdom and prosperity. It celebrates his birth and his presence as a bringer of good fortune.",
    celebration:
      "Celebrations involve installing beautifully crafted idols of Lord Ganesha in homes and public spaces. Devotees offer prayers, flowers, sweets (especially modaks), and perform aartis. There are days of vibrant festivities with cultural programs, music, and dance. It is important to avoid looking at the moon during this day as it can lead to bad luck. Several days after, the Ganesha idols are ceremonially dissolved in water bodies.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturthi,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.Navaratri,
    deities: ["Durga", "Lakshmi", "Saraswati"],
    caption: "Nine Nights of Divine Feminine",
    description:
      "A nine-night celebration honoring the divine feminine energy (Shakti) in her various forms of Durga, Lakshmi, and Saraswati, representing the triumph of good over evil.",
    celebration:
      "Setting up golu (display of dolls), performing special pujas, fasting, dancing garba and dandiya raas, and worshipping young girls as embodiments of the goddess.",
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
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.Diwali,
    deities: ["Rama", "Krishna", "Lakshmi"],
    caption: "The Festival of Lights and Joy",
    description:
      "Diwali, also known as Deepavali or the Festival of Lights, is a significant Hindu festival symbolizing the victory of light over darkness, knowledge over ignorance, and good over evil. It commemorates the return of Lord Rama to Ayodhya after defeating Ravana, and the victory of Lord Krishna over the demon Narakasura.",
    celebration:
      "Diwali celebrations involve lighting oil lamps (diyas) to illuminate homes and streets, symbolizing the removal of darkness. Families perform Lakshmi Puja to invite prosperity and well-being. The festival is also marked by cleaning and decorating homes, exchanging gifts and sweets, and enjoying festive meals with loved ones.",
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
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaShashti,
      masaIndex: MasaIndex.Kartika,
    },
  },
];

export type Festival = Omit<FestivalRule, "rule"> & {
  date: number;
  rule: {
    type: RuleType.Lunar;
    tithiIndex: TithiIndex;
    masaIndex: MasaIndex;
  } | {
    type: RuleType.Dynamic;
  };
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
      const { rule, ...rest } = festival;
      const { evaluate, ...ruleWithoutEvaluate } = rule;
      festivals.push({
        ...rest,
        date,
        rule: ruleWithoutEvaluate,
      });
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
