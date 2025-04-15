import requests
import json
from datetime import datetime, timedelta, UTC
import os
import statistics

# API Configuration
API_URL = "https://starscape.infegy.com/api/query/agg/"

def get_api_token():
    """Read API token from file"""
    try:
        with open('api_token.txt', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        print("Error: api_token.txt file not found")
        exit(1)
    except Exception as e:
        print(f"Error reading API token: {str(e)}")
        exit(1)

API_TOKEN = get_api_token()

BASE_QUERY = {
    "op": "and",
    "values": [
        {
            "op": "contains",
            "field": "country",
            "value": "us"
        },
        {
            "op": ">",
            "field": "published",
            "value": "-P2M"
        },
        {
            "op": "not",
            "values": [
                {
                    "op": "contains",
                    "field": "channels",
                    "values": ["lexisnexis"]
                }
            ]
        }
    ]
}

# Query IDs and their corresponding metrics and aggregations
QUERY_METRICS = {
    "q_WoKuQA6Dr45": {
        "metric_name": "Total Volume",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    },
    "q_eT1MK2IoiMc": {
        "metric_name": "hope",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    },
    "q_ghefZgLHgh4": {
        "metric_name": "despair",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    },
    "q_umyTj9rRaE4": {
        "metric_name": "esi",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    },
    "q_BmuWhdVqEd4": {
        "metric_name": "financialAnxiety",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
                "aggs": {
                    "sentiment": {
                        "op": "keyword",
                        "field": "sentiment"
                    }
                }
            }
        }
    },
    "q_yyQWpqeTiAj": {
        "metric_name": "layoffMentions",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    },
    "q_3G5HeNu0XK6": {
        "metric_name": "consumerBehavior",
        "aggs": {
            "daily_volume": {
                "op": "histogram",
                "field": "published",
                "interval": "day",
            }
        }
    }
}

def fetch_infegy_data(query_id):
    """Fetch sentiment data from Infegy API for a specific query"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}"
    }
    
    payload = {
        "dataset_id": "ds_gj4u3F40SLa",
        "timezone": "Etc/UTC",
        "aggs": QUERY_METRICS[query_id]["aggs"],
        "query": BASE_QUERY
    }
    
    url = API_URL if query_id == "q_WoKuQA6Dr45" else f"{API_URL}/{query_id}"
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def calculate_percentage(mention_count, total_volume):
    """Calculate percentage of total volume"""
    return (mention_count / total_volume * 100) if total_volume > 0 else 0

def process_query(query_id, total_volume_data=None):
    """Process a single query and return metric values and labels"""
    try:
        print(f"Processing query: {query_id}")
        data = fetch_infegy_data(query_id)
        metric_values = []
        labels = []
        raw_counts = []
        
        metric_name = QUERY_METRICS[query_id]["metric_name"]
        print(f"Processing metric: {metric_name}")
        
        is_ratio_metric = metric_name in ["hope", "despair"]
        is_percentage_metric = metric_name in ["layoffMentions", "consumerBehavior", "hope", "despair", "esi", "financialAnxiety"]
        
        for day in reversed(data['daily_volume']['_buckets']):
            date = datetime.fromisoformat(day['_key'].replace('Z', '+00:00'))
            labels.append(date.strftime("%b %d"))
            
            mention_count = day['_count']
            
            if is_ratio_metric:
                raw_counts.append(mention_count)
            
            if is_percentage_metric and total_volume_data:
                total_volume = next(
                    (bucket['_count'] for bucket in total_volume_data['daily_volume']['_buckets'] 
                     if bucket['_key'] == day['_key']),
                    0
                )
                value = calculate_percentage(mention_count, total_volume)
                metric_values.append(round(value, 3))
            else:
                metric_values.append(mention_count)
        
        print(f"Processed {len(metric_values)} values for {metric_name}")
        return metric_values, labels, raw_counts if is_ratio_metric else None
    except Exception as e:
        print(f"Error processing query {query_id}: {str(e)}")
        return None, None, None

def update_data_file(metric_data):
    """Update data.json with new metric data"""
    try:
        print("Updating data.json file...")
        try:
            with open('data.json', 'r') as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            print("Creating new data.json file")
            data = {"lastUpdated": "", "metrics": {}}
        
        if 'metrics' not in data:
            data['metrics'] = {}
        
        # Remove any existing hopeDispair metric
        if 'hopeDispair' in data['metrics']:
            print("Removing old hopeDispair metric")
            del data['metrics']['hopeDispair']
        
        # Update metrics
        for metric_name, (values, labels) in metric_data.items():
            print(f"Updating metric: {metric_name}")
            if metric_name not in data['metrics']:
                print(f"Creating new metric entry for: {metric_name}")
                data['metrics'][metric_name] = {}
            
            data['metrics'][metric_name].update({
                'current': values[-1],
                'trend': values,
                'labels': labels
            })
        
        data['lastUpdated'] = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        with open('data.json', 'w') as f:
            json.dump(data, f, indent=4)
        print("Data.json file updated successfully!")
        
        # Verify the file was written correctly
        with open('data.json', 'r') as f:
            verify_data = json.load(f)
            print(f"Verification: File contains {len(verify_data['metrics'])} metrics")
            if 'hopeDespairRatio' in verify_data['metrics']:
                print(f"Verification: hopeDespairRatio metric exists with {len(verify_data['metrics']['hopeDespairRatio']['trend'])} values")
            if 'hopeDispair' in verify_data['metrics']:
                print("WARNING: hopeDispair metric still exists!")
    except Exception as e:
        print(f"Error updating data.json: {str(e)}")

def calculate_ratio_metric(hope_counts, despair_counts, labels):
    """Calculate the hope/despair ratio metric"""
    ratio_values = []
    for h, d in zip(hope_counts, despair_counts):
        ratio = h / d if d > 0 else 0
        ratio_values.append(round(ratio, 3))
    return ratio_values, labels

def main():
    try:
        print("Starting data update process...")
        metric_data = {}
        raw_counts = {}
        
        print("Fetching total volume data...")
        total_volume_data = fetch_infegy_data("q_WoKuQA6Dr45")
        
        for query_id, query_config in QUERY_METRICS.items():
            if query_id == "q_WoKuQA6Dr45":
                continue
                
            values, labels, counts = process_query(query_id, total_volume_data)
            if values and labels:
                metric_name = query_config["metric_name"]
                metric_data[metric_name] = (values, labels)
                if counts is not None:
                    raw_counts[metric_name] = counts
        
        if "hope" in raw_counts and "despair" in raw_counts:
            print("Calculating hope/despair ratio...")
            ratio_values, labels = calculate_ratio_metric(
                raw_counts["hope"],
                raw_counts["despair"],
                metric_data["hope"][1]  # Use hope's labels
            )
            metric_data["hopeDespairRatio"] = (ratio_values, labels)
            print(f"Hope/Despair ratio calculated: {ratio_values[-1]}")
        
        if metric_data:
            update_data_file(metric_data)
            print("Data update completed successfully!")
        else:
            print("No data was updated.")
            
    except Exception as e:
        print(f"Error updating data: {str(e)}")

if __name__ == "__main__":
    main() 