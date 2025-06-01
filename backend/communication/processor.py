
import requests
from geopy.geocoders import Nominatim
from loguru import logger

# PMM TomTom API Key
API_KEY = "MexiPby9cseRStOBWLta27NtzUcGwwFV"

# Optional: to store global route for traffic visualization
global_route_points = []

def get_location_details(address)->dict:
    """Takes an address and returns location info as a dictionary."""
    geolocator = Nominatim(user_agent="geoapi")
    location_data = geolocator.geocode(address)
    if location_data:
        info = {
            "address": location_data.address,
            "latitude": location_data.latitude,
            "longitude": location_data.longitude,
        }
        return info
    else:
        print(f"Could not find coordinates for {address}.")
        return None

def get_route(source, destination):
    """Returns route points and distance between two coordinates."""
    URL = f"https://api.tomtom.com/routing/1/calculateRoute/{source[0]},{source[1]}:{destination[0]},{destination[1]}/json?key={API_KEY}"
    response = requests.get(URL)
    if response.status_code == 200:
        data = response.json()
        route_points = [(p["latitude"], p["longitude"]) for leg in data["routes"][0]["legs"] for p in leg["points"]]
        distance_km = data["routes"][0]["summary"]["lengthInMeters"] / 1000
        return route_points, distance_km
    else:
        print("Error fetching route:", response.status_code)
        return None, None

def get_traffic_density(lat, lon):
    """Returns traffic density % at a lat-lon."""
    TRAFFIC_URL = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={API_KEY}&point={lat},{lon}"
    response = requests.get(TRAFFIC_URL)

    if response.status_code == 200:
        data = response.json()
        free_flow_speed = data["flowSegmentData"]["freeFlowSpeed"]
        current_speed = data["flowSegmentData"]["currentSpeed"]
        density = ((free_flow_speed - current_speed) / free_flow_speed) * 100
        return density
    else:
        return None

def calculate_fare(route_points, distance):
    """Calculates fare based on traffic density along the route."""
    base_fare = 30
    rate_per_km = 15

    blue = green = orange = red = 0

    for lat, lon in route_points[::100]:  # sample every 100th point
        density = get_traffic_density(lat, lon)
        if density is not None:
            if density < 25:
                blue += 1
            elif density < 50:
                green += 1
            elif density < 75:
                orange += 1.5
            else:
                red += 1.75

    total_segments = blue + green + orange + red or 1
    multiplier = 1.4 * (blue * 1 + green * 1.2 + orange * 1.5 + red * 2) / total_segments
    total_fare = base_fare + (distance * rate_per_km * multiplier)

    return round(total_fare, 2), round(multiplier, 2)

def get_fare_from_addresses(source_address, destination_address):
    """Takes two addresses and returns fare and route info."""
    source_info = get_location_details(source_address)
    dest_info = get_location_details(destination_address)

    if source_info and dest_info:
        source_coords = (source_info["latitude"], source_info["longitude"])
        dest_coords = (dest_info["latitude"], dest_info["longitude"])

        route_points, distance = get_route(source_coords, dest_coords)
        if route_points and distance:
            global global_route_points
            global_route_points = route_points  # save for map usage
            fare, multiplier = calculate_fare(route_points, distance)
            return {
                "source": source_info["address"],
                "destination": dest_info["address"],
                "distance_km": round(distance, 2),
                "fare": fare,
                "multiplier": multiplier
            }
        else:
            print("Could not calculate route.")
            return None
    else:
        print("Could not geocode one of the addresses.")
        return None

def main():
    source = "RV College Of Engineering"
    destination = "Kempegowda International Airport"
    
    result = get_fare_from_addresses(source, destination)

    if result:
        print("\nRide Summary:")
        print(f"From       : {result['source']}")
        print(f"To         : {result['destination']}")
        print(f"Distance   : {result['distance_km']} km")
        print(f"Multiplier : x{result['multiplier']}")
        print(f"Estimated Fare: ₹{result['fare']}")
    else:
        print(f"result,{result}")

main()