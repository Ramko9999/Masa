export type Location = {
    latitude: number;
    longitude: number;
    timezoneOffset: number;
}

const BANGALORE: Location = {
    latitude: 12.972,
    longitude: 77.594,
    timezoneOffset: 5.5,
}

const ST_AUGUSTINE: Location = {
    latitude: 30.0188,
    longitude: -81.6944,
    timezoneOffset: -4,
}

export function getLocation(): Location {
    // bangalore
    return ST_AUGUSTINE;
}
