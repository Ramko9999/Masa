import Foundation

// MARK: - Panchanga Data Models

struct PanchangaMasa: Codable {
    let index: Int
    let name: String
    let isLeap: Bool
}

struct PanchangaTithi: Codable {
    let index: Int
    let name: String
}

struct PanchangaNakshatra: Codable {
    let index: Int
    let name: String
}

struct PanchangaMasaData: Codable {
    let amanta: PanchangaMasa
    let purnimanta: PanchangaMasa
}

struct PanchangaDay: Codable {
    let day: Int64 // Unix timestamp in milliseconds
    let tithi: PanchangaTithi
    let nakshatra: PanchangaNakshatra
    let masa: PanchangaMasaData
    let vaara: PanchangaVaara
}

struct PanchangaVaara: Codable {
    let index: Int
    let name: String
}

// MARK: - Festival Data Models

struct FestivalData: Codable {
    let name: String
    let date: Int64 // Unix timestamp in milliseconds
}
