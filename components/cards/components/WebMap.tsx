// import React, { useState, useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";
// import { Box } from "@/components/ui/box";
// import * as Location from "expo-location";

// export default function WebMap() {
//     const mapContainer = useRef<HTMLDivElement | null>(null);
//     const map = useRef<maplibregl.Map | null>(null);
//     const marker = useRef<maplibregl.Marker | null>(null);
//     const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

//     // useEffect(() => {
//     //     // Get user location
//     //     if (navigator.geolocation) {
//     //     navigator.geolocation.getCurrentPosition(
//     //         (pos) => {
//     //         setUserLocation([pos.coords.longitude, pos.coords.latitude]);
//     //         },
//     //         (err) => console.error("Error getting location:", err),
//     //         { enableHighAccuracy: true }
//     //     );
//     //     }
//     // }, []);
//     useEffect(() => {

//         let subscription: Location.LocationSubscription | null = null;

//         (async () => {
//         // Ask for permission
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//             console.error("Permission to access location was denied");
//             return;
//         }

//         // Start watching user location
//         subscription = await Location.watchPositionAsync(
//             {
//             accuracy: Location.Accuracy.Highest, // get best accuracy
//             timeInterval: 1000, // update every 1s
//             distanceInterval: 1, // update every 1 meter
//             },
//             (location) => {
//             const coords: [number, number] = [
//                 location.coords.longitude,
//                 location.coords.latitude,
//             ];
//             setUserLocation(coords);

//             // Update marker position if map is already initialized
//             if (marker.current) {
//                 marker.current.setLngLat(coords);
//             }
//             if (map.current) {
//                 map.current.setCenter(coords); // recenter map on user
//             }
//             }
//         );
//     }
//     )
//     }, []);

//     useEffect(() => {
//     if (!mapContainer.current || map.current || !userLocation) return;

//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: "https://api.maptiler.com/maps/streets-v2/style.json?key=7ewUNYG9ZZYdTZYiAECk",
//       center: userLocation,
//       zoom: 9,
//       attributionControl: false
//     });

//     new maplibregl.Marker({ color: "green" })
//       .setLngLat(userLocation)
//       .setPopup(new maplibregl.Popup().setText("Current Location"))
//       .addTo(map.current);
//   }, [userLocation]);

//     return (
//         <Box className="w-full h-full rounded-lg overflow-hidden">
//             <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
//             {/* <a href="https://maptiler.jp/" target="_blank">&copy; MIERUNE</a> */}
//         </Box>
//     );
// }

import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box } from "@/components/ui/box";
import * as Location from "expo-location";
import { Platform } from "react-native";

interface WebMapProps {
    onChange?: (coords: [number, number]) => void;
}

const WebMap: React.FC<WebMapProps> = ({onChange}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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
                onChange && onChange(coords);
                if (marker.current) {
                    marker.current.setLngLat(coords);
                }
                if (map.current) {
                    map.current.setCenter(coords);
                }
                },
                (err) => console.error("Web geolocation error:", err),
                { enableHighAccuracy: true, maximumAge: 0 }
            );
            } else {
            // Native (iOS/Android) using Expo Location
            subscription = await Location.watchPositionAsync(
                {
                accuracy: Location.Accuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 1,
                },
                (location) => {
                const coords: [number, number] = [
                    location.coords.longitude,
                    location.coords.latitude,
                ];
                setUserLocation(coords);

                if (marker.current) {
                    marker.current.setLngLat(coords);
                }
                if (map.current) {
                    map.current.setCenter(coords);
                }
                }
            );
        }
    })();

    return () => {
        if (subscription && "remove" in subscription) {
        subscription.remove();
        }
        if (webWatchId !== null) {
        navigator.geolocation.clearWatch(webWatchId);
        }
    };
    }, []);


  useEffect(() => {
    if (!mapContainer.current || map.current || !userLocation) return;
    console.log("Initializing map at: ", userLocation);
    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json?key=7ewUNYG9ZZYdTZYiAECk",
      center: userLocation,
      zoom: 15,
      attributionControl: false,
    });

    // Add user marker
    marker.current = new maplibregl.Marker({ color: "red" })
      .setLngLat(userLocation)
      .setPopup(new maplibregl.Popup().setText("You are here"))
      .addTo(map.current);
  }, [userLocation]);

  return (
    <Box className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}

export default WebMap;

