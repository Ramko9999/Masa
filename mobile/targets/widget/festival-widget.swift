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
        return "Tomorrow"
    } else {
        return "In \(days) days"
    }
}

// MARK: - Festival Provider

struct FestivalProvider: TimelineProvider {
    func placeholder(in context: Context) -> FestivalEntry {
        let currentDate = Date()
        let (festivalDate, relativeDate) = getNarakChaturdashiData(currentDate: currentDate)
        return FestivalEntry(date: currentDate, festivalDate: festivalDate, relativeDate: relativeDate)
    }

    func getSnapshot(in context: Context, completion: @escaping (FestivalEntry) -> ()) {
        let currentDate = Date()
        let (festivalDate, relativeDate) = getNarakChaturdashiData(currentDate: currentDate)
        let entry = FestivalEntry(date: currentDate, festivalDate: festivalDate, relativeDate: relativeDate)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<FestivalEntry>) -> ()) {
        let currentDate = Date()
        let (festivalDate, relativeDate) = getNarakChaturdashiData(currentDate: currentDate)
        let entry = FestivalEntry(date: currentDate, festivalDate: festivalDate, relativeDate: relativeDate)
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
    private func getNarakChaturdashiData(currentDate: Date) -> (Date, String) {
        // Hardcoded Narak Chaturdashi date: October 31, 2024
        // You can update this date as needed
        let calendar = Calendar.current
        var components = DateComponents()
        components.year = 2024
        components.month = 10
        components.day = 31
        components.hour = 0
        components.minute = 0
        components.second = 0
        
        let festivalDate = calendar.date(from: components) ?? currentDate
        let relativeDate = formatRelativeDate(from: currentDate, to: festivalDate)
        
        return (festivalDate, relativeDate)
    }
}

struct FestivalEntry: TimelineEntry {
    let date: Date
    let festivalDate: Date
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
        if let uiImage = UIImage(named: "narak_chaturdashi") {
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
        if isSmallWidget {
            // Split into two lines for small widget
            VStack(alignment: .leading, spacing: 0) {
                Text("Narak")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Text("Chaturdashi")
                    .font(.subheadline)
                    .fontWeight(.semibold)
            }
        } else if widgetFamily == .systemLarge {
            // Larger text for large widget
            Text("Narak Chaturdashi")
                .font(.largeTitle)
                .fontWeight(.semibold)
        } else {
            // Single line for medium widgets
            Text("Narak Chaturdashi")
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
            
            // Relative date
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
    FestivalEntry(date: .now, festivalDate: Date().addingTimeInterval(86400 * 5), relativeDate: "In 5 days")
}

#Preview("Medium", as: .systemMedium) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festivalDate: Date().addingTimeInterval(86400 * 270), relativeDate: "In 9 months")
}

#Preview("Large", as: .systemLarge) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festivalDate: Date().addingTimeInterval(86400 * 30), relativeDate: "In 1 month")
}