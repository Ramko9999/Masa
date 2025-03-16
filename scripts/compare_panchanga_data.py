#!/usr/bin/env python3
import json
from datetime import datetime
import statistics
from collections import defaultdict

def parse_timestamp(timestamp_str):
    """Parse timestamp string to datetime object"""
    return datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

def calculate_time_difference_minutes(time1_str, time2_str):
    """Calculate absolute difference between two timestamps in minutes"""
    if not time1_str or not time2_str:
        return None
    
    time1 = parse_timestamp(time1_str)
    time2 = parse_timestamp(time2_str)
    
    diff_seconds = abs((time2 - time1).total_seconds())
    return diff_seconds / 60  # Convert to minutes

def main():
    # Load the JSON files
    with open("scripts/panchanga_2025_original_clean.json", "r") as f:
        original_data = json.load(f)
    
    with open("scripts/panchanga_2025_computed.json", "r") as f:
        computed_data = json.load(f)
    
    # Initialize result dictionaries
    results = {
        "tithi": {"differences": [], "max_diff": 0, "avg_diff": 0},
        "nakshatra": {"differences": [], "max_diff": 0, "avg_diff": 0},
        "yoga": {"differences": [], "max_diff": 0, "avg_diff": 0},
        "sunrise": {"differences": [], "max_diff": 0, "avg_diff": 0}
    }
    
    # Track dates with large differences (> 15 minutes)
    large_diffs = {
        "tithi": defaultdict(list),
        "nakshatra": defaultdict(list),
        "yoga": defaultdict(list),
        "sunrise": defaultdict(list)
    }
    
    # Iterate through each day in the original data
    for date, original_day in original_data["daily_data"].items():
        # Skip if date not in computed data
        if date not in computed_data["daily_data"]:
            continue
        
        computed_day = computed_data["daily_data"][date]
        date_short = date.split()[0]  # Extract just the date part (YYYY-MM-DD)
        
        # Compare sunrise times
        if original_day.get("sunrise") and computed_day.get("sunrise"):
            diff = calculate_time_difference_minutes(
                original_day["sunrise"], computed_day["sunrise"]
            )
            if diff is not None:
                results["sunrise"]["differences"].append(diff)
                results["sunrise"]["max_diff"] = max(results["sunrise"]["max_diff"], diff)
                
                # Record large differences
                if diff > 15:
                    large_diffs["sunrise"][date_short].append({
                        "original": original_day["sunrise"],
                        "computed": computed_day["sunrise"],
                        "diff_minutes": diff
                    })
        
        # Compare tithis
        if original_day.get("tithi") and computed_day.get("tithi"):
            for orig_tithi in original_day["tithi"]:
                # Find matching tithi in computed data
                matching_tithis = [
                    comp_tithi for comp_tithi in computed_day["tithi"] 
                    if comp_tithi["name"] == orig_tithi["name"]
                ]
                
                for comp_tithi in matching_tithis:
                    # Compare start times
                    if orig_tithi.get("start_time") and comp_tithi.get("start_time"):
                        start_diff = calculate_time_difference_minutes(
                            orig_tithi["start_time"], comp_tithi["start_time"]
                        )
                        if start_diff is not None:
                            results["tithi"]["differences"].append(start_diff)
                            results["tithi"]["max_diff"] = max(results["tithi"]["max_diff"], start_diff)
                            
                            # Record large differences
                            if start_diff > 15:
                                large_diffs["tithi"][date_short].append({
                                    "name": orig_tithi["name"],
                                    "type": "start_time",
                                    "original": orig_tithi["start_time"],
                                    "computed": comp_tithi["start_time"],
                                    "diff_minutes": start_diff
                                })
                    
                    # Compare end times
                    if orig_tithi.get("end_time") and comp_tithi.get("end_time"):
                        end_diff = calculate_time_difference_minutes(
                            orig_tithi["end_time"], comp_tithi["end_time"]
                        )
                        if end_diff is not None:
                            results["tithi"]["differences"].append(end_diff)
                            results["tithi"]["max_diff"] = max(results["tithi"]["max_diff"], end_diff)
                            
                            # Record large differences
                            if end_diff > 15:
                                large_diffs["tithi"][date_short].append({
                                    "name": orig_tithi["name"],
                                    "type": "end_time",
                                    "original": orig_tithi["end_time"],
                                    "computed": comp_tithi["end_time"],
                                    "diff_minutes": end_diff
                                })
        
        # Compare nakshatras
        if original_day.get("nakshatra") and computed_day.get("nakshatra"):
            for orig_nakshatra in original_day["nakshatra"]:
                # Find matching nakshatra in computed data
                matching_nakshatras = [
                    comp_nakshatra for comp_nakshatra in computed_day["nakshatra"] 
                    if comp_nakshatra["name"] == orig_nakshatra["name"]
                ]
                
                for comp_nakshatra in matching_nakshatras:
                    # Compare start times
                    if orig_nakshatra.get("start_time") and comp_nakshatra.get("start_time"):
                        start_diff = calculate_time_difference_minutes(
                            orig_nakshatra["start_time"], comp_nakshatra["start_time"]
                        )
                        if start_diff is not None:
                            results["nakshatra"]["differences"].append(start_diff)
                            results["nakshatra"]["max_diff"] = max(results["nakshatra"]["max_diff"], start_diff)
                            
                            # Record large differences
                            if start_diff > 15:
                                large_diffs["nakshatra"][date_short].append({
                                    "name": orig_nakshatra["name"],
                                    "type": "start_time",
                                    "original": orig_nakshatra["start_time"],
                                    "computed": comp_nakshatra["start_time"],
                                    "diff_minutes": start_diff
                                })
                    
                    # Compare end times
                    if orig_nakshatra.get("end_time") and comp_nakshatra.get("end_time"):
                        end_diff = calculate_time_difference_minutes(
                            orig_nakshatra["end_time"], comp_nakshatra["end_time"]
                        )
                        if end_diff is not None:
                            results["nakshatra"]["differences"].append(end_diff)
                            results["nakshatra"]["max_diff"] = max(results["nakshatra"]["max_diff"], end_diff)
                            
                            # Record large differences
                            if end_diff > 15:
                                large_diffs["nakshatra"][date_short].append({
                                    "name": orig_nakshatra["name"],
                                    "type": "end_time",
                                    "original": orig_nakshatra["end_time"],
                                    "computed": comp_nakshatra["end_time"],
                                    "diff_minutes": end_diff
                                })
        
        # Compare yogas
        if original_day.get("yoga") and computed_day.get("yoga"):
            for orig_yoga in original_day["yoga"]:
                # Find matching yoga in computed data
                matching_yogas = [
                    comp_yoga for comp_yoga in computed_day["yoga"] 
                    if comp_yoga["name"] == orig_yoga["name"]
                ]
                
                for comp_yoga in matching_yogas:
                    # Compare start times
                    if orig_yoga.get("start_time") and comp_yoga.get("start_time"):
                        start_diff = calculate_time_difference_minutes(
                            orig_yoga["start_time"], comp_yoga["start_time"]
                        )
                        if start_diff is not None:
                            results["yoga"]["differences"].append(start_diff)
                            results["yoga"]["max_diff"] = max(results["yoga"]["max_diff"], start_diff)
                            
                            # Record large differences
                            if start_diff > 15:
                                large_diffs["yoga"][date_short].append({
                                    "name": orig_yoga["name"],
                                    "type": "start_time",
                                    "original": orig_yoga["start_time"],
                                    "computed": comp_yoga["start_time"],
                                    "diff_minutes": start_diff
                                })
                    
                    # Compare end times
                    if orig_yoga.get("end_time") and comp_yoga.get("end_time"):
                        end_diff = calculate_time_difference_minutes(
                            orig_yoga["end_time"], comp_yoga["end_time"]
                        )
                        if end_diff is not None:
                            results["yoga"]["differences"].append(end_diff)
                            results["yoga"]["max_diff"] = max(results["yoga"]["max_diff"], end_diff)
                            
                            # Record large differences
                            if end_diff > 15:
                                large_diffs["yoga"][date_short].append({
                                    "name": orig_yoga["name"],
                                    "type": "end_time",
                                    "original": orig_yoga["end_time"],
                                    "computed": comp_yoga["end_time"],
                                    "diff_minutes": end_diff
                                })
    
    # Calculate averages
    for category in results:
        if results[category]["differences"]:
            results[category]["avg_diff"] = statistics.mean(results[category]["differences"])
            results[category]["median_diff"] = statistics.median(results[category]["differences"])
    
    # Print results
    print("Comparison of Original vs Computed Panchanga Data for 2025")
    print("=" * 70)
    
    for category in ["tithi", "nakshatra", "yoga", "sunrise"]:
        diffs = results[category]["differences"]
        if diffs:
            print(f"\n{category.capitalize()} Comparison:")
            print(f"  Total comparisons: {len(diffs)}")
            print(f"  Maximum difference: {results[category]['max_diff']:.2f} minutes")
            print(f"  Average difference: {results[category]['avg_diff']:.2f} minutes")
            print(f"  Median difference: {results[category]['median_diff']:.2f} minutes")
            
            # Calculate distribution of differences
            under_5min = sum(1 for d in diffs if d < 5)
            under_15min = sum(1 for d in diffs if 5 <= d < 15)
            under_30min = sum(1 for d in diffs if 15 <= d < 30)
            under_60min = sum(1 for d in diffs if 30 <= d < 60)
            over_60min = sum(1 for d in diffs if d >= 60)
            
            print("  Distribution of differences:")
            print(f"    < 5 minutes: {under_5min} ({under_5min/len(diffs)*100:.1f}%)")
            print(f"    5-15 minutes: {under_15min} ({under_15min/len(diffs)*100:.1f}%)")
            print(f"    15-30 minutes: {under_30min} ({under_30min/len(diffs)*100:.1f}%)")
            print(f"    30-60 minutes: {under_60min} ({under_60min/len(diffs)*100:.1f}%)")
            print(f"    > 60 minutes: {over_60min} ({over_60min/len(diffs)*100:.1f}%)")
        else:
            print(f"\n{category.capitalize()}: No matching data found for comparison")
    
    # Print dates with large differences
    print("\n\nDates with Large Differences (> 15 minutes):")
    print("=" * 70)
    
    for category in ["tithi", "nakshatra", "yoga", "sunrise"]:
        if large_diffs[category]:
            print(f"\n{category.capitalize()} Large Differences:")
            for date, diff_list in sorted(large_diffs[category].items()):
                print(f"  Date: {date}")
                for diff_info in diff_list:
                    if category == "sunrise":
                        print(f"    Sunrise - Original: {diff_info['original']}, Computed: {diff_info['computed']}, Diff: {diff_info['diff_minutes']:.2f} minutes")
                    else:
                        print(f"    {diff_info['name']} ({diff_info['type']}) - Original: {diff_info['original']}, Computed: {diff_info['computed']}, Diff: {diff_info['diff_minutes']:.2f} minutes")
        else:
            print(f"\n{category.capitalize()}: No large differences found")

if __name__ == "__main__":
    main() 