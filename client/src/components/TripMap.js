import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function TripMap({ startPoint, endPoint, waypoints }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyNjUyNjM4MThkNTQwMTdiMjQ5YmE4YTZkYzUxYTVmIiwiaCI6Im11cm11cjY0In0="


      const coords = [
        [startPoint.lng, startPoint.lat],
        ...waypoints
          .sort((a, b) => a.order - b.order)
          .map((wp) => [wp.lng, wp.lat]),
        [endPoint.lng, endPoint.lat],
      ];

      const url = `https://api.openrouteservice.org/v2/directions/foot-walking/geojson`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
          body: JSON.stringify({ coordinates: coords }),
        });

        const data = await res.json();
        const route = data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        ); // Back to leaflet format
        setRouteCoords(route);
      } catch (err) {
        console.error("Routing error:", err);
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

      <Marker position={[startPoint.lat, startPoint.lng]} icon={waypointIcon} />
      <Marker position={[endPoint.lat, endPoint.lng]} icon={waypointIcon} />

      {/*{[startPoint, ...waypoints, endPoint].map((p, i) => (*/}
      {/*    <Marker key={i} position={[p.lat, p.lng]} icon={waypointIcon} />*/}
      {/*))}*/}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
}

export default TripMap;
