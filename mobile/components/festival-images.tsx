import { FestivalName } from "@/api/panchanga/core/festival";

// Direct mapping from FestivalName to image require statements
export const FESTIVAL_IMAGES: Record<FestivalName, any> = {
  [FestivalName.MakarSankranti]: require("../assets/festivals/makar-sankranti.png"),
  [FestivalName.VasantPanchami]: require("../assets/festivals/vasant-panchami.webp"),
  [FestivalName.MahaShivaratri]: require("../assets/festivals/maha-shivaratri.webp"),
  [FestivalName.Holi]: require("../assets/festivals/holi.png"),
  [FestivalName.Ugadi]: require("../assets/festivals/ugadi.webp"),
  [FestivalName.RamaNavami]: require("../assets/festivals/rama-navami.webp"),
  [FestivalName.HanumanJayanti]: require("../assets/festivals/hanuman-jayanti.png"),
  [FestivalName.AkshayaTritiya]: require("../assets/festivals/akshaya-tritya.webp"),
  [FestivalName.VatSavitri]: require("../assets/festivals/vat-savitri.png"),
  [FestivalName.GuruPurnima]: require("../assets/festivals/guru-purnima.png"),
  [FestivalName.RathYatra]: require("../assets/festivals/rath-yatra.webp"),
  [FestivalName.NagaPanchami]: require("../assets/festivals/nag-panchami.webp"),
  [FestivalName.RakshaBandhan]: require("../assets/festivals/raksha-bandhan.webp"),
  [FestivalName.KrishnaJanmashtami]: require("../assets/festivals/krishna-janmashtami.webp"),
  [FestivalName.GaneshChaturthi]: require("../assets/festivals/ganesha-chaturthi.webp"),
  [FestivalName.MahaNavami]: require("../assets/festivals/maha-navami.webp"),
  [FestivalName.Dussehra]: require("../assets/festivals/dussehra.webp"),
  [FestivalName.KojagaraPuja]: require("../assets/festivals/kojagara-puja.webp"),
  [FestivalName.KarwaChauth]: require("../assets/festivals/karwa-chauth.webp"),
  [FestivalName.GovardhanaPuja]: require("../assets/festivals/govardhana-puja.webp"),
  [FestivalName.Dhanteras]: require("../assets/festivals/dhanteras.png"),
  [FestivalName.NarakChaturdashi]: require("../assets/festivals/naraka-chaturdashi.webp"),
  [FestivalName.LakshmiPuja]: require("../assets/festivals/lakshmi-puja.webp"),
  [FestivalName.BhaiyaDooj]: require("../assets/festivals/bhaiya-dhooj.webp"),
};
