import Trip from "../models/trip.model.js";
import { callLLMService } from "../services/llmService.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

//------------------------------------------------------------------
// Generate a trip using LLM service without saving to the database
//------------------------------------------------------------------
export const generateTrip = async (req, res) => {
  console.log("---- generateTrip START ----");
  try {
    const { tripName, tripType, country, city } = req.body;

    const llmData = await callLLMService({ tripName, tripType, country, city });

    const trip = {
      ...llmData,
      tripName,
      tripType,
      destination: { country, city },
      userId: req.user.id, 
    };

    console.log("Generated trip:", trip);

    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    console.error("Error generating trip:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//----------------------------------------
// Save the generated trip to the database
//----------------------------------------
export const saveGeneratedTrip = async (req, res) => {
  console.log("---- saveGeneratedTrip START ----");
  try {
    const tripData = req.body;

    const trip = new Trip({
      _tripId: uuidv4(),
      ...tripData,
      userId: req.user.id,
    });

    await trip.save();

    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    console.error("Error saving generated trip:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//----------------
// Get trip by ID
//----------------
export const getTripById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid trip ID",
    });
  }

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
    res.status(200).json({ success: true, data: trip });
    console.log("Trip fetched successfully:", trip);
  } catch (error) {
    console.error("Error fetching trip by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
};

//------------------------------------
// Get all trips for the current user
//------------------------------------
export const getTripsForCurrentUser = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.error("Error fetching trips for current user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips for current user",
      error: error.message,
    });
  }
};

//------------------------
// Delete trip by ID
//------------------------
export const deleteTrip = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid trip ID",
    });
  }

  try {
    await Trip.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete trip",
    });
  }
};

//------------------------------------------------------------------------------
// We are not using this function currently, but it can be useful in the future
//------------------------------------------------------------------------------

// //------------------------
// // Get all trips
// //------------------------
// export const getAllTrips = async (req, res) => {
//   try {
//     const trips = await Trip.find({});
//     res.status(200).json({ success: true, data: trips });
//   } catch (error) {
//     console.error("Error fetching trips:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch trips",
//       error: error.message,
//     });
//   }
// };

// //--------------------------
// // Get all trips by user ID
// //--------------------------
// export const getAllTripsByUser = async (req, res) => {
//   const { userId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid user ID",
//     });
//   }

//   try {
//     const trips = await Trip.find({ userId });
//     res.status(200).json({ success: true, data: trips });
//   } catch (error) {
//     console.error("Error fetching trips by user:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch trips for user",
//       error: error.message,
//     });
//   }
// };

// //-------------------
// // Create a new trip
// //-------------------
// export const createTrip = async (req, res) => {
//   console.log("---- createTrip START ----");
//   try {
//     const { tripName, tripType, country, city } = req.body;

//     const llmData = await callLLMService({ tripName, tripType, country, city }); 

//     const trip = new Trip({
//       _tripId: uuidv4(), // Creating a unique trip ID
//       ...llmData,
//       tripName,
//       tripType,
//       destination: { country, city },
//       userId: req.user.id,
//     });
//     console.log("requestData:", { tripName, tripType, country, city });
//     console.log("llmData:", llmData);
//     console.log("req.user:", req.user);

//     await trip.save();

//     res.status(201).json({ success: true, data: trip });
//   } catch (err) {
//     console.error("Error creating trip:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




