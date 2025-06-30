/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTrip,
  deleteTrip,
  getAllTrips,
  getAllTripsByUser,
  getTripById,
  updateTrip,
} from "../controllers/trip.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/trips:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trip created
 */
router.post("/", protect, createTrip);
router.delete("/:id", deleteTrip);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of all trips
 */
router.get("/", getAllTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Trip data
 *       404:
 *         description: Trip not found
 */
router.get("/:id", getTripById);
router.get("/:userId", getAllTripsByUser);
router.put("/:id", updateTrip);

export default router;
