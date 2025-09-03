import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TripCard from "../components/TripCard";
import "./style/TripOptionsPage.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

function TripOptionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (location.state) {
      const trip = location.state;
      setTrips([
        {
          ...trip,
          id: uuidv4(),
          dbId: null, // Initially no database ID
          isFavorite: false,
        },
      ]);
    } else {
      setTrips([]);
    }
  }, [location.state]);

  //-----------------------------------------------
  // Handle card click to navigate to trip details
  //-----------------------------------------------
  const handleCardClick = (trip) => {
    navigate(`/tripdetails/${trip.id}`, { state: trip });
  };

  //-----------------------------------------------
  // Handle favorite toggle (save/remove trip)
  //-----------------------------------------------
  const handleToggleFavorite = async (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("לא נמצאה התחברות. נא להתחבר מחדש.");
      return;
    }

    if (trip.dbId) {
      // Already saved (Exist in DB) => Delete
      try {
        await axios.delete(`/api/trips/${trip.dbId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrips((prevTrips) =>
          prevTrips.map((t) =>
            t.id === tripId ? { ...t, isFavorite: false, dbId: null } : t
          )
        );

        alert("הטיול הוסר מהמועדפים.");
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("שגיאה במחיקת הטיול.");
      }
    } else {
      // עדיין לא נשמר => שמירה
      try {
        const response = await axios.post("/api/trips/save", trip, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const savedTrip = response.data.data;

        setTrips((prevTrips) =>
          prevTrips.map((t) =>
            t.id === tripId
              ? { ...t, isFavorite: true, dbId: savedTrip._id }
              : t
          )
        );

        alert("הטיול נוסף למועדפים!");
      } catch (error) {
        console.error("Error saving trip:", error);
        alert("שגיאה בשמירת הטיול.");
      }
    }
  };

  return (
    <div dir="rtl" className="trip-options-container">
      <h1>הצעות למסלולים</h1>
      <div className="trip-list">
        {trips.length === 0 ? (
          <p>לא נבחר מסלול להצגה.</p>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              tripName={trip.tripName}
              country={trip.destination.country}
              city={trip.destination.city}
              tripType={
                trip.tripType === "bicycle" ? "טיול אופניים" : "טיול רגלי"
              }
              difficulty={trip.difficulty || "לא ידוע"}
              distance={
                trip.totalDistance ? `${trip.totalDistance} ק״מ` : "לא ידוע"
              }
              imageUrl={trip.image?.url || "/images/default_trip.png"}
              isFavorite={trip.isFavorite}
              onFavoriteToggle={() => handleToggleFavorite(trip.id)}
              onClick={() => handleCardClick(trip)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TripOptionsPage;
