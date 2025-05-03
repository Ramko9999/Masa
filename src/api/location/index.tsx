import { getForegroundPermissionsAsync, getCurrentPositionAsync, Accuracy, LocationPermissionResponse, reverseGeocodeAsync, LocationGeocodedAddress } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_KEY = "location";

export type Location = {
    latitude: number;
    longitude: number;
    place: string;
}

export type PrepopulatedLocation = { city: string, country: string, latitude: number, longitude: number };


export const PREPOPULATED_LOCATIONS: PrepopulatedLocation[] = [
    {
        city: "San Francisco",
        country: "USA",
        latitude: 37.7749,
        longitude: -122.4194,
    },
    {
        city: "Chicago",
        country: "USA",
        latitude: 41.8781,
        longitude: -87.6298,
    },
    {
        city: "New York",
        country: "USA",
        latitude: 40.7128,
        longitude: -74.0060,
    },
    {
        city: "Delhi",
        country: "India",
        latitude: 28.6139,
        longitude: 77.2090,
    },
    {
        city: "Mumbai",
        country: "India",
        latitude: 19.0760,
        longitude: 72.8777,
    },
    {
        city: "Hyderabad",
        country: "India",
        latitude: 17.3850,
        longitude: 78.4867,
    },
    {
        city: "Bangalore",
        country: "India",
        latitude: 12.972,
        longitude: 77.594,
    },
]


async function getLocationPermissionStatus(): Promise<LocationPermissionResponse> {
    return await getForegroundPermissionsAsync();
}


function getPlaceFromGeographicLocation(address?: LocationGeocodedAddress): string {
    return address?.city ?? address?.district ?? address?.subregion ?? address?.region ?? "Unknown Location"
}

// assumes that the permission has already been granted
async function readAndSaveDeviceLocation(): Promise<Location> {
    const { coords } = await getCurrentPositionAsync({
        accuracy: Accuracy.Lowest,
    });
    const geographicLocation = await reverseGeocodeAsync(coords);
    const place = getPlaceFromGeographicLocation(geographicLocation[0]);

    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify({ ...coords, place }));
    return {
        ...coords,
        place,
    };
}

async function saveLocation(location: Location) {
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

async function getSavedLocation(): Promise<Location | undefined> {
    const location = await AsyncStorage.getItem(LOCATION_KEY);
    if (!location) {
        const permission = await getLocationPermissionStatus();
        // support existing users who have already granted permission
        if (permission.granted) {
            return await readAndSaveDeviceLocation();
        }
    }
    return location ? JSON.parse(location) : undefined;
}

export const LocationApi = {
    getLocationPermissionStatus,
    getSavedLocation,
    saveLocation,
    readAndSaveDeviceLocation,
}
