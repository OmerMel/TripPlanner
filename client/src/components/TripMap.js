// import React from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

// function TripMap({ startPoint, endPoint, waypoints }) {
//   const positions = [
//     [startPoint.lat, startPoint.lng],
//     ...waypoints
//       .sort((a, b) => a.order - b.order)
//       .map((wp) => [wp.lat, wp.lng]),
//     [endPoint.lat, endPoint.lng]
//   ];

//   return (
//     <MapContainer
//       center={[startPoint.lat, startPoint.lng]}
//       zoom={10}
//       style={{ height: "400px", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {positions.map((pos, index) => (
//         <Marker key={index} position={pos} />
//       ))}
//       <Polyline positions={positions} color="blue" />
//     </MapContainer>
//   );
// }

// export default TripMap;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function TripMap({ startPoint, endPoint, waypoints }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      // const apiKey = "YOUR_API_KEY"; // תקבל מ־OpenRouteService

      const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgyNjUyNjM4MThkNTQwMTdiMjQ5YmE4YTZkYzUxYTVmIiwiaCI6Im11cm11cjY0In0="; // תקבל מ־OpenRouteService


      const coords = [
        [startPoint.lng, startPoint.lat], // שים לב! lng לפני lat
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
        const route = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]); // החזרה לפורמט leaflet
        setRouteCoords(route);
      } catch (err) {
        console.error("Routing error:", err);
      }
    };

    fetchRoute();
  }, [startPoint, endPoint, waypoints]);

  return (
    <MapContainer center={[startPoint.lat, startPoint.lng]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {[startPoint, ...waypoints, endPoint].map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]} />
      ))}
      {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
    </MapContainer>
  );
}

export default TripMap;
