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
  subtitle?: string;
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
  MahaNavami = "Maha Navami",
  Dussehra = "Dussehra",
  KojagaraPuja = "Kojagara Puja",
  KarwaChauth = "Karwa Chauth",
  Dhanteras = "Dhanteras",
  NarakChaturdashi = "Narak Chaturdashi",
  LakshmiPuja = "Lakshmi Puja",
  GovardhanaPuja = "Govardhana Puja",
  BhaiyaDooj = "Bhaiya Dooj",
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
    subtitle: "Also known as Pongal",
    caption:
      "A sacred turning point honoring Surya and the light that guides new beginnings",
    description:
      "Makar Sankranti signifies the end of winter and the onset of longer, warmer days. It is an auspicious day to start new endeavors.",
    celebration:
      "Bathe in holy rivers or water-bodies. Worship Surya, the sun god. Make Pongal and Sesame seed and Jaggery sweets. Fly kites and enjoy the company of friends and family. Perform acts of charity.",
    rule: {
      type: RuleType.Dynamic,
      evaluate: getMakarSankrantiDate,
    },
  },
  {
    name: FestivalName.VasantPanchami,
    subtitle: "Also known as Saraswati Jayanti",
    caption:
      "Honor Goddess Saraswati, embracing wisdom and new educational endeavors",
    description:
      "Vasant Panchami is the birth anniversary of Goddess Saraswati, the deity of knowledge, music, arts, wisdom, and learning.",
    celebration:
      "Perform Saraswati Puja at homes and educational institutions in white and yellow attire. Offer Mustard and Marigold flowers to Goddess Saraswati. Perform <i>Vidya Arambha</i>, a ritual to initiate young children into education.",
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
      "Maha Shivaratri celebrates the divine marriage of Lord Shiva and Goddess Parvati and marks the day when Lord Shiva destroys creation performing his divine dance, <i>Tandava</i>. Take advantage of this most auspicious day.",
    celebration:
      "Observe a fast for the day and night. Perform <i>Abhishekam</i> for the Shiva <i>Lingam</i> by bathing it in water, milk, curd, ghee, honey and fruits. Stay alert the entire night.",
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
      "Holi links to the legend of Prahlada, a devotee of Lord Vishnu who was saved from the fire while the demoness Holika was burned. Holi also celebrates the love between Lord Krishna and Radha as it is said that Krishna and Radha partook in applying colors to each other.",
    celebration:
      "Light or attend a bonfire and burn Holika effigies the night before. Gather with friends and apply colored powders with water to each other.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaPratipada,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.Ugadi,
    caption: "Welcoming the New Year",
    subtitle: "Also known as Gudi Padwa",
    description:
      "Ugadi marks the beginning of the New Year. <i>Ugadi</i> means the \"beginning of a new age\", symbolizing renewal and the ushering in of prosperity and hope.",
    celebration:
      "Listen to the calendar forecast for the year, <i>Panchanga Sravanam</i>. Perform <i>Abhyang Snan</i> by massaging your body with oil before taking a warm bath. Prepare <i>Ugadi Pachadi</i>, a dish combining Neem flowers, Jaggery, Tamarind, Salt and raw Mango.",
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
      "Rama Navami is the birth anniversary of Lord Rama, the seventh incarnation of Lord Vishnu who is revered for his righteousness.",
    celebration:
      "Observe a day long fast. Read or listen to the Ramayana. Worship Lord Rama and Devi Sita.",
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
      "Hanuman Jayanti commemorates the birth of Lord Hanuman, the devoted disciple of Lord Rama who symbolizes unwavering devotion, selfless service and strength.",
    celebration:
      "Observe a day long fast. Recite the <i>Hanuman Chalisa</i>. Read or listen to the Ramayana. Offer prayers and Vermillion to Lord Hanuman.",
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
      "<i>Akshaya</i> means \"that which never diminishes\". On this day, Lord Krishna blessed his friend Sudama with wealth for his unconditional friendship. The Pandavas also recieved the <i>Akshaya Patra</i>, a vessel which yields unlimited food, on this day. Take advantage of this spiritually potent day as any righteous and spiritual deeds performed yield timeless merit.",
    celebration:
      "Perform acts of charity such as donating food, clothing or money or even volunteering. Worship your <i>Istha Devata</i>, your chosen deity. Perform any other spiritual practices as their effects multiply on this day.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaTritiya,
      masaIndex: MasaIndex.Vaisakha,
    },
  },
  {
    name: FestivalName.VatSavitri,
    caption:
      "Celebration of Marital Devotion and the Triumph of Love over Death",
    description:
      "Vat Savitri is observed by married women for the longevity and well-being of their husbands. It commemorates the devotion of Savitri who rescued her husband Satyavan from Lord Yama, the god of death.",
    celebration:
      "Married women observe a day long fast. Married women listen to the story of Savitri and Satyavan. Married women gather near a Banyan tree, and after offering prayers, tie threads around the tree and walk around it 7 times.",
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
      "Rath Yatra celebrates the journey of Lord Jagannath (Krishna), Lord Balarama, and Goddess Subhadra from the Jagannath temple to the Gundicha Temple, symbolizing Krishna and his siblings' return to Vrindavan, their childhood home.",
    celebration:
      "Pull a chariot with Lord Jagannath, Lord Balarama and Goddess Subhadra. Sing devotional songs for Lord Jagannath and dance along the way.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDwitiya,
      masaIndex: MasaIndex.Ashadha,
    },
  },
  {
    name: FestivalName.GuruPurnima,
    caption: "Honoring the Teacher",
    description:
      "Guru Purnima honors Gurus, the teachers and mentors, and acts as an opportunity to show them gratitude for their knowledge and guidance. Ved Vyasa, the narrator of the Mahabharata, was said to be born on this day.",
    celebration:
      "Offer gifts and sweets to the Gurus in your life. Reflect on their teachings and seek their blessings for future growth. Find solidarity amongst other fellow disciples.",
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
      "Naga Panchami is a day reserved for honoring the snake deities. It is said to be the day when Krishna defeated the multi-headed serpent Kaliya in the Yamuna river.",
    celebration:
      "Do not harm snakes on this day. Worship snake idols with offerings of milk.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.RakshaBandhan,
    subtitle: "Also known as Rakhi",
    caption: "A Bond of Love and Protection",
    description:
      "Raksha Bandhan celebrates the loving bond between brothers and sisters. It stems from when the Goddess Indrani tied a sacred thread to Indra, leading to his victory over the asuras. In modern times, it is celebrated between brothers and sisters.",
    celebration:
      "Sisters tie a <i>Rakhi</i>, a sacred thread, around the brothers' wrists and pray for their good health. Brothers repay their sisters with gifts and vow to protect them.",
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
      "This day celebrates the birth of Lord Krishna, known for his divine playfulness and wisdom. Use this day to seek his love and protection.",
    celebration:
      "Observe a day and night fast. Worship Lord Krishna at midnight as he was born at midnight. Participate in <i>Dahi Handi</i>, a game where a pot filled with curd is suspended from the ceiling and players must form pyramids with their bodies to reach and break it - it resembles how Krishna and his friends would steal curd in their childhood.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaAshtami,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.GaneshChaturthi,
    subtitle: "Also known as Vinayaka Chaturthi",
    caption: "Welcoming Lord Ganesha",
    description:
      "Ganesh Chaturthi celebrates the birth of Lord Ganesha, the remover of obstacles and the god of wisdom and prosperity.",
    celebration:
      "Observe a day long fast. Avoid looking at the moon on this day. Construct or purchase a clay Ganesh idol, worship it for the next 10 days, and on the final day (Chaturdashi), submerge the idol into a water body.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturthi,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.MahaNavami,
    caption: "Honoring the Warrior Goddess",
    description:
      "Maha Navami marks the day when Goddess Durga killed Mahishasura. It is celebrated on the 9th day of Navaratri, a 9 day-long worship of the forms of Goddess Durga.",
    celebration:
      "Observe a day long fast. Perform <i>Ayudha Puja</i>, the worship of machinery, instruments, equipment and auto-mobiles. Read or listen to the story of Durga and Mahishasura. Worship Goddess Durga.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaNavami,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.Dussehra,
    subtitle: "Also known as Vijayadashami",
    caption: "Triumph of Good Over Evil",
    description:
      "Dussehra marks Lord Rama's victory over Ravana, and celebrates the triumph of good over evil.",
    celebration:
      "Burn effigies of Ravana, Meghananda (Ravana's son) and Kumbhakarna (Ravana's brother). Read or listen to the Ramayana. Worship Lord Rama and Devi Sita.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDashami,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.KojagaraPuja,
    caption: "ANight for Goddess Lakshmi",
    description:
      "It is believed that Goddess Lakshmi roams the earth on this night and blesses those who remain awake with prosperity.",
    celebration:
      "Stay awake the entire night. Observe a day and night fast. Light oil lamps and candles in your home. Offer prayers and sweets to Goddess Lakshmi.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturdashi,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.KarwaChauth,
    caption: "Celebration of the Marital Bond",
    description:
      "On Karwa Chauth, married women fast from sunrise to moonrise for their husbands' well-being.",
    celebration:
      "Married women observe a fast from sunrise to moonrise and conclude it by looking at the moon through a transparent cloth or sieve. <i>Arghya</i>, ceremonial water, is offered to the moon and then their husband offers them water, breaking the fast.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaTritiya,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.GovardhanaPuja,
    subtitle: "Fourth day of Diwali",
    caption: "Honoring the Sacred Mountain",
    description:
      "On this day, Lord Krishna saves the residents of Gokul from Indra's rain and storms by lifting up Govardhan hill.",
    celebration:
      "Create a miniature Govardhan hill and offer prayers to it. Prepare 56 varities of sweets, savories and delicaies and offer them to Lord Krishna and Govardhan hill.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.Dhanteras,
    subtitle: "First day of Diwali",
    caption: "Beginning of Diwali",
    description:
      "Dhanteras marks the first of the five day Diwali celebrations. It is the day in which Dhanvantari, the father of Ayurveda, and Goddess Lakshmi were born. It is also the day in which King Hima's son was saved from death due to a predicted snake bite: his wife lit up oil lamps and placed ornaments that distracted King Yama, the god of death, who came as a snake to deliver the bite.",
    celebration:
      "Worship Goddess Lakshmi and Lord Dhanvantari in the evening. Light up the lamps in the southern direction to gain blessings from Lord Yama for protection against the untimely deaths of family members.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaTrayodashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.NarakChaturdashi,
    subtitle: "Second day of Diwali",
    caption: "End of Darkness",
    description:
      "Narak Chaturdashi is the day when Lord Krishna and Goddess Satyabhama killed the demon king Narakasura.",
    celebration:
      "Take <i>Abhyang Snan</i>, an oil massage, with a warm bath before sunrise. Light oil lamps around your house and burst fire crackers. Worship Lord Krishna.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.LakshmiPuja,
    subtitle: "Third day of Diwali",
    caption: "Worship Goddess Lakshmi",
    description:
      "Lakshmi Puja is the 3rd day of Diwali and is considered to be the main Diwali festival. It is dedicated to Goddess Lakshmi.",
    celebration:
      "Observe a day long fast. Clean and decorate homes and offices with Marigold, Mango and Banana leaves. Place both sides of a broken, unpeeled Coconut in front of your home. Light oil lamps and place them throughout the home. Worship Goddess Lakshmi.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.BhaiyaDooj,
    subtitle: "Fifth day of Diwali",
    caption: "Celebrate the Brother-Sister Bond",
    description:
      "Similar to Raksha Bandan, Bhaiya Dhooj is a day where the bond between brothers and sisters is celebrated. It is said that Lord Yama visited his sister Yamuna and recieved such a warm welcome that he granted her a boon on this day.",
    celebration:
      "A sister invites her brother to her home for a good meal. A sister will then perform <i>Aarti</i> and apply <i>Tilak</i> on her brother's forehead for his success. The brother will vow to protect his sister and gives her a gift.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDwitiya,
      masaIndex: MasaIndex.Kartika,
    },
  },
];

export type Festival = Omit<FestivalRule, "rule"> & {
  date: number;
  rule:
    | {
        type: RuleType.Lunar;
        tithiIndex: TithiIndex;
        masaIndex: MasaIndex;
      }
    | {
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

export function getFestivals(anchorDay: number, location: Location) {
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
