import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavedTripsList from "../components/SavedTripsList";
import "./style/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [trips, setTrips] = useState([]);
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

  return (
    <div dir="rtl" className="home-page">
      <h1>ברוך הבא {username ? `, ${username}` : ""}!</h1>
      <p>
         אתר זה מאפשר לך ליצור מסלולי טיול מותאמים אישית בכל יעד בארץ ובעולם.
          ניתן להזין פרטי יעד, לבחור סוג טיול (הליכה או אופניים),
          לצפות בתחזית מזג האוויר הקרובה ולנהל מסלולים מועדפים לשימוש עתידי.
      </p>

      <h2 style={{ textAlign: "center", marginBottom: "16px", color: "#3c7c51" }}>
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
