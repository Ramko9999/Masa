import WidgetKit
import SwiftUI

// MARK: - Festival Helper Functions

func formatRelativeDate(from now: Date, to festivalDate: Date) -> String {
    let calendar = Calendar.current
    let components = calendar.dateComponents([.day], from: now, to: festivalDate)
    
    guard let days = components.day else {
        return "Soon"
    }
    
    if days < 0 {
        return "Today"
    } else if days == 0 {
        return "Today"
    } else if days == 1 {
        return "In 1 day"
    } else {
        return "In \(days) days"
    }
}

// MARK: - Festival Data

struct FestivalInfo {
    let imageName: String
    let displayName: String
}

// Hardcoded to Hanuman Jayanti
let HANUMAN_JAYANTI = FestivalInfo(imageName: "hanuman_jayanti", displayName: "Hanuman Jayanti")

// MARK: - Festival Provider

struct FestivalProvider: TimelineProvider {
    func placeholder(in context: Context) -> FestivalEntry {
        FestivalEntry(
            date: Date(),
            festival: HANUMAN_JAYANTI,
            relativeDate: "Soon"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (FestivalEntry) -> ()) {
        let currentDate = Date()
        let (festivalDate, relativeDate) = loadHanumanJayantiData(currentDate: currentDate)
        let entry = FestivalEntry(
            date: currentDate,
            festival: HANUMAN_JAYANTI,
            relativeDate: relativeDate
        )
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<FestivalEntry>) -> ()) {
        let currentDate = Date()
        let (festivalDate, relativeDate) = loadHanumanJayantiData(currentDate: currentDate)
        let entry = FestivalEntry(
            date: currentDate,
            festival: HANUMAN_JAYANTI,
            relativeDate: relativeDate
        )
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
    private func loadHanumanJayantiData(currentDate: Date) -> (Date?, String) {
        guard let defaults = UserDefaults(suiteName: "group.com.anonymous.masa") else {
            return (nil, "Soon")
        }
        
        // Load festival date (stored as timestamp in milliseconds)
        var festivalDate: Date? = nil
        if let dateTimestamp = defaults.object(forKey: "festival_date_hanuman_jayanti") as? Int64 {
            festivalDate = Date(timeIntervalSince1970: TimeInterval(dateTimestamp / 1000))
        } else if let dateTimestampString = defaults.string(forKey: "festival_date_hanuman_jayanti"),
                  let dateTimestamp = Int64(dateTimestampString) {
            festivalDate = Date(timeIntervalSince1970: TimeInterval(dateTimestamp / 1000))
        }
        
        let relativeDate = festivalDate != nil ? formatRelativeDate(from: currentDate, to: festivalDate!) : "Soon"
        
        return (festivalDate, relativeDate)
    }
}

struct FestivalEntry: TimelineEntry {
    let date: Date
    let festival: FestivalInfo
    let relativeDate: String
}

struct FestivalWidgetEntryView: View {
    var entry: FestivalEntry
    @Environment(\.widgetFamily) var widgetFamily
    
    private var isSmallWidget: Bool {
        widgetFamily == .systemSmall
    }
    
    @ViewBuilder
    private func festivalImageView() -> some View {
        // Load image from widget bundle's Assets.xcassets with cover fit
        // Using standardized snake_case name matching the enum
        if let uiImage = UIImage(named: entry.festival.imageName) {
            GeometryReader { geometry in
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
            }
        } else {
            // Fallback if image not found
            Color.orange.opacity(0.3)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .overlay(
                    VStack {
                        Image(systemName: "photo")
                            .font(.largeTitle)
                            .foregroundColor(.orange)
                        Text("Image not found")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                )
        }
    }
    
    @ViewBuilder
    private func gradientOverlay() -> some View {
        // Apple-style blurred gradient overlay at the bottom
        GeometryReader { geometry in
            VStack {
                Spacer()
                ZStack {
                    // Backdrop blur with gradient
                    Rectangle()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.clear,
                                    Color(red: 83/255, green: 83/255, blue: 83/255, opacity: 0.48)
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .background(.ultraThinMaterial)
                        .brightness(-0.15)
                        .saturation(1.5)
                        .mask(
                            LinearGradient(
                                gradient: Gradient(stops: [
                                    .init(color: .clear, location: 0.06),
                                    .init(color: .black, location: 0.85)
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                }
                .frame(height: geometry.size.height * 0.8)
            }
        }
    }
    
    @ViewBuilder
    private func festivalNameView() -> some View {
        let festivalName = entry.festival.displayName
        let nameParts = festivalName.split(separator: " ")
        
        if isSmallWidget && nameParts.count > 1 {
            // Split into two lines for small widget if name has multiple words
            VStack(alignment: .leading, spacing: 0) {
                Text(String(nameParts[0]))
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Text(nameParts.dropFirst().joined(separator: " "))
                    .font(.subheadline)
                    .fontWeight(.semibold)
            }
        } else if widgetFamily == .systemLarge {
            // Larger text for large widget
            Text(festivalName)
                .font(.largeTitle)
                .fontWeight(.semibold)
        } else {
            // Single line for medium widgets
            Text(festivalName)
                .font(.title3)
                .fontWeight(.semibold)
        }
    }
    
    @ViewBuilder
    private func textOverlay() -> some View {
        VStack(alignment: .leading, spacing: widgetFamily == .systemLarge ? 4 : 2) {
            Spacer()
            
            // Festival name
            festivalNameView()
                .foregroundStyle(.white)
            
            // Relative date (hardcoded to "Soon")
            Text(entry.relativeDate)
                .font(widgetFamily == .systemLarge ? .body : .caption)
                .foregroundStyle(.white.opacity(0.9))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
        .padding(.horizontal, widgetFamily == .systemLarge ? 20 : 14)
        .padding(.bottom, widgetFamily == .systemLarge ? 20 : 14)
        .zIndex(2)
    }

    var body: some View {
        ZStack {
            // Background image that fills entire widget
            festivalImageView()
            
            // Gradient overlay at the bottom
            gradientOverlay()
            
            // Text overlay at the bottom
            textOverlay()
        }
        .ignoresSafeArea()
    }
}

struct FestivalWidget: Widget {
    let kind: String = "festivalWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: FestivalProvider()) { entry in
            FestivalWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    // Empty background to allow edge-to-edge content
                    Color.clear
                }
        }
        .contentMarginsDisabled()
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        .configurationDisplayName("Upcoming Festival")
        .description("Shows the next upcoming festival with its image")
    }
}

#Preview("Small", as: .systemSmall) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festival: HANUMAN_JAYANTI, relativeDate: "In 5 days")
}

#Preview("Medium", as: .systemMedium) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festival: HANUMAN_JAYANTI, relativeDate: "Today")
}

#Preview("Large", as: .systemLarge) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festival: HANUMAN_JAYANTI, relativeDate: "In 1 day")
}