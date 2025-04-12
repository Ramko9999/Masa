import { FestivalName } from "@/api/panchanga/core/festival";

// Direct mapping from FestivalName to image require statements
export const FESTIVAL_IMAGES: Record<FestivalName, any> = {
  [FestivalName.MakarSankranti]: require("../../assets/festivals/v1_makar-sankranti.png"),
  [FestivalName.VasantPanchami]: require("../../assets/festivals/v1_vasant_panchami.webp"),
  [FestivalName.MahaShivaratri]: require("../../assets/festivals/maha-shivaratri.webp"),
  [FestivalName.Holi]: require("../../assets/festivals/holi.png"),
  [FestivalName.Ugadi]: require("../../assets/festivals/ugadi.webp"),
  [FestivalName.RamaNavami]: require("../../assets/festivals/rama-navami.webp"),
  [FestivalName.HanumanJayanti]: require("../../assets/festivals/hanuman-jayanti.png"),
  [FestivalName.AkshayaTritiya]: require("../../assets/festivals/akshaya-tritya.webp"),
  [FestivalName.VatSavitri]: require("../../assets/festivals/vat-savitri.png"),
  [FestivalName.GuruPurnima]: require("../../assets/festivals/guru-purnima.png"),
  [FestivalName.RathYatra]: require("../../assets/festivals/rath-yatra.webp"),
  [FestivalName.NagaPanchami]: require("../../assets/festivals/nag-panchami.webp"),
  [FestivalName.RakshaBandhan]: require("../../assets/festivals/raksha-bandhan.webp"),
  [FestivalName.KrishnaJanmashtami]: require("../../assets/festivals/krishna-janmashtami.webp"),
  [FestivalName.GaneshChaturthi]: require("../../assets/festivals/ganesha-chaturthi.webp"),
  [FestivalName.Navaratri]: require("../../assets/festivals/akshaya-tritiya.png"),
  [FestivalName.DurgaPuja]: require("../../assets/festivals/durga-puja.png"),
  [FestivalName.Dussehra]: require("../../assets/festivals/dussehra.webp"),
  [FestivalName.KojagaraPuja]: require("../../assets/festivals/kojagara-puja.webp"),
  [FestivalName.KarvaChauth]: require("../../assets/festivals/karva-chauth.png"),
  [FestivalName.GovardhanaPuja]: require("../../assets/festivals/akshaya-tritiya.png"),
  [FestivalName.Diwali]: require("../../assets/festivals/diwali.png"),
  [FestivalName.ChhathPuja]: require("../../assets/festivals/akshaya-tritiya.png"),
};
