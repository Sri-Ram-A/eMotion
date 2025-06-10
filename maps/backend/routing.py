import os
import pickle
import heapq
import gzip
import networkx as nx
import osmnx as ox
from osmnx.projection import project_geometry
from shapely.geometry import Point
from pathlib import Path
from tqdm import tqdm

class PriorityDict:
    __slots__ = ('_heap', '_entry_finder')

    def __init__(self):
        self._heap = []
        self._entry_finder = {}

    def add_or_update(self, node, priority):
        self._entry_finder[node] = priority
        heapq.heappush(self._heap, (priority, node))

    def pop_smallest(self):
        while self._heap:
            priority, node = heapq.heappop(self._heap)
            if node in self._entry_finder and self._entry_finder[node] == priority:
                del self._entry_finder[node]
                return node, priority
        raise KeyError('pop from an empty priority queue')

    def __bool__(self):
        return bool(self._entry_finder)

def dijkstra(graph: nx.DiGraph, source, target):
    if source == target:
        return [source], 0
    
    frontier = PriorityDict()
    dist = { source: 0 }
    prev, visited = {}, set()
    weight = 'length'
    path = []

    frontier.add_or_update(source, 0)
    while frontier:
        u, du = frontier.pop_smallest()
        if u in visited: continue
        visited.add(u)

        for _, v, data in graph.edges(u, data=True):
            if v in visited:
                continue
            alt = du + data.get(weight, 1)
            if alt < dist.get(v, float('inf')):
                dist[v], prev[v] = alt, u
                frontier.add_or_update(v, alt)
    if target not in dist:
        return [], float('inf')

    node = target
    while node != source:
        path.append(node)
        node = prev[node]
    path.append(source)
    path.reverse()
    return path, dist.get(target)

def dijkstra_bidirectional(graph: nx.DiGraph, source, target, weight: str = 'length'):
    if source == target:
        return [source], 0

    G_rev = graph.reverse(copy=False)
    dist_f, prev_f = {source: 0}, {}
    dist_b, prev_b = {target: 0}, {}
    frontier_f, frontier_b = PriorityDict(), PriorityDict()
    frontier_f.add_or_update(source, 0)
    frontier_b.add_or_update(target, 0)
    visited_f, visited_b = set(), set()
    meeting_node, best_dist = None, float('inf')

    while frontier_f and frontier_b:
        if (frontier_f._entry_finder and frontier_b._entry_finder and
            min(frontier_f._entry_finder.values()) + min(frontier_b._entry_finder.values()) >= best_dist):
            break

        if frontier_f:
            u_f, d_u_f = frontier_f.pop_smallest()
            visited_f.add(u_f)

            if u_f in visited_b and d_u_f + dist_b[u_f] < best_dist:
                best_dist, meeting_node = d_u_f + dist_b[u_f], u_f

            for _, v, data in graph.edges(u_f, data=True):
                if v in visited_f:
                    continue
                alt = d_u_f + data.get(weight, 1)
                if alt < dist_f.get(v, float('inf')):
                    dist_f[v], prev_f[v] = alt, u_f
                    frontier_f.add_or_update(v, alt)

        if frontier_b:
            u_b, d_u_b = frontier_b.pop_smallest()
            visited_b.add(u_b)

            if u_b in visited_f and d_u_b + dist_f[u_b] < best_dist:
                best_dist, meeting_node = d_u_b + dist_f[u_b], u_b

            for _, v, data in G_rev.edges(u_b, data=True):
                if v in visited_b:
                    continue
                alt = d_u_b + data.get(weight, 1)
                if alt < dist_b.get(v, float('inf')):
                    dist_b[v], prev_b[v] = alt, u_b
                    frontier_b.add_or_update(v, alt)

    if meeting_node is None:
        return [], float('inf')

    path_f, node = [], meeting_node
    while node != source:
        path_f.append(node)
        node = prev_f[node]
    path_f.append(source)
    path_f.reverse()

    path_b, node = [], meeting_node
    while node != target:
        node = prev_b[node]
        path_b.append(node)

    return path_f + path_b, best_dist

def load_pickled_graph(data_dir: str) -> nx.DiGraph:
    data_path = Path(data_dir)
    pickle_file = data_path / "bengaluru.gz"

    if not pickle_file.exists():
        raise FileNotFoundError(f"Pickled graph not found at {pickle_file}")

    print(f"Loading pickled graph from {pickle_file}...")
    with gzip.open(pickle_file, 'rb') as f:
        graph = pickle.load(f)

    print(f"Graph loaded: {len(graph.nodes)} nodes, {len(graph.edges)} edges")
    return graph

