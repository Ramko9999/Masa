import WidgetKit
import SwiftUI

// MARK: - Panchanga Data Models

struct PanchangaMasa: Codable {
    let index: Int
    let name: String
    let isLeap: Bool
}

struct PanchangaDay: Codable {
    let day: Int64 // Unix timestamp in milliseconds
    let tithi: PanchangaTithi
    let nakshatra: PanchangaNakshatra
    let masa: PanchangaMasaData
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

// MARK: - Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> PanchangaEntry {
        PanchangaEntry(date: Date(), panchanga: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (PanchangaEntry) -> ()) {
        let panchanga = loadPanchangaForDate(Date())
        let entry = PanchangaEntry(date: Date(), panchanga: panchanga)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<PanchangaEntry>) -> ()) {
        let currentDate = Date()
        let panchanga = loadPanchangaForDate(currentDate)
        let entry = PanchangaEntry(date: currentDate, panchanga: panchanga)
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
    private func loadPanchangaForDate(_ date: Date) -> PanchangaDay? {
        print("[Widget] ===== Loading panchanga for date: \(date) =====")
        
        guard let defaults = UserDefaults(suiteName: "group.com.anonymous.masa") else {
            print("[Widget] ERROR: Failed to get UserDefaults with suite 'group.com.anonymous.masa'")
            return nil
        }
        
        print("[Widget] Successfully got UserDefaults")
        
        // Get the day timestamp (midnight of the day)
        let calendar = Calendar.current
        let dayStart = calendar.startOfDay(for: date)
        let dayTimestamp = Int64(dayStart.timeIntervalSince1970 * 1000)
        let dayKey = String(dayTimestamp)
        
        print("[Widget] Day start: \(dayStart)")
        print("[Widget] Day timestamp (ms): \(dayTimestamp)")
        print("[Widget] Looking for day key: '\(dayKey)'")
        
        // Check if key exists
        if defaults.object(forKey: "panchanga_data") == nil {
            print("[Widget] ERROR: No data found for key 'panchanga_data'")
            print("[Widget] All UserDefaults keys: \(defaults.dictionaryRepresentation().keys)")
            return nil
        }
        
        print("[Widget] Found 'panchanga_data' key in UserDefaults")
        
        // Load panchanga data from UserDefaults
        guard let data = defaults.data(forKey: "panchanga_data") else {
            print("[Widget] ERROR: Failed to get data as Data type")
            if let stringValue = defaults.string(forKey: "panchanga_data") {
                print("[Widget] Found as string instead, length: \(stringValue.count)")
            }
            return nil
        }
        
        print("[Widget] Got data, size: \(data.count) bytes")
        
        // Try to decode
        guard let panchangaDict = try? JSONDecoder().decode([String: PanchangaDay].self, from: data) else {
            print("[Widget] ERROR: Failed to decode JSON data")
            if let jsonString = String(data: data, encoding: .utf8) {
                print("[Widget] Raw JSON (first 500 chars): \(String(jsonString.prefix(500)))")
            }
            return nil
        }
        
        print("[Widget] Successfully decoded JSON, found \(panchangaDict.count) days")
        print("[Widget] Available day keys: \(Array(panchangaDict.keys).sorted().prefix(5))")
        
        guard let panchanga = panchangaDict[dayKey] else {
            print("[Widget] ERROR: No panchanga found for day key: '\(dayKey)'")
            print("[Widget] All available keys: \(panchangaDict.keys.sorted())")
            return nil
        }
        
        print("[Widget] SUCCESS: Found panchanga!")
        print("[Widget] Tithi: \(panchanga.tithi.name)")
        print("[Widget] Nakshatra: \(panchanga.nakshatra.name)")
        print("[Widget] Masa: \(panchanga.masa.purnimanta.name)")
        print("[Widget] ===== End loading panchanga =====")
        
        return panchanga
    }
}

struct PanchangaEntry: TimelineEntry {
    let date: Date
    let panchanga: PanchangaDay?
}

struct widgetEntryView : View {
    var entry: PanchangaEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let panchanga = entry.panchanga {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Tithi: \(panchanga.tithi.name)")
                        .font(.headline)
                    Text("Nakshatra: \(panchanga.nakshatra.name)")
                        .font(.subheadline)
                    Text("Masa: \(panchanga.masa.purnimanta.name)")
                        .font(.subheadline)
                }
            } else {
                Text("No panchanga data available")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Panchanga")
        .description("Shows today's tithi, nakshatra, and masa")
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    PanchangaEntry(date: .now, panchanga: nil)
}