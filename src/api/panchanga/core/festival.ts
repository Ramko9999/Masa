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

export type FestivalInfo = {
  title: string;
  subtitle?: string;
  caption: string;
  description: string;
  celebration: string;
};

type FestivalRule = {
  name: FestivalName;
  rule: LunarRule | DynamicRule;
};

export enum FestivalName {
  // Pongal/Sankranti Festivals
  MakarSankranti = "makar_sankranti",

  // Spring Festivals
  VasantPanchami = "vasant_panchami",
  MahaShivaratri = "maha_shivaratri",
  Holi = "holi",

  // New Year and Spring Festivals
  Ugadi = "ugadi",
  RamaNavami = "rama_navami",
  HanumanJayanti = "hanuman_jayanti",
  AkshayaTritiya = "akshaya_tritiya",

  // Summer Festivals
  VatSavitri = "vat_savitri",
  GuruPurnima = "guru_purnima",
  RathYatra = "rath_yatra",
  NagaPanchami = "naga_panchami",
  RakshaBandhan = "raksha_bandhan",
  KrishnaJanmashtami = "krishna_janmashtami",
  GaneshChaturthi = "ganesh_chaturthi",
  MahaNavami = "maha_navami",
  Dussehra = "dussehra",
  KojagaraPuja = "kojagara_puja",
  KarwaChauth = "karwa_chauth",
  Dhanteras = "dhanteras",
  NarakChaturdashi = "narak_chaturdashi",
  LakshmiPuja = "lakshmi_puja",
  GovardhanaPuja = "govardhana_puja",
  BhaiyaDooj = "bhaiya_dooj",
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
    rule: {
      type: RuleType.Dynamic,
      evaluate: getMakarSankrantiDate,
    },
  },
  {
    name: FestivalName.VasantPanchami,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Magha,
    },
  },
  {
    name: FestivalName.MahaShivaratri,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Phalguna,
    },
  },
  {
    name: FestivalName.Holi,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaPratipada,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.Ugadi,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.RamaNavami,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaNavami,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.HanumanJayanti,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Chaitra,
    },
  },
  {
    name: FestivalName.AkshayaTritiya,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaTritiya,
      masaIndex: MasaIndex.Vaisakha,
    },
  },
  {
    name: FestivalName.VatSavitri,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Jyeshtha,
    },
  },
  {
    name: FestivalName.RathYatra,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDwitiya,
      masaIndex: MasaIndex.Ashadha,
    },
  },
  {
    name: FestivalName.GuruPurnima,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Ashadha,
    },
  },
  {
    name: FestivalName.NagaPanchami,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPanchami,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.RakshaBandhan,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Purnima,
      masaIndex: MasaIndex.Shravana,
    },
  },
  {
    name: FestivalName.KrishnaJanmashtami,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaAshtami,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.GaneshChaturthi,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturthi,
      masaIndex: MasaIndex.Bhadrapada,
    },
  },
  {
    name: FestivalName.MahaNavami,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaNavami,
      masaIndex: MasaIndex.Ashwina,
    },
  },
  {
    name: FestivalName.Dussehra,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaDashami,
      masaIndex: MasaIndex.Ashwina,
    },
  },
  {
    name: FestivalName.KojagaraPuja,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaChaturdashi,
      masaIndex: MasaIndex.Ashwina,
    },
  },
  {
    name: FestivalName.KarwaChauth,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaTritiya,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.GovardhanaPuja,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.ShuklaPratipada,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.Dhanteras,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaTrayodashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.NarakChaturdashi,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.KrishnaChaturdashi,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.LakshmiPuja,
    rule: {
      type: RuleType.Lunar,
      tithiIndex: TithiIndex.Amavasya,
      masaIndex: MasaIndex.Kartika,
    },
  },
  {
    name: FestivalName.BhaiyaDooj,
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

const festivalsCache = new Map<CacheKey, CacheEntry>();

function generateCacheKey(anchorDay: number, location: Location): CacheKey {
  const day = truncateToDay(anchorDay);
  return `${day}:${location.latitude.toFixed(4)}:${location.longitude.toFixed(
    4
  )}`;
}


// todo: fix cache so that only festivals for the anchor date year are cached
export function getFestivals(location: Location) {
  const today = new Date();
  const anchorDay = new Date(today.getFullYear(), 0, 1).valueOf();
  const cacheKey = generateCacheKey(anchorDay, location);

  const cachedResult = festivalsCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult.festivals;
  }

  const lunarFestivals = getLunarFestivals(anchorDay, location);
  const dynamicFestivals = getDynamicFestivals(anchorDay, location);
  const festivals = [...lunarFestivals, ...dynamicFestivals].sort(
    (a, b) => a.date - b.date
  );

  festivalsCache.set(cacheKey, {
    festivals,
  });

  return festivals;
}
