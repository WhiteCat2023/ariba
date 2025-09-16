import React, { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@/components/ui/box";
import * as Location from "expo-location";
import { Platform } from "react-native";

interface WebMapWithMarksProps {
  coordinates: Array<[number, number]>;
}

const WebMapWithMarks: React.FC<WebMapWithMarksProps> = ({
  coordinates = [],
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const mapInitialized = useRef(false);

  // Function to update user marker
  const updateUserMarker = useCallback((coords: [number, number]) => {
    // Find or create user marker
    let userMarker = markers.current.find((m) =>
      m.getElement().classList.contains("user-marker")
    );

    if (userMarker) {
      userMarker.setLngLat(coords);
    } else if (map.current) {
      userMarker = new maplibregl.Marker({ color: "red" })
        .setLngLat(coords)
        .setPopup(new maplibregl.Popup().setText("You are here"))
        .addTo(map.current);

      userMarker.getElement().classList.add("user-marker");
      markers.current.push(userMarker);
    }
  }, []);

  // Location tracking effect - only for displaying user location
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let webWatchId: number | null = null;

    (async () => {
      // Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      if (Platform.OS === "web") {
        // Use navigator directly on web
        webWatchId = navigator.geolocation.watchPosition(
          (pos) => {
            const coords: [number, number] = [
              pos.coords.longitude,
              pos.coords.latitude,
            ];
            setUserLocation(coords);
            updateUserMarker(coords);

            if (map.current && !mapInitialized.current) {
              map.current.setCenter(coords);
            }
          },
          (err) => console.error("Web geolocation error:", err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        // Native (iOS/Android) using Expo Location
        try {
          // Get initial position first
          const initialLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const initialCoords: [number, number] = [
            initialLocation.coords.longitude,
            initialLocation.coords.latitude,
          ];

          setUserLocation(initialCoords);
          updateUserMarker(initialCoords);

          // Then watch for updates
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (location) => {
              const coords: [number, number] = [
                location.coords.longitude,
                location.coords.latitude,
              ];
              setUserLocation(coords);
              updateUserMarker(coords);
            }
          );
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (webWatchId !== null) {
        navigator.geolocation.clearWatch(webWatchId);
      }
    };
  }, [updateUserMarker]);

  // Map initialization effect
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const center = userLocation || coordinates[0] || [0, 0];

    console.log("Initializing map at: ", center);

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets-v2/style.json?key=7ewUNYG9ZZYdTZYiAECk",
      center: center,
      zoom: 15,
      attributionControl: false,
    });

    map.current.on("load", () => {
      mapInitialized.current = true;

      // Add user marker if we have user location
      if (userLocation) {
        updateUserMarker(userLocation);
      }
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapInitialized.current = false;
      }
    };
  }, [userLocation, updateUserMarker]);

  // Coordinate markers effect
  useEffect(() => {
    if (!map.current || !mapInitialized.current) return;

    // Clear existing non-user markers
    markers.current.forEach((marker) => {
      if (!marker.getElement().classList.contains("user-marker")) {
        marker.remove();
      }
    });

    // Filter out user marker from markers array
    markers.current = markers.current.filter((marker) =>
      marker.getElement().classList.contains("user-marker")
    );

    // Add new coordinate markers
    coordinates.forEach((coords, index) => {
      // Skip if this is the user location
      if (
        userLocation &&
        coords[0] === userLocation[0] &&
        coords[1] === userLocation[1]
      ) {
        return;
      }

      const marker = new maplibregl.Marker({ color: "blue" })
        .setLngLat(coords)
        .setPopup(new maplibregl.Popup().setText(`Location ${index + 1}`))
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    const allCoords = [...coordinates];
    if (userLocation) {
      allCoords.push(userLocation);
    }

    if (allCoords.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      allCoords.forEach((coord) => bounds.extend(coord));

      // Add padding and set max zoom for better view
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000, // Smooth animation
      });
    }
  }, [coordinates, userLocation]);

  return (
    <Box className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
};

export default WebMapWithMarks;
