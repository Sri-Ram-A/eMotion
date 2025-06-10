import os
import requests
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
def get_coords(address: str):
    geolocator = Nominatim(user_agent="geoapi")
    location_data = geolocator.geocode(address)
    if location_data:
        return [
            float(location_data.latitude),
            float(location_data.longitude)
        ]
    else:
        print(f"Could not find coordinates for '{address}'.")
        return None
