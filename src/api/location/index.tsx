import { getForegroundPermissionsAsync, getCurrentPositionAsync, Accuracy, LocationPermissionResponse } from "expo-location";

export type Location = {
    latitude: number;
    longitude: number;
}

export const BANGALORE: Location = {
    latitude: 12.972,
    longitude: 77.594,
}

async function getLocationPermissionStatus(): Promise<LocationPermissionResponse> {
    return await getForegroundPermissionsAsync();
}

// assumes that the permission has already been granted
async function readDeviceLocation(): Promise<Location> {
    const { coords } = await getCurrentPositionAsync({
        accuracy: Accuracy.Lowest,
    });
    return coords;
}


export const LocationApi = {
    getLocationPermissionStatus,
    readDeviceLocation,
}
