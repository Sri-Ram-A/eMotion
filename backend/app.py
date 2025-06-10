import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import gzip
from pathlib import Path
from junction import get_intermediate_junctions

load_dotenv()

from coords import get_coords
from routing import route_between

app = Flask(__name__)
CORS(app)

import networkx as nx
def load_graph(data_dir: str) -> nx.DiGraph:
    data_path = Path(data_dir)
    pickle_file = data_path / "bengaluru.gz"

    if not pickle_file.exists():
        raise FileNotFoundError(f"Pickled graph not found at {pickle_file}")

    print(f"Loading pickled graph from {pickle_file}...")
    with gzip.open(pickle_file, 'rb') as f:
        graph = pickle.load(f)

    print(f"Graph loaded: {len(graph.nodes)} nodes, {len(graph.edges)} edges")
    return graph

graph = load_graph('./data/')

@app.route('/maps/place', methods=['POST'])
def get_coordinates():
    data = request.get_json()
    address = data.get("address")
    return get_coords(address)

@app.route('/maps/route', methods=['POST'])
def find_route():
    data = request.get_json()
    place1 = data.get("place1")
    place2 = data.get("place2")
    bi = data.get("bidirectional")
    coords1 = get_coords(place1)
    coords2 = get_coords(place2)
    print(f"Coordinates for place 1: {coords1}")
    print(f"Coordinates for place 2: {coords2}")
    route = route_between(
        src_lat=coords1[0],
        src_lon=coords1[1],
        tgt_lat=coords2[0],
        tgt_lon=coords2[1],
        bidirectional = bi,
        graph = graph
    )
    return jsonify(route), 200

@app.route('/split', methods=['POST'])
def split():
    data = request.get_json()
    place1 = data.get("place1")
    place2 = data.get("place2")
    coords = get_intermediate_junctions(place1, place2)
    return coords

if __name__ == "__main__":
    app.run(debug=False)