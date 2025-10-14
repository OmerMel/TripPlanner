import dotenv from "dotenv";
import express from "express";
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

app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
  swaggerDocs(app);
});
