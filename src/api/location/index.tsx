import * as LocationApi from "expo-location";

export type Location = {
    latitude: number;
    longitude: number;
}

export const BANGALORE: Location = {
    latitude: 12.972,
    longitude: 77.594,
}

export async function getLocationPermissionStatus(): Promise<LocationApi.LocationPermissionResponse> {
    return await LocationApi.getForegroundPermissionsAsync();
}

// assumes that the permission has already been granted
export async function readDeviceLocation(): Promise<Location> {
    const { coords } = await LocationApi.getCurrentPositionAsync({
        accuracy: LocationApi.Accuracy.Lowest,
    });
    return coords;
}
