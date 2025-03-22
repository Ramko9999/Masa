#!/usr/bin/env python3
import json
import os
from datetime import datetime

# Configuration
INPUT_FILE = "./panchanga_2025_original.json"
OUTPUT_FILE = "./panchanga_2025_original_clean.json"

# Bangalore timezone
def format_timestamp(timestamp):
    """Convert millisecond timestamp to formatted datetime string in Bangalore time"""
    if not timestamp:
        return ""
    
    # Convert to datetime in Bangalore timezone
    dt = datetime.fromtimestamp(timestamp)
    
    # Format as string (YYYY-MM-DD HH:MM:SS)
    return dt.strftime("%Y-%m-%d %I:%M %p")

def clean_panchanga_data():
    # Check if input file exists
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file {INPUT_FILE} not found.")
        return False
    
    # Load the original data
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            original_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from {INPUT_FILE}: {e}")
        return False
    
    # Check if daily_data exists in the original data
    if "daily_data" not in original_data:
        print("Error: 'daily_data' not found in the input file.")
        return False
    
    # Initialize the cleaned data structure
    cleaned_data = {
        "daily_data": {}
    }
    
    # Process each day's data
    for timestamp_str, day_data in original_data["daily_data"].items():
        # Convert timestamp to datetime in Bangalore timezone
        timestamp = int(timestamp_str)
        formatted_timestamp = format_timestamp(timestamp)
        
        # Extract and format tithi data
        tithi_list = []
        if "tithi" in day_data:
            for tithi in day_data["tithi"]:
                paksha = day_data.get("paksha", "")
                name = tithi.get("name", "")
                
                # Format name with paksha
                formatted_name = name
                if paksha:
                    prefix = "Krishna " if paksha == "Krishna Paksha" else "Shukla "
                    formatted_name = prefix + name
                
                # Format start and end times
                start_time = format_timestamp(tithi.get("start_time"))
                end_time = format_timestamp(tithi.get("end_time"))
                
                tithi_list.append({
                    "name": formatted_name,
                    "start_time": start_time,
                    "end_time": end_time
                })
        
        # Extract and format nakshatra data
        nakshatra_list = []
        if "nakshatra" in day_data:
            for nakshatra in day_data["nakshatra"]:
                # Format start and end times
                start_time = format_timestamp(nakshatra.get("start_time"))
                end_time = format_timestamp(nakshatra.get("end_time"))
                
                nakshatra_list.append({
                    "name": nakshatra.get("name", ""),
                    "start_time": start_time,
                    "end_time": end_time
                })
        
        # Extract and format yoga data
        yoga_list = []
        if "yoga" in day_data:
            for yoga in day_data["yoga"]:
                # Format start and end times
                start_time = format_timestamp(yoga.get("start_time"))
                end_time = format_timestamp(yoga.get("end_time"))
                
                yoga_list.append({
                    "name": yoga.get("name", ""),
                    "start_time": start_time,
                    "end_time": end_time
                })
        
        # Extract vaara (weekday)
        vaara = ""
        if "vaara" in day_data:
            vaara = day_data["vaara"].get("name", "")
        
        # Extract sunrise time and format it
        sunrise = ""
        if "sun" in day_data and "rise" in day_data["sun"]:
            sunrise = format_timestamp(day_data["sun"]["rise"])
        
        # Extract masa (lunar month)
        masa = ""
        if "masa" in day_data and "amanta" in day_data["masa"]:
            masa = day_data["masa"]["amanta"]
        
        # Add the cleaned data for this day
        cleaned_data["daily_data"][formatted_timestamp] = {
            "tithi": tithi_list,
            "nakshatra": nakshatra_list,
            "yoga": yoga_list,
            "vaara": vaara,
            "sunrise": sunrise,
            "masa": masa
        }
    
    # Write the cleaned data to the output file
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully cleaned panchanga data and saved to {OUTPUT_FILE}")
        return True
    except Exception as e:
        print(f"Error writing to {OUTPUT_FILE}: {e}")
        return False

if __name__ == "__main__":
    print("Starting to clean panchanga data...")
    success = clean_panchanga_data()
    if success:
        print("Panchanga data cleaning completed successfully.")
    else:
        print("Panchanga data cleaning failed.") 