def nearest_node(graph: nx.Graph, lat: float, lon: float):
    print(f"Searching for nearest node to coordinates ({lat}, {lon})...")
    crs = graph.graph.get('crs')
    if crs is None:
        print("Warning: No CRS found in graph, using coordinates as-is")
        pt_proj = Point(lon, lat)
    else:
        print(f"Projecting point to CRS: {crs}")
        pt = Point(lon, lat)
        try:
            pt_proj = project_geometry(pt, to_crs=crs)[0]
            print(f"Projected coordinates: ({pt_proj.x:.2f}, {pt_proj.y:.2f})")
        except Exception as e:
            print(f"Projection failed: {e}, using original coordinates")
            pt_proj = Point(lon, lat)

    best_node = None
    best_dist2 = float('inf')
    nodes_checked = 0
    nodes_with_coords = 0

    for node, data in graph.nodes(data=True):
        nodes_checked += 1
        x = data.get('x')
        y = data.get('y')

        if x is None or y is None:
            if nodes_checked <= 5: 
                print(f"  Node {node}: missing coordinates (x={x}, y={y})")
            continue

        nodes_with_coords += 1
        dx = x - pt_proj.x
        dy = y - pt_proj.y
        dist2 = dx*dx + dy*dy

        if dist2 < best_dist2:
            best_dist2 = dist2
            best_node = node

    print(f"Nodes checked: {nodes_checked}, nodes with coordinates: {nodes_with_coords}")

    if best_node is None:
        print(f"ERROR: No nearest node found for coordinates ({lat}, {lon})")
        print(f"Graph has {len(graph.nodes)} total nodes")
        print(f"Nodes with valid coordinates: {nodes_with_coords}")
        print("Possible issues:")
        print("  - All nodes missing x,y coordinates")
        print("  - Graph projection mismatch")
        print("  - Empty or corrupted graph")
        raise ValueError(f"No node found in graph to compute nearest for coordinates ({lat}, {lon})")

    distance_m = (best_dist2 ** 0.5) 
    print(f"SUCCESS: Nearest node to ({lat}, {lon}): {best_node}")
    print(f"  Distance: {distance_m:.2f} units, Distance²: {best_dist2:.2f}")
    return best_node

def nodes_to_coordinates(graph: nx.Graph, node_path: list) -> list:
    coordinates = []
    crs = graph.graph.get('crs')
    
    for node in node_path:
        node_data = graph.nodes[node]
        x = node_data.get('x')
        y = node_data.get('y')
        
        if x is None or y is None:
            print(f"Warning: Node {node} missing coordinates, skipping")
            continue
            
        if crs is not None:
            try:
                point_proj = Point(x, y)
                point_latlon = project_geometry(point_proj, to_crs='EPSG:4326')[0]
                lat, lon = point_latlon.y, point_latlon.x
            except Exception as e:
                print(f"Warning: Failed to convert coordinates for node {node}: {e}")
                lat, lon = y, x
        else:
            lat, lon = y, x
            
        coordinates.append((lat, lon))
    
    return coordinates

def route_between(
    src_lat: float,
    src_lon: float,
    tgt_lat: float,
    tgt_lon: float,
    graph: nx.DiGraph,
    bidirectional: bool = "True",
    weight: str = 'length',
    data_dir: str = "./data/",
):

    print(f"\n=== FINDING NEAREST NODES ===")
    try:
        src_node = nearest_node(graph, src_lat, src_lon)
    except ValueError as e:
        print(f"FAILED to find nearest node for SOURCE coordinates ({src_lat}, {src_lon})")
        print(f"Error: {e}")
        return [], float('inf')

    try:
        tgt_node = nearest_node(graph, tgt_lat, tgt_lon)
    except ValueError as e:
        print(f"FAILED to find nearest node for TARGET coordinates ({tgt_lat}, {tgt_lon})")
        print(f"Error: {e}")
        return [], float('inf')

    print(f"\n=== ROUTING ===")
    print(f"Routing from node {src_node} to node {tgt_node}...")

    if bidirectional == "True":
        node_path, distance = dijkstra_bidirectional(
            graph, src_node, tgt_node,
            weight=weight
        )
    else:
        node_path, distance = dijkstra(graph, src_node, tgt_node)


    print(f"\n=== CONVERTING TO COORDINATES ===")
    coordinate_path = nodes_to_coordinates(graph, node_path)
    print(f"Converted {len(node_path)} nodes to {len(coordinate_path)} coordinates")
    return coordinate_path, distance
    
if __name__ == "__main__":
    path, dist = route_between(
        data_dir="./data/",
        src_lat=12.9716,  # Cubbon Park area
        src_lon=77.5946,
        tgt_lat=12.9352,  # Koramangala area
        tgt_lon=77.6245,
    )

    print(f"\nRoute found!")
    print(f"Path length: {len(path)} coordinates")
    print(f"Total distance: {dist:.2f} meters")
    if path:
        print(f"First few coordinates: {path[:3] if len(path) > 3 else path}")
        print(f"Last few coordinates: {path[-3:] if len(path) > 3 else path}")
        print(f"Start point: ({path[0][0]:.6f}, {path[0][1]:.6f})")
        print(f"End point: ({path[-1][0]:.6f}, {path[-1][1]:.6f})")