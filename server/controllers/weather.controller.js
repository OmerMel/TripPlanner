// Server/controllers/weather.controller.js
import axios from "axios";

export const getWeatherForecast = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "Missing coordinates" });
  }

  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        daily: ["temperature_2m_max", "temperature_2m_min"],
        current: ["temperature_2m"],
        timezone: "auto",
      },
    });

    const data = response.data;

    res.status(200).json({
      success: true,
      currentTemp: Math.round(data.current.temperature_2m),
      forecast: data.daily.time.slice(1, 4).map((date, index) => ({
        date,
        min: Math.round(data.daily.temperature_2m_min[index]),
        max: Math.round(data.daily.temperature_2m_max[index]),
      })),
    });
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch weather" });
  }
};
