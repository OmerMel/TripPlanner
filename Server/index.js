import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import tripRoutes from "./routes/trip.route.js";
import userRoutes from "./routes/user.route.js";
import { swaggerDocs } from "./config/swagger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
  swaggerDocs(app);
});
