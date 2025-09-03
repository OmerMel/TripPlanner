// src/components/SavedTripsList.js
import React from "react";
import TripCard from "./TripCard";

/**
 * Component to display a list of saved trips.
 * @param {Object[]} trips - Array of trip objects to display.
 * @param {Function} onDelete - Callback function to handle trip deletion.
 * @param {Function} onClick - Callback function to handle trip card click.
 * @param {number} [limit] - Optional limit on the number of trips to display.
 * @return {JSX.Element} Rendered list of trip cards or a message if no trips are found.
 */
function SavedTripsList({ trips, onDelete, onClick, limit }) {
  const tripsToShow = limit ? trips.slice(0, limit) : trips;

  if (tripsToShow.length === 0) {
    return <p>לא נמצאו מסלולים.</p>;
  }

  return (
    <div className="saved-trips-section">
      {tripsToShow.map((trip) => (
        <TripCard
          key={trip.id}
          tripName={trip.name}
          country={trip.country}
          city={trip.city}
          tripType={trip.type}
          difficulty={trip.difficulty}
          distance={trip.distance}
          imageUrl={trip.imageUrl}
          isFavorite={trip.isFavorite}
          onFavoriteToggle={() => onDelete && onDelete(trip.id)}
          onClick={() => onClick && onClick(trip.id)}
        />
      ))}
    </div>
  );
}

export default SavedTripsList;
