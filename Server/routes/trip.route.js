import express from "express";

import {
  createTrip,
  deleteTrip,
  getAllTrips,
  getAllTripsByUser,
  getTripById,
  updateTrip,
} from "../controllers/trip.controller.js";

const router = express.Router();

router.post("/", createTrip);
router.delete("/:id", deleteTrip);
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.get("/:userId", getAllTripsByUser);
router.put("/:id", updateTrip);

export default router;
