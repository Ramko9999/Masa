#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime, timedelta
import os
import random
import pytz

# Configuration
API_URL = "https://api.production.dharmayana.in/v1/panchanga/details"
# Hardcoded location (Bangalore)
LATITUDE = 12.972
LONGITUDE = 77.594
OUTPUT_FILE = "panchanga_2025.json"
DAILY_OUTPUT_DIR = "panchanga_daily"
RETRY_DELAY = 5  # seconds between retries
MAX_RETRIES = 3  # maximum number of retries per day
RATE_LIMIT_DELAY = 2  # seconds between successful requests

# Bangalore timezone (Asia/Kolkata for Indian Standard Time)
BANGALORE_TZ = pytz.timezone('Asia/Kolkata')

# Function to get the Unix timestamp for midnight of a given date in Bangalore timezone
def get_midnight_timestamp(year, month, day):
    # Create datetime at midnight in Bangalore timezone
    dt = BANGALORE_TZ.localize(datetime(year, month, day, 0, 0, 0))
    return int(dt.timestamp())

# Function to fetch panchanga data for a specific timestamp with retry logic
def fetch_panchanga_data(timestamp, retries=0):
    params = {
        "timestamp": timestamp,
        "lat": LATITUDE,
        "long": LONGITUDE
    }
    
    try:
        print(f"Fetching data for timestamp {timestamp}...")
        response = requests.get(API_URL, params=params)
        
        # Check for rate limiting or other errors
        if response.status_code == 403 or response.status_code == 429:
            if retries < MAX_RETRIES:
                retry_delay = RETRY_DELAY * (retries + 1) + random.uniform(1, 3)
                print(f"Rate limited. Waiting {retry_delay:.1f} seconds before retry {retries + 1}/{MAX_RETRIES}...")
                time.sleep(retry_delay)
                return fetch_panchanga_data(timestamp, retries + 1)
            else:
                print(f"Max retries reached for timestamp {timestamp}. Skipping.")
                return None
        
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for timestamp {timestamp}: {e}")
        if retries < MAX_RETRIES:
            retry_delay = RETRY_DELAY * (retries + 1) + random.uniform(1, 3)
            print(f"Retrying in {retry_delay:.1f} seconds... ({retries + 1}/{MAX_RETRIES})")
            time.sleep(retry_delay)
            return fetch_panchanga_data(timestamp, retries + 1)
        return None

# Function to save a single day's data to a JSON file
def save_daily_data(timestamp, data, directory=DAILY_OUTPUT_DIR):
    # Create directory if it doesn't exist
    os.makedirs(directory, exist_ok=True)
    
    # Convert timestamp to date string for filename (in Bangalore timezone)
    date_str = datetime.fromtimestamp(timestamp, tz=BANGALORE_TZ).strftime("%Y-%m-%d")
    filename = os.path.join(directory, f"panchanga_{date_str}.json")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved data for {date_str} to {filename}")

# Function to load existing dataset if available
def load_existing_dataset():
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            print(f"Error loading existing dataset. Starting fresh.")
    
    # Initialize new dataset
    return {
        "metadata": {
            "year": 2025,
            "latitude": LATITUDE,
            "longitude": LONGITUDE,
            "generated_at": int(time.time()),
            "last_updated": int(time.time())
        },
        "daily_data": {}
    }

# Main function to fetch data for every day in 2025
def fetch_data_for_2025():
    # Load or initialize the dataset
    dataset = load_existing_dataset()
    
    # Get all days in 2025 (in Bangalore timezone)
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    current_date = start_date
    
    total_days = (end_date - start_date).days + 1
    processed_days = 0
    successful_days = 0
    
    print(f"Starting to fetch data for {total_days} days in 2025...")
    
    try:
        while current_date <= end_date:
            # Get midnight timestamp for the current date (Bangalore timezone)
            timestamp = get_midnight_timestamp(current_date.year, current_date.month, current_date.day)
            
            # Format date as YYYY-MM-DD for display
            date_key = current_date.strftime("%Y-%m-%d")
            
            # Skip if we already have this day's data
            if str(timestamp) in dataset["daily_data"]:
                print(f"Already have data for {date_key}. Skipping.")
                current_date += timedelta(days=1)
                processed_days += 1
                successful_days += 1
                continue
            
            print(f"Fetching data for {date_key} (timestamp: {timestamp})...")
            
            # Fetch data
            data = fetch_panchanga_data(timestamp)
            
            if data and data.get("status") == 200:
                # Store the data with the timestamp as the key
                dataset["daily_data"][str(timestamp)] = data["data"]
                
                # Save individual day's data
                save_daily_data(timestamp, data["data"])
                
                print(f"Successfully fetched data for {date_key}")
                successful_days += 1
                
                # Save the full dataset every 10 successful fetches
                if successful_days % 10 == 0:
                    dataset["metadata"]["last_updated"] = int(time.time())
                    save_dataset(dataset, OUTPUT_FILE)
                    print(f"Saved progress to {OUTPUT_FILE}")
            else:
                print(f"Failed to fetch data for {date_key}")
            
            # Move to the next day
            current_date += timedelta(days=1)
            processed_days += 1
            
            # Print progress
            if processed_days % 10 == 0:
                print(f"Progress: {processed_days}/{total_days} days processed ({processed_days/total_days*100:.1f}%)")
                print(f"Success rate: {successful_days}/{processed_days} ({successful_days/processed_days*100:.1f}%)")
            
            # Add a delay to avoid overwhelming the API
            delay = RATE_LIMIT_DELAY + random.uniform(0.5, 1.5)
            print(f"Waiting {delay:.1f} seconds before next request...")
            time.sleep(delay)
    
    except KeyboardInterrupt:
        print("\nProcess interrupted by user. Saving current progress...")
    
    finally:
        # Always save progress before exiting
        if successful_days > 0:
            dataset["metadata"]["last_updated"] = int(time.time())
            save_dataset(dataset, OUTPUT_FILE)
            print(f"Saved progress to {OUTPUT_FILE}")
    
    return dataset, successful_days, total_days

# Save the dataset to a JSON file
def save_dataset(dataset, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)
    print(f"Dataset saved to {filename}")

if __name__ == "__main__":
    print("Starting to fetch panchanga data for 2025...")
    dataset, successful_days, total_days = fetch_data_for_2025()
    
    print("\nData collection summary:")
    print(f"Total days processed: {total_days}")
    print(f"Successful fetches: {successful_days}")
    print(f"Success rate: {successful_days/total_days*100:.1f}%")
    
    if successful_days == total_days:
        print("Data collection complete!")
    else:
        print(f"Data collection partial. Run the script again to fetch remaining days.") 