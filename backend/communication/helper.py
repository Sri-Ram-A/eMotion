from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Optional, Tuple, Dict


def get_distance(coords1: Tuple[float, float], coords2: Tuple[float, float]) -> float:
    """Returns the distance in kilometers between two coordinate pairs."""
    return geodesic(coords1, coords2).km

def get_price():
    return 108

def get_duration():
    return 81

def get_address_details(address: str) -> Optional[Dict[str, float]]:
    """
    Takes an address string and returns a dictionary with address, latitude, and longitude.
    Returns None if the location cannot be found.
    """
    geolocator = Nominatim(user_agent="geoapi")
    location_data = geolocator.geocode(address)
    if location_data:
        return {
            "details": location_data.address,
            "latitude": float(location_data.latitude),
            "longitude": float(location_data.longitude),
        }
    else:
        print(f"Could not find coordinates for '{address}'.")
        return None


# Example usage
if __name__ == "__main__":
    city_a: str = "RV College Of Engineering"
    city_b: str = "Peenya 2nd Stage"

    info1 = get_address_details(city_a)
    info2 = get_address_details(city_b)

    if info1 is None or info2 is None:
        print("Error retrieving coordinates.")
    else:
        coords1: Tuple[float, float] = (info1["latitude"], info1["longitude"])
        coords2: Tuple[float, float] = (info2["latitude"], info2["longitude"])
        distance: float = get_distance(coords1, coords2)
        print(f"The distance between {city_a} and {city_b} is: {distance:.2f} km")
