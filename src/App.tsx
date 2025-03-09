import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { loadPanchangaData } from "./util/panchanga";

// Preload assets
const preloadAssets = async () => {
  // Load image assets
  await Asset.loadAsync([
    ...NavigationAssets,
    require("./assets/newspaper.png"),
    require("./assets/bell.png"),
  ]);
  
  // Preload panchanga data separately
  try {
    await loadPanchangaData();
    console.log("Panchanga data loaded successfully");
  } catch (error) {
    console.error("Failed to preload panchanga data:", error);
  }
};

SplashScreen.preventAutoHideAsync();

export function App() {

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

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
    if (fontsLoaded && assetsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded]);

  if (!fontsLoaded || !assetsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );
}
