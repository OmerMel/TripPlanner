// Server/routes/weather.route.js
import express from "express";
import { getWeatherForecast } from "../controllers/weather.controller.js";

const router = express.Router();

router.get("/", getWeatherForecast);

export default router;
