import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Layout } from "@/layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setupNotificationListeners } from "@/util/notifications";
import { LocationProvider } from "@/context/location";
import { CalendarProvider } from "@/components/calendar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Preload assets
const preloadAssets = async () => {
  // Load image assets
  await Asset.loadAsync([
    ...NavigationAssets,
    require("../assets/tithi/new-moon-bg-removed.png"),
    require("../assets/tithi/moon.jpg"),
  ]);
};

SplashScreen.preventAutoHideAsync();

export function App() {
  React.useEffect(() => {
    const subscriptions = setupNotificationListeners();
    return () => {
      subscriptions.foregroundSubscription.remove();
      subscriptions.responseSubscription.remove();
    };
  }, []);

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
        <LocationProvider>
          <CalendarProvider>
            <Layout />
          </CalendarProvider>
        </LocationProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
