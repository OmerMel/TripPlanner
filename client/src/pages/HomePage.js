import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavedTripsList from "../components/SavedTripsList";
import "./style/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [trips, setTrips] = useState([]); // Create a new state variable called trips, which starts as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchTrips() {
      try {
        const response = await axios.get("/api/trips/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mapped = response.data.data.map((trip) => ({
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

        setTrips(mapped);
      } catch (err) {
        console.error("Error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [navigate, token]);

  const handleCardClick = (tripId) => {
    navigate(`/tripdetails/${tripId}`);
  };

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

  return (
    <div dir="rtl" className="home-page">
      <h1>ברוך הבא {username ? `, ${username}` : ""}!</h1>
      <p>
         אתר זה מאפשר לך ליצור מסלולי טיול מותאמים אישית בכל יעד בארץ ובעולם.
          ניתן להזין פרטי יעד, לבחור סוג טיול (הליכה או אופניים),
          לצפות בתחזית מזג האוויר הקרובה ולנהל מסלולים מועדפים לשימוש עתידי.
      </p>

      <h2 className="saved-trips-title">
        המסלולים השמורים שלך
      </h2>

      {loading ? (
        <p>טוען מסלולים...</p>
      ) : (
        <SavedTripsList
          trips={trips}
          onClick={handleCardClick}
          onDelete={handleDeleteFavorite}
          limit={4} // Showing the last 4 saved
        />
      )}
    </div>
  );
}

export default HomePage;
