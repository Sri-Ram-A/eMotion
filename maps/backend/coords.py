import os
import requests

def get_coords(address: str):
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": address,
        "apiKey": os.getenv("GEOAPIFY_KEY")
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    if data["features"]:
        coords = data["features"][0]["geometry"]["coordinates"]
        return [coords[1], coords[0]]
    else:
        return None