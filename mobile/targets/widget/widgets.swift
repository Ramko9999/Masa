import WidgetKit
import SwiftUI

// Data models are defined in records.swift

// MARK: - Provider

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> PanchangaEntry {
    PanchangaEntry(date: Date(), panchanga: nil)
  }

  func getSnapshot(in context: Context, completion: @escaping (PanchangaEntry) -> Void) {
    let panchanga = loadPanchangaForDate(Date())
    let entry = PanchangaEntry(date: Date(), panchanga: panchanga)
    completion(entry)
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<PanchangaEntry>) -> Void) {
    let currentDate = Date()
    let panchanga = loadPanchangaForDate(currentDate)
    let entry = PanchangaEntry(date: currentDate, panchanga: panchanga)

    // Refresh at midnight
    let calendar = Calendar.current
    let nextUpdate = calendar.startOfDay(
      for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)

    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    completion(timeline)
  }
}

struct PanchangaEntry: TimelineEntry {
  let date: Date
  let panchanga: PanchangaDay?
}

struct widgetEntryView: View {
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
