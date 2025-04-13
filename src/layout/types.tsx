import { NavigatorScreenParams } from "@react-navigation/native";
import { Festival } from "@/api/panchanga/core/festival";

export type TabParamList = {
    home: undefined;
    festivals: undefined;
}

export type RootStackParamList = {
    splash: undefined;
    location_permission: undefined;
    notification_permission: undefined;
    tabs: NavigatorScreenParams<TabParamList>;
    festival_details: { festival: Festival };
    intro: undefined;
    tithi_info: undefined;
    vaara_info: undefined;
    nakshatra_info: undefined;
    masa_info: undefined;
}
