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
  MahaNavami = "Maha Navami",
  Dussehra = "Dussehra",
  KojagaraPuja = "Kojagara Puja",
  KarwaChauth = "Karwa Chauth",
  Dhanteras = "Dhanteras (1st day of Diwali)",
  NarakChaturdashi = "Narak Chaturdashi (2nd day of Diwali)",
  LakshmiPuja = "Lakshmi Puja (3rd day of Diwali)",
  GovardhanaPuja = "Govardhana Puja (4th day of Diwali)",
  BhaiyaDooj = "Bhaiya Dooj (5th day of Diwali)",
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
    caption: "Honor the light that guides new beginnings",
    description:
      "Makar Sankranti occurs when the Sun moves through the Capricorn Zodiac, signifying the end of winter and the onset of longer, warmer days. It is usually occurs on January 14th (or January 15th in leap years). It is a highly auspicious day for new beginnings and spiritual practices.",
    celebration:
      "Bathe in holy rivers or water-bodies. Worship Surya, the sun god. Make Pongal and sesame seed and jaggery sweets. Fly kites. Perform acts of charity.",
    rule: {
      type: RuleType.Dynamic,
      evaluate: getMakarSankrantiDate,
    },
  },
  {
    name: FestivalName.VasantPanchami,
    alias: ["Saraswati Jayanti", "Saraswati Puja"],
    caption: "Embrace wisdom and education",
    description:
      "Vasant Panchami is dedicated to Goddess Saraswati, the Hindu deity of knowledge, music, arts, wisdom, and learning. It is believed to be her birth anniversary.",
    celebration:
      "Perform Saraswati Puja at homes and educational institutions in white and yellow attire. Offer Mustard and Marigold flowers to Goddess Saraswati. Perform <b>Vidya Arambha</b>, a ritual to initiate young children into education.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Magha,
    },
  },
  {
    name: FestivalName.MahaShivaratri,
    caption: "Night of Spiritual Awakening",
    description:
      "Maha Shivaratri is one of the most auspicious nights in the year and is associated with many significant events of Lord Shiva. It celebrates the divine marriage of Lord Shiva and Goddess Parvati. It is believed that Lord Shiva destroys creation on this day while performing his divine dance, Tandava.",
    celebration:
      "Observe a fast for the day and night. Perform Abhishekam for the Shiva lingam by bathing it in water, milk, curd, ghee, honey and fruits. Stay alert the entire night.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Holi,
    caption: "Celebration of Colors and Love",
    description:
      "Holi originates from the legend of Prahlada, a devotee of Lord Vishnu, who was saved from the fire while the demoness Holika was burned. Holi is also connected to the divine love between Lord Krishna and Radha where it is said that Krishna and Radha partook in applying colors to each other.",
    celebration:
      "Light or attend a bonfire and burn Holika effigies the night before. Gather with friends and apply colored powders with water to each other.",
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
      "Listen to the calendar forecast for the year, <b>Panchanga Sravanam</b>. Perform Abhyangsnan by massaging your body oil before taking a warm bath. Prepare Ugadi Pachadi, a dish combining neem flowers, jaggery, tamarind, salt and raw mango.",
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
      "Rama Navami is the birth anniversary of Lord Rama. Lord Rama, the seventh incarnation of Lord Vishnu, is revered for his virtues and righteousness. The festival commemorates his birth in Ayodhya to King Dasharatha and Queen Kausalya.",
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
      "Hanuman Jayanti commemorates the birth of Lord Hanuman, the devoted disciple of Lord Rama, who symbolizes unwavering devotion, strength, and selfless service",
    celebration:
      "Observe a day long fast. Recite the Hanuman Chalisa. Read or listen to the Ramayana. Offer Vermillion to Lord Hanuman.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.AkshayaTritiya,
    caption: "A Day of Abundance",
    description:
      "Akshaya in Sanskrit means 'that which never diminishes'. It is believed to be day that Lord Krishna blessed his friend Sudama with wealth for his unconditional friendship. It is also the day that the Pandavas recieved the Akshaya Patra, a vessel which yields unlimited food. It is a spiritually potent day as any righteous and spiritual deeds performed on this day yield timeless merit.",
    celebration:
      "Perform acts of charity such as donating food, clothing or money or even volunteering. Worship your Istha Devata, your chosen deity. Perform your other spiritual practices as their effects multiply on this day.",
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
      "Vat Savitri is observed by married women for the longevity and well-being of their husbands. This festival commemorates the devotion of Savitri who rescued her husband Satyavan from Yama, the god of death.",
    celebration:
      "Observe a day long fast. Listen or narrate to the story of Savitri and Satyavan. Gather near a Banyan tree, and after offering prayers, tie threads around the tree and walk around it 7 times.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Jyeshtha,
    },
  },
  {
    name: FestivalName.RathYatra,
    caption: "Chariot Festival of Lord Jagannath",
    description:
      "Rath Yatra celebrates the journey of Lord Jagannath (Krishna), Lord Balarama, and Goddess Subhadra from the Jagannath temple to the Gundicha Temple. It symbolizes Krishna and his siblings' return to their childhood home, Vrindavan.",
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
      "Guru Purnima honors the Gurus, the teachers and mentors, in your life and serves a day to show them gratitude for the knowledge and guidance they have provided. It is regarded as the day Ved Vyasa, the narrator of the Mahabharata, was born.",
    celebration:
      "Offer gifts and sweets for the Gurus in your life. Reflect on their teachings and seek their blessings for future growth. Find solidarity amongst other fellow disciples.",
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
      "Naga Panchami is a day reserved for honoring the snake deities. It is believed to be the day when Krishna defeated the multi-headed serpent Kaliya in the Yamuna river.",
    celebration:
      "Do not harm snakes on this day. Worship snake idols by offering milk to ward off evil.",
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
      "Raksha Bandhan celebrates the loving bond between brothers and sisters. It stems from when the Goddess Indrani tied a sacred thread to Indra that ultimately led to his victory over the asuras. In modern times, it is celebrated between brothers and sisters.",
    celebration:
      "Sisters tie a Rakhi, a sacred thread, around the brothers' wrists and pray for their good health. Brothers repay their sisters with gifts and vow to protect them.",
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
      "This day celebrates Lord Krishna's birth. Lord Krishna is known for his divine playfulness and wisdom. It serves as a day to seek his love and protection.",
    celebration:
      "Observe a day and night fast. Worship Lord Krishna at midnight as it is said that he was born at midnight. Participate in Dahi Handi, a game where a pot filled with curd is suspended from the ceiling and players must form pyramids with their bodies to reach and break it - it resembles how Krishna and his friends would steal curd in their childhood.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaAshtami,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.GaneshChaturthi,
    alias: ["Vinayaka Chaturthi"],
    caption: "Welcoming Lord Ganesha",
    description:
      "Ganesh Chaturthi is a joyous festival dedicated to Lord Ganesha, the remover of obstacles and the god of wisdom and prosperity. It celebrates his birth and his presence as a bringer of good fortune.",
    celebration:
      "Observe a day long fast. Avoid looking at the moon on this day. Construct or a purchase a clay Ganesh idol, worship it for the next 10 days, and on the final day (Chaturdashi), submerge the idol into a water body.",
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
      "Maha Navami marks the day when Goddess Durga killed Mahishasura. It is celebrated on the 9th day of Navaratri, a 9 day long worship of the forms of Goddess Durga.",
    celebration:
      "Observe a day long fast. Perform Ayudha Puja, the worship of machinery, instruments, equipment and auto-mobiles. Read or listen to the story of Durga and Mahishasura. Worship Goddess Durga.",
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
      "Dussehra marks Lord Rama's victory over Ravana, symbolizing good over evil. It is a day to celebrate righteousness through cultural festivities.",
    celebration:
      "Burn effigies of Ravana, Meghananda (Ravana's son) and Kumbhakarna (Ravana's brother). Read or listen to the Ramayana.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDashami,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.KojagaraPuja,
    caption: "Night for Goddess Lakshmi",
    description:
      "It is believed that Goddess Lakshmi roams the earth on this night and blesses those who remain awake with prosperity.",
    celebration:
      "Stay awake the entire night. Observe a day and night fast. Light lamps and candles in your home. Offer prayers and sweets to Goddess Lakshmi.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Ashwin,
    },
  },
  {
    name: FestivalName.KarwaChauth,
    caption: "Celebration of the Marital Bond",
    description:
      "On Karwa Chauth, married women fast from sunrise to moonrise for their husbands' well-being.",
    celebration:
      "Married women observe a fast from sunrise to moonrise and conclude it by looking at the moon through a transparent cloth or sieve. Arghya, ceremonial water is offered to the moon and then their husband offers them water, breaking their fast.",
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
    caption: "Beginning of Diwali",
    description:
      "Dhanteras marks the first day of the 5 day Diwali celebrations. It signifies the day in which Dhanvantari, the father of Ayurveda, and Goddess Lakshmi was born. It also signifies the day in which King Hima's son was saved from a death due to a predicted snake bite: his wife lit up lamps and placed ornaments that distracted King Yama who had come in the form of a snake to deliver the bite.",
    celebration:
      "Worship Goddess Lakshmi and Lord Dhanvantari in the evening. Light up the lamps in the southern direction to gain blessings from Lord Yama for the longevity of family members.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaTrayodashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.NarakChaturdashi,
    caption: "End of Darkness",
    description:
      "Narak Chaturdashi is the day when Lord Krishna and Goddess Satyabhama killed the demon king Narakasura.",
    celebration:
      "Take Abhyang Snan, an oil massage, with a warm bath before sunrise. Light lamps around your house and burst fire crackers. Worship Lord Krishna.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.LakshmiPuja,
    caption: "Worship Goddess Lakshmi",
    description:
      "Lakshmi Puja is the 3rd day of Diwali and is the main Diwali festival and is dedicated to Goddess Lakshmi.",
    celebration:
      "Observe a day long fast. Clean and decorate homes and offices with Marigold, Mango and Banana leaves. Place both sides of a broken, unpeeled Coconut in front of your home. Light oil lamps and place them throughout the home. Worship Goddess Lakshmi Puja.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.BhaiyaDooj,
    caption: "Celebrate the Brother-Sister Bond",
    description:
      "Similar to Raksha Bandan, Bhaiya Dhooj is a day where the bond between brothers and sisters is celebrated. It is said that Lord Yama visited his sister Yamuna and recieved such a warm welcome that he granted her a boon on this day.",
    celebration:
      "A sister invites her brother to her home for a good meal. A sister will then perform aarti and apply Tilak on her brother's forehead for his success. The brother will vow to protect his sister and gives her a gift.",
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDwitiya,
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
