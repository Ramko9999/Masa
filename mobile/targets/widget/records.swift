import Foundation
import SwiftUI

// MARK: - Panchanga Data Models
// These match the TypeScript types in api/widget.ts

struct PanchangaTithi: Codable {
    let index: Int
    let name: String
}

struct PanchangaNakshatra: Codable {
    let index: Int
    let name: String
}

struct PanchangaMasa: Codable {
    let index: Int
    let name: String
    let isLeap: Bool
}

struct PanchangaMasaData: Codable {
    let amanta: PanchangaMasa
    let purnimanta: PanchangaMasa
}

struct PanchangaVaara: Codable {
    let index: Int
    let name: String
}

// Matches PanchangaDayData from api/widget.ts
struct PanchangaDay: Codable {
    let day: Int64 // Unix timestamp in milliseconds
    let tithi: PanchangaTithi
    let nakshatra: PanchangaNakshatra
    let masa: PanchangaMasaData
    let vaara: PanchangaVaara
}

// MARK: - Festival Data Models

// Matches FestivalData from api/widget.ts
struct FestivalData: Codable {
    let name: String
    let date: Int64 // Unix timestamp in milliseconds
}

// MARK: - Shared Widget UI Components

struct WidgetEmptyStateView: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "arrow.clockwise.circle")
                .font(.system(size: 40))
                .foregroundStyle(.white.opacity(0.6))
            Text("Please open the app to refresh")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.white.opacity(0.8))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
        }
    }
}

// MARK: - Shared Data Loading Helpers

func loadPanchangaDays() -> [PanchangaDay]? {
    guard let defaults = UserDefaults(suiteName: "group.com.anonymous.masa"),
          let data = defaults.data(forKey: "panchanga_days"),
          let panchangaDays = try? JSONDecoder().decode([PanchangaDay].self, from: data) else {
        return nil
    }
    return panchangaDays
}

func loadPanchangaForDate(_ date: Date) -> PanchangaDay? {
    guard let panchangaDays = loadPanchangaDays() else {
        return nil
    }
    
    // Get current day timestamp (midnight in milliseconds)
    let calendar = Calendar.current
    let dayStart = calendar.startOfDay(for: date)
    let dayTimestamp = Int64(dayStart.timeIntervalSince1970 * 1000)
    
    // Find matching day in array
    return panchangaDays.first { $0.day == dayTimestamp }
}

func writeDebugInfo(_ info: String) {
    guard let defaults = UserDefaults(suiteName: "group.com.anonymous.masa") else {
        return
    }
    defaults.set(info, forKey: "widget_debug_info")
}

func loadFestivals() -> [FestivalData]? {
    var debugInfo = "=== Festival Widget Debug ===\n"
    
    guard let defaults = UserDefaults(suiteName: "group.com.anonymous.masa") else {
        debugInfo += "❌ Failed to get UserDefaults\n"
        writeDebugInfo(debugInfo)
        return nil
    }
    
    debugInfo += "✅ Got UserDefaults\n"
    
    guard let data = defaults.data(forKey: "festivals") else {
        debugInfo += "❌ No data found for key 'festivals'\n"
        debugInfo += "Available keys: \(Array(defaults.dictionaryRepresentation().keys).sorted().joined(separator: ", "))\n"
        writeDebugInfo(debugInfo)
        return nil
    }
    
    debugInfo += "✅ Found festivals data, size: \(data.count) bytes\n"
    
    guard let festivals = try? JSONDecoder().decode([FestivalData].self, from: data) else {
        debugInfo += "❌ Failed to decode festivals data\n"
        if let jsonString = String(data: data, encoding: .utf8) {
            debugInfo += "Raw JSON (first 500 chars): \(String(jsonString.prefix(500)))\n"
        }
        writeDebugInfo(debugInfo)
        return nil
    }
    
    debugInfo += "✅ Successfully decoded \(festivals.count) festivals\n"
    debugInfo += "\nFestivals:\n"
    for (index, festival) in festivals.prefix(10).enumerated() {
        let date = Date(timeIntervalSince1970: TimeInterval(festival.date) / 1000.0)
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        debugInfo += "\(index + 1). \(festival.name) - \(formatter.string(from: date))\n"
    }
    if festivals.count > 10 {
        debugInfo += "... and \(festivals.count - 10) more\n"
    }
    
    writeDebugInfo(debugInfo)
    return festivals
}

func loadNextFestival(from date: Date = Date()) -> FestivalData? {
    var debugInfo = ""
    
    guard let festivals = loadFestivals() else {
        debugInfo += "❌ No festivals data found\n"
        writeDebugInfo(debugInfo)
        return nil
    }
    
    debugInfo += "✅ Found \(festivals.count) festivals in data\n"
    
    let nowTimestamp = Int64(date.timeIntervalSince1970 * 1000)
    let formatter = DateFormatter()
    formatter.dateStyle = .medium
    formatter.timeStyle = .short
    debugInfo += "Current time: \(formatter.string(from: date)) (timestamp: \(nowTimestamp))\n"
    
    // Find next upcoming festival
    let upcomingFestivals = festivals.filter { $0.date >= nowTimestamp }
        .sorted { $0.date < $1.date }
    
    debugInfo += "Found \(upcomingFestivals.count) upcoming festivals\n"
    
    if let nextFestival = upcomingFestivals.first {
        let festivalDate = Date(timeIntervalSince1970: TimeInterval(nextFestival.date) / 1000.0)
        debugInfo += "✅ Selected: \(nextFestival.name) on \(formatter.string(from: festivalDate))\n"
        writeDebugInfo(debugInfo)
        return nextFestival
    }
    
    // If no upcoming festivals, show the first festival (likely from next year)
    if let firstFestival = festivals.sorted(by: { $0.date < $1.date }).first {
        let festivalDate = Date(timeIntervalSince1970: TimeInterval(firstFestival.date) / 1000.0)
        debugInfo += "⚠️ No upcoming festivals, using first: \(firstFestival.name) on \(formatter.string(from: festivalDate))\n"
        writeDebugInfo(debugInfo)
        return firstFestival
    }
    
    debugInfo += "❌ No festivals available at all\n"
    writeDebugInfo(debugInfo)
    return nil
}