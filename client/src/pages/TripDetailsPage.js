import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import WeatherForecastCard from "../components/WeatherForecastCard";
import "./style/TripDetailsPage.css";
import TripMap from "../components/TripMap";

function TripDetailsPage() {
  const { tripId } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const defaultImageUrl = "/images/default_trip.png";

  useEffect(() => {
    if (trip) return;

    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/trips/${tripId}`);
        setTrip(response.data.data);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [trip, tripId]);

  // Fetch weather data based on the trip's start point
  useEffect(() => {
    if (!trip || !trip.route?.startPoint) return;

    const fetchWeather = async () => {
      const { lat, lng } = trip.route.startPoint;

      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const data = await res.json();

        if (data.success) {
          setWeather(data);
        }
      } catch (error) {
        console.error("שגיאה בשליפת תחזית:", error);
      }
    };

    fetchWeather();
  }, [trip]);

  if (loading) {
    return <div className="trip-details-container">טוען נתונים...</div>;
  }

  if (error) {
    return <div className="trip-details-container">{error}</div>;
  }

  if (!trip) {
    return <div className="trip-details-container">הטיול לא נמצא.</div>;
  }

  return (
    <div className="trip-details-container" dir="rtl">
      <div className="trip-hero-image-container">
  <img
    src={trip.image?.url || defaultImageUrl}
    alt={`${trip.tripName || "תמונה כללית"}`}
    className="trip-hero-image"
  />
  <div className="trip-hero-overlay">
    <h1 className="trip-hero-title">{trip.tripName}</h1>
  </div>
</div>
      <p className="trip-description">
        {trip.tripDescription || "אין תיאור זמין."}
      </p>
      <div className="trip-info-cards">
        <div className="info-card">
          <strong>סוג טיול:</strong>{" "}
          {trip.tripType === "bicycle" ? "טיול אופניים" : "טיול רגלי"}
        </div>
        <div className="info-card">
          <strong>רמת קושי:</strong> {trip.difficulty || "לא צוינה"}
        </div>
        <div className="info-card">
          <strong>מרחק כולל:</strong>{" "}
          {trip.totalDistance ? `${trip.totalDistance} ק״מ` : "לא ידוע"}
        </div>
      </div>

      <h3>פירוט יומי</h3>
      <ul className="trip-days-list">
        {(trip.dailyBreakdown || []).map((d) => (
          <li key={d.day}>
            יום {d.day} - {d.distance} ק״מ{" "}
            {d.description && ` - ${d.description}`}
          </li>
        ))}
      </ul>
      <br />
      <div className="trip-map-placeholder" >
        <TripMap
          startPoint={trip.route.startPoint}
          endPoint={trip.route.endPoint}
          waypoints={trip.route.waypoints}
        />
      </div>
      <br />

      {weather && (
        <WeatherForecastCard
          currentTemp={`${weather.currentTemp}°C`}
          currentDescription=""
          upcomingDays={weather.forecast.map((day) => ({
            date: day.date,
            min: `${day.min}°`,
            max: `${day.max}°`,
            description: "",
          }))}
        />
      )}
    </div>
  );
}

export default TripDetailsPage;
