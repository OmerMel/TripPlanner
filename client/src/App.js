import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PlannerPage from "./pages/PlannerPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TripOptionsPage from "./pages/TripOptionsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import HomePage from "./pages/HomePage";
import MainLayout from "./pages/MainLayout";

function App() {
  return (
    <div dir="rtl" style={{ padding: "20px" }} className="App">
      <Routes>
        {/* Pages outside the layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages with the Layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/tripoptions" element={<TripOptionsPage />} />
          <Route path="/tripdetails/:tripId" element={<TripDetailsPage />} />
          <Route path="/tripplanner" element={<PlannerPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
// This is the main App component that sets up the routing for the application.
