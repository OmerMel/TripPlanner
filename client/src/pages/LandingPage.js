import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" dir="rtl">
      <header className="landing-header">
        <h1>GoTrip</h1>
        <p>
          תכנן טיול בליווי בינה מלאכותית, וקבל תחזית מזג אוויר והמלצות מותאמות
          אישית
        </p>
      </header>
      <div className="landing-actions">
        <button className="register-btn" onClick={() => navigate("/register")}>
          הרשמה
        </button>
        <button className="signin-btn" onClick={() => navigate("/login")}>
          התחברות
        </button>

      </div>
    </div>
  );
}

export default LandingPage;
