import { NativeTabs, Label, Icon, VectorIcon } from 'expo-router/unstable-native-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { Platform, useColorScheme } from 'react-native';
import { AppColor, useGetColor } from '@/theme/color';

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const tintColor = useGetColor(AppColor.tint, theme);
  const primaryColor = useGetColor(AppColor.primary, theme);
  const backgroundColor = useGetColor(AppColor.background, theme);

  const androidProps = Platform.OS === "android" ? {
    backgroundColor,
    indicatorColor: backgroundColor,
    iconColor: {
      default: tintColor,
      selected: primaryColor,
    },
    labelStyle: {
      default: {
        color: tintColor,
      },
      selected: {
        color: primaryColor,
      },
    }
  } : {};

  return (
    <NativeTabs 
    disableIndicator
    {...androidProps}
    >
      <NativeTabs.Trigger name="home">
        <Icon 
          sf={{ default: "house", selected: "house.fill" }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="home" />
          }}
        />
        <Label>{t("tabs.home")}</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="festivals">
        <Icon 
          sf={{ default: "party.popper", selected: "party.popper.fill" }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="party-popper" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="party-popper" />
          }}
        />
        <Label>{t("tabs.festivals")}</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <Icon 
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="cog" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="cog" />
          }}
        />
        <Label>{t("tabs.settings")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
