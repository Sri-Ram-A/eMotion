from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Optional, Tuple, Dict
from datetime import datetime, timedelta
import requests
import math
# PMM TomTom API Key
# API_KEY = "MexiPby9cseRStOBWLta27NtzUcGwwFV"

API_KEY="KkA825q2KDuYOmsyo78q3EFpg8ZIi2gN"


# def get_coordinates(location):
#     """
#     Takes an address string and returns a dictionary with address, latitude, and longitude.
#     Returns None if the location cannot be found.
#     """
#     geolocator = Nominatim(user_agent="geoapi")
#     location_data = geolocator.geocode(location)
#     if location_data:
#         return (float(location_data.latitude), float(location_data.longitude)), location_data.address
#     else:
#         print(f"Could not find coordinates for '{location}'.")
#         return (None, None), None
def get_coordinates(address):
    base_url = "https://api.opencagedata.com/geocode/v1/json"
    params = {
        "q": address,
        "key": "aedbf6e3ec284f75a00c1adaf622b1cf",
        "limit": 1
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data["results"]:
            location = data["results"][0]["geometry"]
            return location["lat"], location["lng"]
    
    return None


def get_route(source, destination):
    """source and destination should be (lat, lon) tuples"""
    if not source or not destination or None in source or None in destination:
        return None, None
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{source[0]},{source[1]}:{destination[0]},{destination[1]}/json?key={API_KEY}"
    res = requests.get(url)
    if res.status_code != 200:
        return None, None
    data = res.json()
    points = [(p["latitude"], p["longitude"]) for leg in data["routes"][0]["legs"] for p in leg["points"]]
    dist = data["routes"][0]["summary"]["lengthInMeters"] / 1000
    return points, dist

def get_traffic_density(lat, lon):
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={API_KEY}&point={lat},{lon}"
    res = requests.get(url)
    if res.status_code != 200:
        return None
    data = res.json()
    try:
        ffs = data["flowSegmentData"]["freeFlowSpeed"]
        cs = data["flowSegmentData"]["currentSpeed"]
        # Density is how much speed is reduced in percentage depending on what I gave above
        return ((ffs - cs) / ffs) * 100
    except:
        return None
## This is mainly used for what I calculate fare and time
def classify_density_to_color(density):
    if density is None:
        return "green"
    if density < 25:
        return "blue"
    elif density < 50:
        return "green"
    elif density < 75:
        return "orange"
    else:
        return "red"

def parse_duration_to_minutes(duration_str):
    import re
    hours = minutes = 0
    match = re.match(r"(?:(\d+)h)?\s*(?:(\d+)m)?", duration_str.strip())
    if match:
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
    return hours * 60 + minutes


def haversine(point1, point2):
    lat1, lon1 = point1
    lat2, lon2 = point2
    R = 6371
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_fare_and_time(route_points, distance_km, start_time_str):
    if not route_points:
        return None, None, None, "No route points provided"
    base_fare = 30
    rate_per_km = 15
    speed_map = {"blue": 40, "green": 30, "orange": 20, "red": 10}
    total_time_hours = 0

    # Sample every N points to reduce API calls (max 10 samples)
    # I sampled with rate of 10 .. You can change
    sample_rate = max(1, len(route_points) // 100)
    print("Sample rate:",sample_rate)

    # Calculate travel time by segments between sampled points
    for i in range(0, len(route_points) - 1, sample_rate):
        start_pt = route_points[i]
        end_idx = min(i + sample_rate, len(route_points) - 1)
        end_pt = route_points[end_idx]
        segment_distance = haversine(start_pt, end_pt)
        mid_pt = ((start_pt[0] + end_pt[0]) / 2, (start_pt[1] + end_pt[1]) / 2)

        density = get_traffic_density(mid_pt[0], mid_pt[1])
        color = classify_density_to_color(density)
        speed = speed_map[color]
        ## Segmented time is based on haversine technique .....
        total_time_hours += segment_distance / speed

    # Count colors for surge multiplier using sampled points
    sampled_points = route_points[::sample_rate]
    color_counts = {"blue": 0, "green": 0, "orange": 0, "red": 0}

    for lat, lon in sampled_points:
        density = get_traffic_density(lat, lon)
        c = classify_density_to_color(density)
        color_counts[c] += 1

    total_points = sum(color_counts.values()) or 1
    ## Multiplier Sri Ram will replace with max(0,(P-D)/D)....
    multiplier = 1.4 * (
        color_counts["blue"] * 1 +
        color_counts["green"] * 1.2 +
        color_counts["orange"] * 1.5 +
        color_counts["red"] * 2
    ) / total_points

    fare = base_fare + (distance_km * rate_per_km * multiplier)

    try:
        start_dt = datetime.strptime(start_time_str, "%H:%M")
    except:
        return None, None, None, "Invalid start time format. Use HH:MM."

    arrival_dt = start_dt + timedelta(hours=total_time_hours)
    eta = arrival_dt.strftime("%H:%M")

    return round(fare, 2), round(multiplier, 2), eta, None


def calculate_trip_details(details1,details2,info1: tuple, info2: tuple, start_time: str = "09:30") -> dict:
    """
    Calculate trip details between two cities.
    
    Args:
        city_a (str): Source city/location name
        city_b (str): Destination city/location name
        start_time (str): Start time in "HH:MM" format (default: "09:30")
    
    Returns:
        dict: Dictionary containing trip details with the following keys:
            - estimated_duration
            - distance
            - price
            - source_latitude
            - source_longitude
            - source_details
            - destination_latitude
            - destination_longitude
            - destination_details
            - error (if any error occurred)
    """
    result = {
        'estimated_duration': None,
        'distance': None,
        'price': None,
        'source_latitude': None,
        'source_longitude': None,
        'source_details':None,
        'destination_details':None,
        'destination_latitude': None,
        'destination_longitude': None,
        'error': None
    }

    if info1 is None or info2 is None:
        result['error'] = "Error retrieving coordinates."
        return result

    # Store coordinates in result
    result['source_latitude'] = info1[0]
    result['source_longitude'] = info1[1]
    result['destination_latitude'] = info2[0]
    result['destination_longitude'] = info2[1]
    result['source_details']=details1
    result['destination_details']=details2

    # Get route information
    route_pts, distance = get_route(info1, info2)
    if not route_pts:
        result['error'] = "Error fetching route."
        return result

    result['distance'] = distance

    # Calculate fare and ETA
    fare, multiplier, eta, error = calculate_fare_and_time(route_pts, distance, start_time)
    if error:
        result['error'] = error
        return result

    result['price'] = fare

    # Calculate duration
    try:
        start_dt = datetime.strptime(start_time, "%H:%M")
        eta_dt = datetime.strptime(eta, "%H:%M")
        
        if eta_dt < start_dt:
            eta_dt += timedelta(days=1)
            
        duration = eta_dt - start_dt
        duration_str = f"{duration.seconds // 3600}h {(duration.seconds // 60) % 60}m"
        result['estimated_duration'] = duration_str
    except Exception as e:
        result['error'] = f"Error calculating duration: {str(e)}"
        return result
    """
    {
    'estimated_duration': '0h 39m', 
    'distance': 26.709, 'price': 611.28, 
    'source_latitude': 12.924066, 'source_longitude': 77.4982484, 
    'source_details': 'A: RV College of Engineering, Bangalore-Mysore Road, BDA Jnanabharathi Residential Enclave, Kengeri, Mailasandra, Bangalore South, Bengaluru Urban, Karnataka, 560059, India',
    'destination_details': 'Krishnarajapuram, Bangalore East, Bengaluru Urban, Karnataka, 560036, India', 
    'destination_latitude': 13.007516, 'destination_longitude': 77.695935, 
    'error': None
    }
    """
    print("calculate_trip_details executed")
    return result
# Example usage
if __name__ == "__main__":
    city_a = "Mantri Mall"
    city_b = "KR Puram"
    start_time = "09:30"
    current_time = datetime.now()
    # Format the time as a string in "09:30" format
    start_time = current_time.strftime("%H:%M")
    # Rider sends request
    info1,details1=get_coordinates(city_a)
    info2,details2=get_coordinates(city_b)
    ride_data = helper.calculate_trip_details(details1,details2,info1,info2,start_time) 


