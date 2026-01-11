import WidgetKit
import SwiftUI

// MARK: - Tithi Provider

struct TithiProvider: TimelineProvider {
    func placeholder(in context: Context) -> TithiEntry {
        TithiEntry(date: Date(), tithiName: "Krishna Ekadashi")
    }

    func getSnapshot(in context: Context, completion: @escaping (TithiEntry) -> ()) {
        let entry = TithiEntry(date: Date(), tithiName: "Krishna Ekadashi")
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<TithiEntry>) -> ()) {
        let currentDate = Date()
        let entry = TithiEntry(date: currentDate, tithiName: "Krishna Ekadashi")
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct TithiEntry: TimelineEntry {
    let date: Date
    let tithiName: String
}

struct TithiWidgetEntryView: View {
    var entry: TithiEntry
    
    @ViewBuilder
    private func moonImageView() -> some View {
        // Load image from widget bundle's Assets.xcassets
        if let uiImage = UIImage(named: "krishna_ekadashi") {
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
                        Text("Image not found")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                )
        }
    }
    
    @ViewBuilder
    private func liquidGlassLabel() -> some View {
        Text(entry.tithiName)
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
    }
    
    var body: some View {
        ZStack {
            // Pitch black background
            Color.black
                .ignoresSafeArea()
            
            // Centered moon image
            VStack {
                Spacer()
                moonImageView()
                    .frame(width: 120, height: 120)
                Spacer()
            }
            
            // Liquid glass label at the bottom
            VStack {
                Spacer()
                liquidGlassLabel()
                    .padding(.bottom, 14)
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
        .description("Shows the current tithi with moon phase image")
    }
}

#Preview("Small", as: .systemSmall) {
    TithiWidget()
} timeline: {
    TithiEntry(date: .now, tithiName: "Krishna Ekadashi")
}