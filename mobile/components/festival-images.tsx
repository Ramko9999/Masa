import { FestivalName } from "@/api/panchanga/core/festival";

// Direct mapping from FestivalName to image require statements
export const FESTIVAL_IMAGES: Record<FestivalName, any> = {
  [FestivalName.MakarSankranti]: require("../assets/festivals/makar_sankranti.webp"),
  [FestivalName.VasantPanchami]: require("../assets/festivals/vasant_panchami.webp"),
  [FestivalName.MahaShivaratri]: require("../assets/festivals/maha_shivaratri.webp"),
  [FestivalName.Holi]: require("../assets/festivals/holi.webp"),
  [FestivalName.Ugadi]: require("../assets/festivals/ugadi.webp"),
  [FestivalName.RamaNavami]: require("../assets/festivals/rama_navami.webp"),
  [FestivalName.HanumanJayanti]: require("../assets/festivals/hanuman_jayanti.webp"),
  [FestivalName.AkshayaTritiya]: require("../assets/festivals/akshaya_tritiya.webp"),
  [FestivalName.VatSavitri]: require("../assets/festivals/vat_savitri.webp"),
  [FestivalName.GuruPurnima]: require("../assets/festivals/guru_purnima.webp"),
  [FestivalName.RathYatra]: require("../assets/festivals/rath_yatra.webp"),
  [FestivalName.NagaPanchami]: require("../assets/festivals/naga_panchami.webp"),
  [FestivalName.RakshaBandhan]: require("../assets/festivals/raksha_bandhan.webp"),
  [FestivalName.KrishnaJanmashtami]: require("../assets/festivals/krishna_janmashtami.webp"),
  [FestivalName.GaneshChaturthi]: require("../assets/festivals/ganesh_chaturthi.webp"),
  [FestivalName.MahaNavami]: require("../assets/festivals/maha_navami.webp"),
  [FestivalName.Dussehra]: require("../assets/festivals/dussehra.webp"),
  [FestivalName.KojagaraPuja]: require("../assets/festivals/kojagara_puja.webp"),
  [FestivalName.KarwaChauth]: require("../assets/festivals/karwa_chauth.webp"),
  [FestivalName.GovardhanaPuja]: require("../assets/festivals/govardhana_puja.webp"),
  [FestivalName.Dhanteras]: require("../assets/festivals/dhanteras.webp"),
  [FestivalName.NarakChaturdashi]: require("../assets/festivals/narak_chaturdashi.webp"),
  [FestivalName.LakshmiPuja]: require("../assets/festivals/lakshmi_puja.webp"),
  [FestivalName.BhaiyaDooj]: require("../assets/festivals/bhaiya_dooj.webp"),
};
