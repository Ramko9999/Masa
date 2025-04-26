import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Layout } from "@/layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LocationProvider } from "@/context/location";
import { CalendarProvider } from "@/components/calendar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// Preload assets
const preloadAssets = async () => {
  // Load image assets
  await Asset.loadAsync([
    ...NavigationAssets,
  ]);
};

SplashScreen.preventAutoHideAsync();

export function App() {
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);

  // Load assets
  React.useEffect(() => {
    async function loadAssets() {
      try {
        await preloadAssets();
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    }

    loadAssets();
  }, []);

  // Hide splash screen when everything is loaded
  React.useEffect(() => {
    if (assetsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [assetsLoaded]);

  if (!assetsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <LocationProvider>
            <CalendarProvider>
              <Layout />
            </CalendarProvider>
          </LocationProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
