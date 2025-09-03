import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavedTripsList from "../components/SavedTripsList";
import "./style/TripOptionsPage.css";

function HistoryPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserTrips() {
      try {
        const response = await axios.get("/api/trips/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched trips:", response.data);

        const mappedTrips = response.data.data.map((trip) => ({
          id: trip._id,
          name: trip.tripName,
          country: trip.destination.country,
          city: trip.destination.city,
          distance: trip.totalDistance ? `${trip.totalDistance} ק״מ` : "לא ידוע",
          difficulty: trip.difficulty || "לא צוינה",
          type: trip.tripType === "bicycle" ? "טיול אופניים" : "טיול רגלי",
          imageUrl: trip.image?.url || "/images/default_trip.png",
          isFavorite: true,
        }));

        setTrips(mappedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUserTrips();
  }, [token, navigate]);

  const handleDeleteFavorite = async (tripId) => {
    const previousTrips = [...trips];
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));

    try {
      await axios.delete(`/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Trip ${tripId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("שגיאה במחיקה, מנסה לשחזר...");
      setTrips(previousTrips);
    }
  };

  const handleCardClick = (tripId) => {
    navigate(`/tripdetails/${tripId}`);
  };

  return (
    <div dir="rtl" className="trip-options-container">
      <h1>המסלולים השמורים שלי</h1>
      {loading ? (
        <p>טוען מסלולים...</p>
      ) : (
        <SavedTripsList
          trips={trips}
          onDelete={handleDeleteFavorite}
          onClick={handleCardClick}
        />
      )}
    </div>
  );
}

export default HistoryPage;
