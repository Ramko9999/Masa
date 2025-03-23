export type Location = {
    latitude: number;
    longitude: number;
}

const BANGALORE: Location = {
    latitude: 12.972,
    longitude: 77.594,
}

const ST_AUGUSTINE: Location = {
    latitude: 30.0188,
    longitude: -81.6944,
}

export function getLocation(): Location {
    // bangalore
    return BANGALORE;
}
