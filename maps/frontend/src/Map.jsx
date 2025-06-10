import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
console.log(MAPBOX_TOKEN)
console.log("Hello")
const Map = ({ markers = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initialCenter = markers.length
      ? [markers[0][1], markers[0][0]] 
      : [77.5946, 12.9716];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: 10,
    });

    if (!markers.length) {
      new mapboxgl.Marker()
        .setLngLat([77.5946, 12.9716])
        .addTo(map.current);
    }
  }, [markers]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (!markers.length) {
      if (map.current.getLayer('route-line')) {
        map.current.removeLayer('route-line');
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
      return;
    }
    const routeCoords = markers.map(([lat, lon]) => [lon, lat]);
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoords,
      },
    };

    if (map.current.getSource('route')) {
      map.current.getSource('route').setData(routeGeoJSON);
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON,
      });
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff7e5f',
          'line-width': 4,
          'line-opacity': 0.9,
        },
      });
    }

    const bounds = routeCoords.reduce(
      (b, coord) => b.extend(coord),
      new mapboxgl.LngLatBounds(routeCoords[0], routeCoords[0])
    );
    map.current.fitBounds(bounds, { padding: 40 });
  }, [markers]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100vh',
      }}
    />
  );
};

export default Map;