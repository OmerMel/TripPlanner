import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavedTripsList from "../components/SavedTripsList";
import "./style/HistoryPage.css";


function HistoryPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);


  /////////////////////////////////////////////////////////////////////////
  // Fetch the user's saved trips from the backend when the component mounts.
  /////////////////////////////////////////////////////////////////////////
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

  /////////////////////////////////////////////////////////////////////////
  // Delete a favorite trip from the user's saved trips list.
  /////////////////////////////////////////////////////////////////////////
  const handleDeleteFavorite = async (tripId) => {
    const previousTrips = [...trips];
    // Take the previous trip list (prev), filter it for the trip with this id, and save the new list in state.
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));

    try {
      //Send an HTTP DELETE request to /api/trips/<trip-id> and include the token in the header 
      // to verify that the user is authorized to delete.
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

  /////////////////////////////////////////////////////////////////////////
  // Navigate to the trip details page when a trip card is clicked.
  /////////////////////////////////////////////////////////////////////////
  const handleCardClick = (tripId) => {
    navigate(`/tripdetails/${tripId}`);
  };

  return (
    <div dir="rtl" className="history-page">
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
