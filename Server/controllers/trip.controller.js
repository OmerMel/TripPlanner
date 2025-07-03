import Trip from "../models/trip.model.js";
import { callLLMService } from "../services/llmService.js";
import { v4 as uuidv4 } from "uuid";

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
};

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
  } catch (error) {
    console.error("Error fetching trip by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
};

export const getAllTripsByUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  try {
    const trips = await Trip.find({ userId });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.error("Error fetching trips by user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips for user",
      error: error.message,
    });
  }
};

export const updateTrip = async (req, res) => {
  const { id } = req.params;
  const tripData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid trip ID",
    });
  }

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(id, tripData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    console.error("Error updating trip:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update trip",
      error: error.message,
    });
  }
};

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

// export const createTrip = async (req, res) => {
//   const trip = req.body;
//   if (!trip.tripName) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Trip name is required" });
//   }

//   const newTrip = new Trip(trip);
//   try {
//     await newTrip.save();
//     res.status(201).json({ success: true, data: newTrip });
//   } catch (error) {
//     console.error("Error creating trip:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create trip",
//       error: error.message,
//     });
//   }
// };

export const createTrip = async (req, res) => {
  console.log("---- createTrip START ----");
  try {
    const { tripName, tripType, country, city } = req.body;

    // כאן אני למעשה אבצע קריאה בעתיד לצ'אט ואשלח לו את הפרטים שהמשתמש הכניס באתר והוא יחזיר לי את שאר הפרטים
    const llmData = await callLLMService({ tripName, tripType, country, city });

    const trip = new Trip({
      _tripId: uuidv4(), // Creating a unique trip ID
      ...llmData,
      tripName,
      tripType,
      destination: { country, city },
      userId: req.user.id,
    });
    console.log("requestData:", { tripName, tripType, country, city });
    console.log("llmData:", llmData);
    console.log("req.user:", req.user);

    await trip.save();

    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
