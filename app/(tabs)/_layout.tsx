import { NativeTabs, Label, Icon, VectorIcon } from 'expo-router/unstable-native-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { AppColor, useGetColor } from '@/theme/color';

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useColorScheme();

  return (
    <NativeTabs 
    disableIndicator
    >
      <NativeTabs.Trigger name="home">
        <Icon 
          sf={{ default: "house", selected: "house.fill" }}
          androidSrc={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home-outline" />,
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
            default: <VectorIcon family={MaterialCommunityIcons} name="cog-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="cog" />
          }}
        />
        <Label>{t("tabs.settings")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
