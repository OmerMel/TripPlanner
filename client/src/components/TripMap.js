import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function TripMap({ startPoint, endPoint, waypoints }) {
  const [routeCoords, setRouteCoords] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const coords = [
                    [startPoint.lng, startPoint.lat],
                    ...[...(waypoints || [])].sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
                        .map(wp => [wp.lng, wp.lat]),
                    [endPoint.lng, endPoint.lat],
                ].filter(([lng, lat]) =>
                    Number.isFinite(lng) && Number.isFinite(lat)
                );

                if (coords.length < 2) return;

                const res = await fetch("/api/directions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        profile: "foot-walking",
                        coordinates: coords, // [lng,lat]
                    }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error("Routing proxy error:", res.status, errText);
                    setRouteCoords([]);
                    return;
                }

                const data = await res.json();
                const line = data?.features?.[0]?.geometry?.coordinates || [];

                const route = line.map(([lng, lat]) => [lat, lng]); // -> Leaflet [lat,lng]
                setRouteCoords(route);
            } catch (e) {
                console.error("Routing fetch failed:", e);
                setRouteCoords([]);
            }
        };

        fetchRoute();
    }, [startPoint, endPoint, waypoints]);


  // pin icon for waypoints
  const waypointIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // pin icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

    return (
    <MapContainer
      center={[startPoint.lat, startPoint.lng]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/*<Marker position={[startPoint.lat, startPoint.lng]} icon={waypointIcon} />*/}
      {/*<Marker position={[endPoint.lat, endPoint.lng]} icon={waypointIcon} />*/}

      {[startPoint, ...waypoints, endPoint].map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={waypointIcon} />
      ))}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
}

export default TripMap;
