import AsyncStorage from "@react-native-async-storage/async-storage";
import { Location } from "@/api/location";

const STORAGE_KEY = "location";

export async function getLocation(): Promise<Location | null> {
  const location = await AsyncStorage.getItem(STORAGE_KEY);
  if (location) {
    return JSON.parse(location);
  }
  return null;
}

export async function setLocation(location: Location): Promise<Location> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  return location;
}
