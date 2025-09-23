import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import WeatherForecastCard from "../components/WeatherForecastCard";
import "./style/TripDetailsPage.css";
import TripMap from "../components/TripMap";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function TripDetailsPage() {
  const { tripId } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const defaultImageUrl = "/images/default_trip.png";

  // Local UI-only favorite state
const [isFavorite, setIsFavorite] = useState(
  Boolean(
    location.state?.dbId ??
    location.state?._id ??
    location.state?.isFavorite
  ) || false
);

//-----------------------------------------------
// Handle favorite toggle (save/remove) - SERVER
//-----------------------------------------------
const handleToggleFavorite = async () => {
  if (!trip) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("לא נמצאה התחברות. נא להתחבר מחדש.");
    return;
  }

  const currentDbId = trip.dbId ?? trip._id ?? null;

  try {
    if (currentDbId) {
      // Already saved => delete
      await axios.delete(`/api/trips/${currentDbId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFavorite(false);
      // ננרמל גם את האובייקט המקומי כדי שהמצב יישאר עקבי
      setTrip((prev) => (prev ? { ...prev, dbId: null, _id: undefined } : prev));

      alert("הטיול הוסר מהמועדפים.");
    } else {
      // Not saved yet => save
      const { data } = await axios.post("/api/trips/save", trip, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedTrip = data.data; // מכיל _id
      setIsFavorite(true);
      setTrip((prev) =>
        prev ? { ...prev, dbId: savedTrip._id, _id: savedTrip._id } : prev
      );

      alert("הטיול נוסף למועדפים!");
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    alert("שגיאה בשמירת/מחיקת הטיול.");
  }
};




  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Fetch trip details
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


  ////////////////////////////////////////////////////////////////////////////////////////////////////

  // When 'trip' arrives (from DB or navigation), initialize UI flag
useEffect(() => {
  if (trip) {
    setIsFavorite(Boolean(trip.dbId ?? trip._id ?? trip.isFavorite));
  }
}, [trip]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////

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

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Image */}
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

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Favorite button – shown under the image */}
    <div className="trip-actions">
      <button
        type="button"
        className={`favorite-btn ${isFavorite ? "is-fav" : ""}`}
        onClick={handleToggleFavorite}
      >
      {isFavorite ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon style={{ color: "red" }} />}
      </button>
    </div>

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Trip description text */}
    <p className="trip-description">
      {trip.tripDescription || "אין תיאור זמין."}
    </p>

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Trip info cards (type, difficulty, total distance) */}
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

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Daily breakdown list (day-by-day distances and notes) */}
    <h3>פירוט יומי</h3>
    <ul className="trip-days-list">
      {(trip.dailyBreakdown || []).map((d) => (
        <li key={d.day}>
          יום {d.day} - {d.distance} ק״מ {d.description && ` - ${d.description}`}
        </li>
      ))}
    </ul>

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Map section (Leaflet map with start/end/waypoints) */}
    <br />
    <div className="trip-map-placeholder">
      <TripMap
        startPoint={trip.route.startPoint}
        endPoint={trip.route.endPoint}
        waypoints={trip.route.waypoints}
      />
    </div>
    <br />

    {/* //////////////////////////////////////////////////////////////////////// */}
    {/* Weather forecast card (render only if data exists) */}
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
