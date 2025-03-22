#!/usr/bin/env python3
import json
from datetime import datetime, timedelta
import statistics
from collections import defaultdict

def parse_timestamp(timestamp_str):
    """Parse timestamp string to datetime object"""
    return datetime.strptime(timestamp_str, "%Y-%m-%d %I:%M %p")

def normalize_tithi(tithi: str):
    if tithi == "Shukla Purnima" or tithi == "Krishna Purnima":
        return "Purnima"
    if tithi == "Krishna Amavasya" or tithi == "Shukla Amavasya":
        return "Amavasya"
    return tithi

def calculate_time_difference_minutes(time1_str, time2_str):
    """Calculate absolute difference between two timestamps in minutes"""
    if not time1_str or not time2_str:
        return None
    
    time1 = parse_timestamp(time1_str)
    time2 = parse_timestamp(time2_str)
    
    diff_seconds = abs((time2 - time1).total_seconds())
    return diff_seconds / 60  # Convert to minutes

def compare_times(original_time: str, computed_time: str, results: dict, category: str):
    """Compare two times and update results"""
    diff = calculate_time_difference_minutes(original_time, computed_time)
    results[category]["differences"].append(diff)
    results[category]["max_diff"] = max(results[category]["max_diff"], diff)

def compare_event(original_event: dict, computed_event: dict, results: dict, category: str):
    """Compare start and end times for a single event"""
    compare_times(original_event["start_time"], computed_event["start_time"], results, category)
    compare_times(original_event["end_time"], computed_event["end_time"], results, category)

def compare_events(original_events: list, computed_events: list, results: dict, category: str, date: str):
    """Compare lists of events (tithi/nakshatra/yoga)"""
    base_date = parse_timestamp(date)
    next_day = base_date + timedelta(days=1)


    original_events = list(filter(lambda x: parse_timestamp(x["start_time"]) < next_day, original_events))
    original_events.sort(key=lambda x: parse_timestamp(x["start_time"]))

    orig_event_names = [normalize_tithi(e["name"]) for e in original_events]
    comp_event_names = [e["name"] for e in computed_events]
    if not set(orig_event_names).issubset(set(comp_event_names)):
        print(f"Names mismatch for {category} on {date}: Original {orig_event_names}, Computed {comp_event_names}")
        return
    
    for orig_event in original_events:            
        matching_events = [
            comp_event for comp_event in computed_events 
            if comp_event["name"] == orig_event["name"]
        ]
            
        for comp_event in matching_events:
            compare_event(orig_event, comp_event, results, category)

def compare_day(original_day: dict, computed_day: dict, results: dict, date: str):
    """Compare all aspects of a single day"""
    # Check masa mismatches
    for masa_type in ['amanta', 'purnima']:
        if original_day["masa"][masa_type] != computed_day["masa"][masa_type]:
            print(f"Masa mismatch on {date} ({masa_type}): Original={original_day['masa'][masa_type]}, Computed={computed_day['masa'][masa_type]}")
            results["masa_mismatches"] += 1

    compare_times(original_day["sunrise"], computed_day["sunrise"], results, "sunrise")
    
    for category in ["tithi", "nakshatra", "yoga"]:
        compare_events(original_day[category], computed_day[category], results, category, date)

def main():
    # Load the JSON files
    with open("./panchanga_2025_original_clean.json", "r") as f:
        original_data = json.load(f)
    
    with open("./panchanga_2025_computed.json", "r") as f:
        computed_data = json.load(f)
    
    # Initialize result dictionary
    results = {
        category: {"differences": [], "max_diff": 0, "avg_diff": 0}
        for category in ["tithi", "nakshatra", "yoga", "sunrise"]
    }
    results["masa_mismatches"] = 0  # Add counter for masa mismatches
    
    # Compare each day
    for date, original_day in list(original_data["daily_data"].items()):
        if date in computed_data["daily_data"]:
            compare_day(original_day, computed_data["daily_data"][date], results, date)
    
    # Calculate statistics
    for category in ["tithi", "nakshatra", "yoga", "sunrise"]:
        if results[category]["differences"]:
            results[category]["avg_diff"] = statistics.mean(results[category]["differences"])
            results[category]["median_diff"] = statistics.median(results[category]["differences"])
    # Print results
    print_results(results)

def print_results(results: dict):
    """Print comparison results"""
    print("Comparison of Original vs Computed Panchanga Data for 2025")
    print("=" * 70)
    

    print("Masa mismatches: ", results["masa_mismatches"])

    for category in ["tithi", "nakshatra", "yoga", "sunrise"]:
        diffs = results[category]["differences"]
        print(f"\n{category.capitalize()} Comparison:")
        print(f"  Total comparisons: {len(diffs)}")
        print(f"  Maximum difference: {results[category]['max_diff']:.2f} minutes")
        print(f"  Average difference: {results[category]['avg_diff']:.2f} minutes")
        print(f"  Median difference: {results[category]['median_diff']:.2f} minutes")
            
        # Print distribution
        ranges = [(0, 5), (5, 15), (15, 30), (30, 60), (60, float('inf'))]
        labels = ["< 5", "5-15", "15-30", "30-60", "> 60"]
            
        print(f"{category.capitalize()} distribution of differences:")
        for (start, end), label in zip(ranges, labels):
            count = sum(1 for d in diffs if start <= d < end)
            percentage = (count / len(diffs)) * 100
            print(f"    {label} minutes: {count} ({percentage:.1f}%)")

if __name__ == "__main__":
    main() 