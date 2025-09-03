/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteTrip,
  getTripById,
  saveGeneratedTrip,
  getTripsForCurrentUser,
  generateTrip,
} from "../controllers/trip.controller.js";

const router = express.Router();

//------------------------
// Generate a new trip
//------------------------
/**
 * @swagger
 * /api/trips/generate:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Generate a new trip (without saving)
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripName
 *               - tripType
 *               - country
 *               - city
 *             properties:
 *               tripName:
 *                 type: string
 *                 example: "טיול רגלי בהרי ירושלים"
 *               tripType:
 *                 type: string
 *                 enum: [bicycle, trek]
 *                 example: trek
 *               country:
 *                 type: string
 *                 example: ישראל
 *               city:
 *                 type: string
 *                 example: ירושלים
 *     responses:
 *       200:
 *         description: Generated trip details
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/generate", protect, generateTrip);

// //------------------------
// // Create a new trip
// //------------------------
// /**
//  * @swagger
//  * /api/trips:
//  *   post:
//  *     security:
//  *       - BearerAuth: []
//  *     summary: Create a new trip
//  *     tags: [Trips]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - tripName
//  *               - tripType
//  *               - country
//  *               - city
//  *             properties:
//  *               tripName:
//  *                 type: string
//  *                 example: "טיול אופניים בגליל"
//  *               tripType:
//  *                 type: string
//  *                 enum: [bicycle, trek]
//  *                 example: bicycle
//  *               country:
//  *                 type: string
//  *                 example: ישראל
//  *               city:
//  *                 type: string
//  *                 example: חיפה
//  *     responses:
//  *       201:
//  *         description: Trip created
//  */
// router.post("/", protect, createTrip);

//------------------------
// Delete a trip by ID
//------------------------
// @swagger
// /api/trips/{id}:
/**
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Delete a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID to delete
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */
router.delete("/:id", deleteTrip);

// //------------------------
// // Get all trips
// //------------------------
// /**
//  * @swagger
//  * /api/trips:
//  *   get:
//  *     summary: Get all trips
//  *     tags: [Trips]
//  *     responses:
//  *       200:
//  *         description: List of all trips
//  */
// router.get("/", getAllTrips);

//---------------------------
// Get all trips for current user
//---------------------------
/**
 * @swagger
 * /api/trips/my:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get all trips for the logged-in user
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: List of trips for the current user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my", protect, getTripsForCurrentUser);

// //---------------------------
// // Get all trips by user ID
// //---------------------------

// /**
//  * @swagger
//  * /api/trips/user/{userId}:
//  *   get:
//  *     summary: Get all trips for a specific user
//  *     tags: [Trips]
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the user
//  *     responses:
//  *       200:
//  *         description: List of trips for the user
//  *       400:
//  *         description: Invalid user ID
//  *       500:
//  *         description: Server error
//  */
// router.get("/user/:userId", getAllTripsByUser);

//---------------------------
// Get trips by ID
//---------------------------
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

//---------------------------
// Save trip to DB
//---------------------------
/**
 * @swagger
 * /api/trips/save:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Save a generated trip to the database
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The full trip object returned from generate
 *     responses:
 *       201:
 *         description: Trip saved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/save", protect, saveGeneratedTrip);

export default router;
