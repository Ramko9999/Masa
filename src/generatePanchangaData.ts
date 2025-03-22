// Import necessary modules and functions
import { computePanchanga } from "./api/panchanga";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { getLocation } from "./api/panchanga/location";
import { join, dirname } from "path";
import { TithiInterval } from "./api/panchanga/core/tithi";
import { NakshatraInterval } from "./api/panchanga/core/nakshatra";
import { YogaInterval } from "./api/panchanga/core/yoga";
function toUTC(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = (date.getHours() % 12 || 12).toString().padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
}

// Function to generate Unix timestamps for each day in 2025 at midnight IST
function generateTimestampsFor2025IST(): number[] {
  const timestamps: number[] = [];

  // Start with Jan 1, 2025 at midnight IST (which is Dec 31, 2024 18:30 UTC)
  const startDate = new Date(Date.UTC(2024, 11, 31, 18, 30, 0));

  // End with Dec 31, 2025
  const endDate = new Date(Date.UTC(2025, 11, 31, 18, 30, 0));

  // Generate a timestamp for each day
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Convert to Unix timestamp in seconds (not milliseconds)
    const timestamp = Math.floor(currentDate.getTime() / 1000) * 1000;
    timestamps.push(timestamp);

    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return timestamps;
}

// Ensure directory exists
function ensureDirectoryExists(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Main function to compute panchanga data for each day
function generatePanchangaData() {
  const timestamps = generateTimestampsFor2025IST();
  const panchangaData: Record<string, any> = {};

  console.log(`Generating data for ${timestamps.length} days in 2025`);
  console.log(`First timestamp: ${timestamps[0]}`);
  console.log(`Last timestamp: ${timestamps[timestamps.length - 1]}`);

  for (const timestamp of timestamps) {
    console.log(`Generating data for ${toUTC(timestamp)}`);
    const panchanga = computePanchanga(timestamp, getLocation());

    panchangaData[toUTC(timestamp)] = {
      tithi: panchanga.tithi.map((t: TithiInterval) => ({
        name: t.name,
        start_time: toUTC(t.startDate),
        end_time: toUTC(t.endDate),
      })),
      nakshatra: panchanga.nakshatra.map((n: NakshatraInterval) => ({
        name: n.name,
        start_time: toUTC(n.startDate),
        end_time: toUTC(n.endDate),
      })),
      yoga: panchanga.yoga.map((y: YogaInterval) => ({
        name: y.name,
        start_time: toUTC(y.startDate),
        end_time: toUTC(y.endDate),
      })),
      vaara: panchanga.vaara,
      sunrise: toUTC(panchanga.sunrise),
      masa: {
        amanta: panchanga.masa.amanta.name,
        purnima: panchanga.masa.purnimanta.name,
      },
    };
  }

  // Define the output file path
  const outputPath = join("../scripts/panchanga_2025_computed.json");

  // Ensure the directory exists
  ensureDirectoryExists(outputPath);

  // Save the data to a JSON file
  writeFileSync(
    outputPath,
    JSON.stringify({ daily_data: panchangaData }, null, 2)
  );

  console.log(`Panchanga data generated and saved to ${outputPath}`);
}

generatePanchangaData();

