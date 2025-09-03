import React from "react";
import "./style/WeatherForecastCard.css";

function WeatherForecastCard({ currentTemp, currentDescription, upcomingDays }) {
  return (
    <div className="weather-forecast-card" dir="rtl">
      <h2>תחזית מזג האוויר לשלושה ימים</h2>

      <div className="weather-current">
        <div className="weather-current-info">
          <p>מזג אוויר כעת</p>
          <h3>{currentTemp}</h3>
          <span>{currentDescription}</span>
        </div>
      </div>

      <h3 className="weather-upcoming-title">תחזית לימים הקרובים</h3>
      <div className="weather-upcoming-list">
        {upcomingDays?.map((day) => (
          <div key={day.date} className="weather-day">
            <div className="weather-day-date">{day.date}</div>
            <div className="weather-day-desc">{day.description}</div>
            <div className="weather-day-temp">
              <span className="max">{day.max}</span> / <span className="min">{day.min}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherForecastCard;
