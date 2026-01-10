import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LocationProvider } from '@/context/location';
import { CalendarProvider } from '@/components/calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingSheetsProvider } from '@/components/settings';
import { NotificationProvider } from '@/components/notifications';
import { BackgroundHandlers } from '@/components/background-handlers';
import { SystemBars } from 'react-native-edge-to-edge';
import { View } from '@/theme';
import { useColorScheme } from 'react-native';
import { AppColor, useGetColor } from '@/theme/color';

export default function RootLayout() {
  const theme = useColorScheme();
  const backgroundColor = useGetColor(AppColor.background, theme);
  
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor }}>
          <NotificationProvider>
            <LocationProvider>
              <CalendarProvider>
                <SettingSheetsProvider>
                  <Stack screenOptions={{ headerShown: false }} initialRouteName="splash">
                    <Stack.Screen name="splash" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="intro" />
                    <Stack.Screen name="location-permission" />
                    <Stack.Screen name="notification-permission" />
                    <Stack.Screen name="festival-details" />
                    <Stack.Screen name="tithi-info" />
                    <Stack.Screen name="vaara-info" />
                    <Stack.Screen name="nakshatra-info" />
                    <Stack.Screen name="masa-info" />
                    <Stack.Screen name="muhurtam-info" />
                  </Stack>
                  <BackgroundHandlers />
                  <SystemBars style="dark" />
                </SettingSheetsProvider>
              </CalendarProvider>
            </LocationProvider>
          </NotificationProvider>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

