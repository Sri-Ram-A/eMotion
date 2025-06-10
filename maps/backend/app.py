import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import gzip
from pathlib import Path
from junction import get_intermediate_junctions
import networkx as nx

load_dotenv()

from coords import get_coords
from routing import route_between

app = Flask(__name__)
CORS(app)


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
    place1 = request.args.get("place1")
    return get_coords(place1)

@app.route('/maps/route', methods=['GET'])
def find_route():
    from urllib.parse import unquote
    place1 = unquote(request.args["start"])
    place2  = unquote(request.args["dest"])
    coords1 = get_coords(place1)
    coords2 = get_coords(place2)
    print(f"Coordinates for place 1: {coords1}")
    print(f"Coordinates for place 2: {coords2}")
    route = route_between(
        src_lat=coords1[0],
        src_lon=coords1[1],
        tgt_lat=coords2[0],
        tgt_lon=coords2[1],
        graph = graph
    )
    return jsonify(route), 200

@app.route('/split')
def split():
    place1 = request.args.get("place1")
    place2 = request.args.get("place2")
    coords = get_intermediate_junctions(place1, place2)
    return coords

if __name__ == "__main__":
    app.run(debug=False)