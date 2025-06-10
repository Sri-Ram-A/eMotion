import pickle
import time
import networkx as nx
import osmium


class OSMHandler(osmium.SimpleHandler):
    def __init__(self):
        osmium.SimpleHandler.__init__(self)
        self.nodes = {}  
        self.ways = []   

    def node(self, n):
        self.nodes[n.id] = (n.location.lat, n.location.lon)

    def way(self, w):
        tags = dict(w.tags)
        if 'highway' in tags:
            node_list = [n.ref for n in w.nodes]
            if len(node_list) >= 2:
                self.ways.append((w.id, node_list, tags))


def create_graph_from_osm():
    pbf_file = "karnataka-latest.osm.pbf"
    cache_file = "karnataka_graph.pkl"

    print(f"Processing {pbf_file}...")
    start_time = time.time()

    print("Parsing OSM data...")
    handler = OSMHandler()
    handler.apply_file(pbf_file)

    print(f"Extracted {len(handler.nodes)} nodes and {len(handler.ways)} ways")

    print("Creating NetworkX graph...")
    G = nx.MultiDiGraph()

    for node_id, (lat, lon) in handler.nodes.items():
        G.add_node(node_id, lat=lat, lon=lon)

    edge_count = 0
    for way_id, node_list, tags in handler.ways:
        oneway = tags.get('oneway', 'no').lower()
        is_oneway = oneway in ['yes', 'true', '1']

        for i in range(len(node_list) - 1):
            from_node = node_list[i]
            to_node = node_list[i + 1]

            if from_node not in handler.nodes or to_node not in handler.nodes:
                continue

            from_lat, from_lon = handler.nodes[from_node]
            to_lat, to_lon = handler.nodes[to_node]
            distance = ((to_lat - from_lat) ** 2 + (to_lon - from_lon) ** 2) ** 0.5

            edge_attrs = {
                'way_id': way_id,
                'highway': tags.get('highway', 'unknown'),
                'distance': distance,
                'name': tags.get('name')
            }

            G.add_edge(from_node, to_node, **edge_attrs)
            edge_count += 1

            if not is_oneway:
                G.add_edge(to_node, from_node, **edge_attrs)
                edge_count += 1

    print(f"Created graph with {G.number_of_nodes()} nodes and {edge_count} edges")

    print(f"Saving graph to {cache_file}...")
    with open(cache_file, 'wb') as f:
        pickle.dump(G, f)

    processing_time = time.time() - start_time
    print(f"Processing completed in {processing_time:.2f} seconds")
    print(f"Graph saved as {cache_file}")

    return G


if __name__ == "__main__":
    graph = create_graph_from_osm()

    print(f"\nGraph Statistics:")
    print(f"  Nodes: {graph.number_of_nodes():,}")
    print(f"  Edges: {graph.number_of_edges():,}")

    print(f"\nTo load the graph later:")
    print(f"import pickle")
    print(f"with open('karnataka_graph.pkl', 'rb') as f:")
    print(f"    graph = pickle.load(f)")