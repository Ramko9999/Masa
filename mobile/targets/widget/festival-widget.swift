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
    // Helper to create Diwali entry (for previews/placeholders)
    private func diwaliEntry() -> FestivalEntry {
        let now = Date()
        let futureDate = Calendar.current.date(byAdding: .day, value: 5, to: now) ?? now
        let relativeDate = formatRelativeDate(from: now, to: futureDate)
        
            return FestivalEntry(
                date: now,
                festivalName: "diwali",
                festivalDate: futureDate,
                relativeDate: relativeDate,
                isEmptyState: false
            )
    }
    
    func placeholder(in context: Context) -> FestivalEntry {
        // Always show Diwali for preview
        return diwaliEntry()
    }

    func getSnapshot(in context: Context, completion: @escaping (FestivalEntry) -> ()) {
        // Try to load next upcoming festival, fallback to Diwali
        let now = Date()
        if let nextFestival = loadNextFestival(from: now) {
            let festivalDate = Date(timeIntervalSince1970: TimeInterval(nextFestival.date) / 1000.0)
            let relativeDate = formatRelativeDate(from: now, to: festivalDate)
            
            completion(FestivalEntry(
                date: now,
                festivalName: nextFestival.name,
                festivalDate: festivalDate,
                relativeDate: relativeDate,
                isEmptyState: false
            ))
        } else {
            // Fallback to Diwali for preview
            completion(diwaliEntry())
        }
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<FestivalEntry>) -> ()) {
        let now = Date()
        
        // Try to load next upcoming festival
        let entry: FestivalEntry
        if let nextFestival = loadNextFestival(from: now) {
            let festivalDate = Date(timeIntervalSince1970: TimeInterval(nextFestival.date) / 1000.0)
            let relativeDate = formatRelativeDate(from: now, to: festivalDate)
            
            entry = FestivalEntry(
                date: now,
                festivalName: nextFestival.name,
                festivalDate: festivalDate,
                relativeDate: relativeDate,
                isEmptyState: false
            )
        } else {
            // Show empty state if no festival data
            entry = FestivalEntry(
                date: now,
                festivalName: "",
                festivalDate: now,
                relativeDate: "",
                isEmptyState: true
            )
        }
        
        // Refresh at midnight
        let calendar = Calendar.current
        let nextUpdate = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: now)!)
        
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct FestivalEntry: TimelineEntry {
    let date: Date
    let festivalName: String
    let festivalDate: Date
    let relativeDate: String
    let isEmptyState: Bool
}

struct FestivalWidgetEntryView: View {
    var entry: FestivalEntry
    @Environment(\.widgetFamily) var widgetFamily
    
    private var isSmallWidget: Bool {
        widgetFamily == .systemSmall
    }
    
    @ViewBuilder
    private func festivalImageView() -> some View {
        // Load image from widget bundle with cover fit
        GeometryReader { geometry in
            if let uiImage = UIImage(named: entry.festivalName) {
                Image(uiImage: uiImage)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
            } else {
                // Fallback if image not found in bundle
                Color.black
                    .frame(width: geometry.size.width, height: geometry.size.height)
            }
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
        let displayName = entry.festivalName.replacingOccurrences(of: "_", with: " ").capitalized
        
        if isSmallWidget {
            // Single line with smaller font for small widget
            Text(displayName)
                .font(.subheadline)
                .fontWeight(.semibold)
                .lineLimit(1)
        } else if widgetFamily == .systemLarge {
            // Larger text for large widget
            Text(displayName)
                .font(.largeTitle)
                .fontWeight(.semibold)
        } else {
            // Single line for medium widgets
            Text(displayName)
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
            
            // Relative date underneath
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
            if entry.isEmptyState {
                // Show empty state when no data
                Color.black
                    .ignoresSafeArea()
                WidgetEmptyStateView()
            } else {
                // Background image that fills entire widget
                festivalImageView()
                
                // Gradient overlay at the bottom
                gradientOverlay()
                
                // Text overlay at the bottom
                textOverlay()
            }
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
                    Color.clear
                }
        }
        .contentMarginsDisabled()
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        .configurationDisplayName("Upcoming Festival")
        .description("Shows the next upcoming festival")
    }
}

#Preview("Small", as: .systemSmall) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festivalName: "diwali", festivalDate: Date().addingTimeInterval(86400 * 5), relativeDate: "In 5 days", isEmptyState: false)
}

#Preview("Medium", as: .systemMedium) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festivalName: "holi", festivalDate: Date().addingTimeInterval(86400 * 270), relativeDate: "In 9 months", isEmptyState: false)
}

#Preview("Large", as: .systemLarge) {
    FestivalWidget()
} timeline: {
    FestivalEntry(date: .now, festivalName: "ganesh_chaturthi", festivalDate: Date().addingTimeInterval(86400 * 30), relativeDate: "In 1 month", isEmptyState: false)
}