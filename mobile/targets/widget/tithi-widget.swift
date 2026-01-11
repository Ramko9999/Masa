import WidgetKit
import SwiftUI

// MARK: - Tithi Provider

struct TithiProvider: TimelineProvider {
    func placeholder(in context: Context) -> TithiEntry {
        // Show Krishna Ashtami for preview (when adding widget)
        TithiEntry(date: Date(), tithiIndex: 22, tithiName: "krishna_ashtami", isPlaceholder: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (TithiEntry) -> ()) {
        // getSnapshot is used for previews - show Krishna Ashtami if no data
        let panchanga = loadPanchangaForDate(Date())
        let entry = panchanga != nil
            ? TithiEntry(
                date: Date(),
                tithiIndex: panchanga!.tithi.index,
                tithiName: panchanga!.tithi.name,
                isPlaceholder: false
            )
            : placeholder(in: context)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<TithiEntry>) -> ()) {
        let currentDate = Date()
        let panchanga = loadPanchangaForDate(currentDate)
        let entry = TithiEntry(
            date: currentDate,
            tithiIndex: panchanga?.tithi.index ?? 14,
            tithiName: panchanga?.tithi.name ?? "Purnima",
            isPlaceholder: panchanga == nil
        )
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
}

struct TithiEntry: TimelineEntry {
    let date: Date
    let tithiIndex: Int
    let tithiName: String
    let isPlaceholder: Bool // True when using fallback data
}

struct TithiWidgetEntryView: View {
    var entry: TithiEntry
    
    // Convert tithi index (0-29) to image name
    private func tithiImageName(for index: Int) -> String {
        // Tithi names in order (0-29)
        let tithiNames = [
            "shukla_prathama", "shukla_dwitiya", "shukla_tritiya", "shukla_chaturthi",
            "shukla_panchami", "shukla_shashthi", "shukla_saptami", "shukla_ashtami",
            "shukla_navami", "shukla_dashami", "shukla_ekadashi", "shukla_dwadashi",
            "shukla_trayodashi", "shukla_chaturdashi", "purnima",
            "krishna_prathama", "krishna_dwitiya", "krishna_tritiya", "krishna_chaturthi",
            "krishna_panchami", "krishna_shashthi", "krishna_saptami", "krishna_ashtami",
            "krishna_navami", "krishna_dashami", "krishna_ekadashi", "krishna_dwadashi",
            "krishna_trayodashi", "krishna_chaturdashi", "amavasya"
        ]
        
        // Ensure index is in valid range
        let validIndex = max(0, min(index, 29))
        return tithiNames[validIndex]
    }
    
    // Map of tithi names (with underscores) to formatted display names
    private let tithiDisplayNames: [String: String] = [
        "shukla_prathama": "Shukla Prathama",
        "shukla_dwitiya": "Shukla Dwitiya",
        "shukla_tritiya": "Shukla Tritiya",
        "shukla_chaturthi": "Shukla Chaturthi",
        "shukla_panchami": "Shukla Panchami",
        "shukla_shashthi": "Shukla Shashthi",
        "shukla_saptami": "Shukla Saptami",
        "shukla_ashtami": "Shukla Ashtami",
        "shukla_navami": "Shukla Navami",
        "shukla_dashami": "Shukla Dashami",
        "shukla_ekadashi": "Shukla Ekadashi",
        "shukla_dwadashi": "Shukla Dwadashi",
        "shukla_trayodashi": "Shukla Trayodashi",
        "shukla_chaturdashi": "Shukla Chaturdashi",
        "purnima": "Purnima",
        "krishna_prathama": "Krishna Prathama",
        "krishna_dwitiya": "Krishna Dwitiya",
        "krishna_tritiya": "Krishna Tritiya",
        "krishna_chaturthi": "Krishna Chaturthi",
        "krishna_panchami": "Krishna Panchami",
        "krishna_shashthi": "Krishna Shashthi",
        "krishna_saptami": "Krishna Saptami",
        "krishna_ashtami": "Krishna Ashtami",
        "krishna_navami": "Krishna Navami",
        "krishna_dashami": "Krishna Dashami",
        "krishna_ekadashi": "Krishna Ekadashi",
        "krishna_dwadashi": "Krishna Dwadashi",
        "krishna_trayodashi": "Krishna Trayodashi",
        "krishna_chaturdashi": "Krishna Chaturdashi",
        "amavasya": "Amavasya"
    ]
    
    @ViewBuilder
    private func moonImageView() -> some View {
        let imageName = tithiImageName(for: entry.tithiIndex)
        
        // Load image from widget bundle's Assets.xcassets
        if let uiImage = UIImage(named: imageName) {
            Image(uiImage: uiImage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            // Fallback if image not found
            Color.gray.opacity(0.3)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .overlay(
                    VStack {
                        Image(systemName: "moon")
                            .font(.largeTitle)
                            .foregroundColor(.gray)
                        Text("Image: \(imageName)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                )
        }
    }
    
    var body: some View {
        ZStack {
            // Pitch black background
            Color.black
                .ignoresSafeArea()
            
            if entry.isPlaceholder {
                // Show shared empty state view
                WidgetEmptyStateView()
            } else {
                // Show moon image and tithi when data is available
                VStack {
                    Spacer()
                    moonImageView()
                        .frame(width: 120, height: 120)
                    Spacer()
                }
                
                // Tithi label at the bottom
                VStack {
                    Spacer()
                    Text(tithiDisplayNames[entry.tithiName] ?? entry.tithiName)
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

struct TithiWidget: Widget {
    let kind: String = "tithiWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TithiProvider()) { entry in
            TithiWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    Color.black
                }
        }
        .contentMarginsDisabled()
        .supportedFamilies([.systemSmall])
        .configurationDisplayName("Current Tithi")
        .description("Shows the current tithi with moon phase")
    }
}

#Preview("Small", as: .systemSmall) {
    TithiWidget()
} timeline: {
    TithiEntry(date: .now, tithiIndex: 22, tithiName: "krishna_ashtami", isPlaceholder: false)
}