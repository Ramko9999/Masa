import WidgetKit
import SwiftUI

// MARK: - Nakshatra Provider

struct NakshatraProvider: TimelineProvider {
    func placeholder(in context: Context) -> NakshatraEntry {
        // Show Rohini for preview (when adding widget)
        NakshatraEntry(date: Date(), nakshatraIndex: 3, nakshatraName: "rohini", isEmptyState: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (NakshatraEntry) -> ()) {
        // getSnapshot is used for previews - show placeholder if no data
        let panchanga = loadPanchangaForDate(Date())
        let entry = panchanga != nil
            ? NakshatraEntry(
                date: Date(),
                nakshatraIndex: panchanga!.nakshatra.index,
                nakshatraName: panchanga!.nakshatra.name,
                isEmptyState: false
            )
            : placeholder(in: context)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<NakshatraEntry>) -> ()) {
        let currentDate = Date()
        let panchanga = loadPanchangaForDate(currentDate)
        let entry = NakshatraEntry(
            date: currentDate,
            nakshatraIndex: panchanga?.nakshatra.index ?? 3,
            nakshatraName: panchanga?.nakshatra.name ?? "rohini",
            isEmptyState: panchanga == nil
        )
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
}

struct NakshatraEntry: TimelineEntry {
    let date: Date
    let nakshatraIndex: Int
    let nakshatraName: String
    let isEmptyState: Bool
}

struct NakshatraWidgetEntryView: View {
    var entry: NakshatraEntry
    
    // Map of nakshatra names to formatted display names
    private let nakshatraDisplayNames: [String: String] = [
        "ashwini": "Ashwini",
        "bharani": "Bharani",
        "krittika": "Krittika",
        "rohini": "Rohini",
        "mrigashira": "Mrigashira",
        "ardra": "Ardra",
        "punarvasu": "Punarvasu",
        "pushya": "Pushya",
        "ashlesha": "Ashlesha",
        "magha": "Magha",
        "purva_phalguni": "Purva Phalguni",
        "uttara_phalguni": "Uttara Phalguni",
        "hasta": "Hasta",
        "chitra": "Chitra",
        "swati": "Swati",
        "vishakha": "Vishakha",
        "anuradha": "Anuradha",
        "jyeshtha": "Jyeshtha",
        "mula": "Mula",
        "purva_ashadha": "Purva Ashadha",
        "uttara_ashadha": "Uttara Ashadha",
        "shravana": "Shravana",
        "dhanishta": "Dhanishta",
        "shatabhisha": "Shatabhisha",
        "purva_bhadrapada": "Purva Bhadrapada",
        "uttara_bhadrapada": "Uttara Bhadrapada",
        "revati": "Revati"
    ]
    
    // Dark sky gradient
    private var skyGradient: LinearGradient {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.02, green: 0.02, blue: 0.08),
                Color(red: 0.05, green: 0.05, blue: 0.15),
                Color(red: 0.08, green: 0.06, blue: 0.18)
            ]),
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    var body: some View {
        ZStack {
            // Dark sky gradient background
            skyGradient
                .ignoresSafeArea()
            
            if entry.isEmptyState {
                // Show shared empty state view
                WidgetEmptyStateView()
            } else {
                // Nakshatra label at the bottom
                VStack {
                    Spacer()
                    Text(nakshatraDisplayNames[entry.nakshatraName] ?? entry.nakshatraName.capitalized)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(.ultraThinMaterial)
                                .brightness(-0.1)
                                .saturation(1.2)
                        }
                        .padding(.bottom, 14)
                }
            }
        }
    }
}

struct NakshatraWidget: Widget {
    let kind: String = "nakshatraWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NakshatraProvider()) { entry in
            NakshatraWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    Color(red: 0.02, green: 0.02, blue: 0.08)
                }
        }
        .contentMarginsDisabled()
        .supportedFamilies([.systemSmall])
        .configurationDisplayName("Current Nakshatra")
        .description("Shows the current nakshatra")
    }
}

#Preview("Small", as: .systemSmall) {
    NakshatraWidget()
} timeline: {
    NakshatraEntry(date: .now, nakshatraIndex: 3, nakshatraName: "rohini", isEmptyState: false)
}

