// Import necessary modules and functions
import { computePanchanga } from "./api/panchanga";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { getLocation } from "./api/panchanga/location";
import { join, dirname } from "path";
import { TithiInterval } from "./api/panchanga/core/tithi";
import { NakshatraInterval } from "./api/panchanga/core/nakshatra";
import { YogaInterval } from "./api/panchanga/core/yoga";
function toIST(timestamp: number): string {
  return new Date(timestamp)
    .toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")
    .replace(", ", " ");
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
async function generatePanchangaData() {
  const timestamps = generateTimestampsFor2025IST();
  const panchangaData: Record<string, any> = {};

  console.log(`Generating data for ${timestamps.length} days in 2025`);
  console.log(`First timestamp: ${timestamps[0]}`);
  console.log(`Last timestamp: ${timestamps[timestamps.length - 1]}`);

  for (const timestamp of timestamps) {
    const panchanga = await computePanchanga(timestamp, getLocation());

    panchangaData[toIST(timestamp)] = {
      tithi: panchanga.tithi.map((t: TithiInterval) => ({
        name: t.name,
        start_time: toIST(t.startDate),
        end_time: toIST(t.endDate),
      })),
      nakshatra: panchanga.nakshatra.map((n: NakshatraInterval) => ({
        name: n.name,
        start_time: toIST(n.startDate),
        end_time: toIST(n.endDate),
      })),
      yoga: panchanga.yoga.map((y: YogaInterval) => ({
        name: y.name,
        start_time: toIST(y.startDate),
        end_time: toIST(y.endDate),
      })),
      vaara: panchanga.vaara,
      sunrise: toIST(panchanga.sunrise),
      masa: panchanga.masa.name
    };
  }

  // Define the output file path
  const outputPath = join(
    "./scripts/panchanga_2025_computed.json"
  );

  // Ensure the directory exists
  ensureDirectoryExists(outputPath);

  // Save the data to a JSON file
  writeFileSync(
    outputPath,
    JSON.stringify({ daily_data: panchangaData }, null, 2)
  );

  console.log(`Panchanga data generated and saved to ${outputPath}`);
}

// Execute the main function
generatePanchangaData().catch(console.error);
