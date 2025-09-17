import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@/components/ui/box";

interface WebMapWithMarksProps {
  coordinates: Array<[number, number]>; // Array of [longitude, latitude] pairs
}

const WebMapWithMarks: React.FC<WebMapWithMarksProps> = ({
  coordinates = [],
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const mapInitialized = useRef(false);

  // Filter out invalid coordinates
  const validCoordinates = coordinates.filter(
    (coord) =>
      coord &&
      Array.isArray(coord) &&
      coord.length === 2 &&
      typeof coord[0] === "number" &&
      typeof coord[1] === "number"
  );

  // Map initialization effect
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    // Use first coordinate as center, or default to [0, 0] if no coordinates
    const center = validCoordinates.length > 0 ? validCoordinates[0] : [0, 0];

    console.log("Initializing map with coordinates: ", validCoordinates);

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets-v2/style.json?key=7ewUNYG9ZZYdTZYiAECk",
      center: center,
      zoom: validCoordinates.length > 0 ? 10 : 1,
      attributionControl: false,
    });

    map.current.on("load", () => {
      mapInitialized.current = true;
      addCoordinateMarkers();
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapInitialized.current = false;
      }
    };
  }, []);

  // Function to add coordinate markers
  const addCoordinateMarkers = () => {
    if (!map.current || !mapInitialized.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => {
      marker.remove();
    });
    markers.current = [];

    // Add new coordinate markers
    validCoordinates.forEach((coords, index) => {
      const marker = new maplibregl.Marker({ color: "blue" })
        .setLngLat(coords)
        .setPopup(new maplibregl.Popup().setText(`Location ${index + 1}`))
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (validCoordinates.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      validCoordinates.forEach((coord) => bounds.extend(coord));

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000,
      });
    }
  };

  // Update markers when coordinates change
  useEffect(() => {
    if (mapInitialized.current) {
      addCoordinateMarkers();
    }
  }, [coordinates]);

  return (
    <Box className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
};

export default WebMapWithMarks;
