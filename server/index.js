import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import { connectDB } from "./config/db.js";
import tripRoutes from "./routes/trip.route.js";
import userRoutes from "./routes/user.route.js";
import weatherRoutes from "./routes/weather.route.js";
import { initLocalLandIndex } from "./services/localGeoService.js";
import { swaggerDocs } from "./config/swagger.js";

dotenv.config();

// Load land polygons once on startup
initLocalLandIndex();

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

app.post("/api/directions", async (req, res) => {
    try {
        const { coordinates, profile = "foot-walking" } = req.body;

        if (!Array.isArray(coordinates) || coordinates.length < 2) {
            return res.status(400).json({ error: "At least two coordinates are required" });
        }

        const apiKey = process.env.ORS_TOKEN;
        if (!apiKey) {
            return res.status(500).json({ error: "Missing ORS_TOKEN on server" });
        }

        const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

        const orsResp = await axios.post(
            url,
            { coordinates }, // NOTE: ORS expects [lng,lat]
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: apiKey,
                },
                timeout: 15000,
            }
        );

        res.status(200).json(orsResp.data);
    } catch (err) {
        const status = err.response?.status || 500;
        const data = err.response?.data || { error: String(err.message || err) };
        res.status(status).json(data);
    }
});


app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
  swaggerDocs(app);
});
