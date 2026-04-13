import * as busService from "../services/busService.js";


// CREATE BUS
export const createBus = async (req, res) => {
  try {
    // 1. Log the incoming data to see what the frontend is sending
    console.log("--- New Bus Request ---");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    const busData = req.body;
    
    // 2. Simple validation for beginners
    if (!busData.seatType) {
      return res.status(400).json({ message: "Please select a seat type (Sleeper or Seater)" });
    }
    if (!busData.totalSeats || busData.totalSeats <= 0) {
      return res.status(400).json({ message: "Please enter a valid number of seats" });
    }

    // 3. Call the service to create the bus
    const newBus = await busService.createBus(busData);
    
    console.log("✅ Bus successfully saved to database");

    res.status(201).json({ 
      message: "Bus added successfully", 
      bus: newBus 
    });
  } catch (error) {
    // 3. Log the full error in the terminal for debugging
    console.error("❌ Error in createBus Controller:");
    console.error(error);

    // 4. Return the specific error message to the frontend
    res.status(500).json({ 
      message: error.message || "Failed to create bus" 
    });
  }
};


// GET ALL BUSES
export const getAllBuses = async (req, res) => {
  try {
    const buses = await busService.getAllBuses();
    
    // Exactly as requested: Verify GET API
    console.log("FETCHED BUSES:", buses);

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Error getting buses", error: error.message });
  }
};


// SEARCH BUSES
export const searchBuses = async (req, res) => {
  try {
    const from = (req.query.from || "").trim();
    const to   = (req.query.to   || "").trim();

    console.log("FROM:", `"${from}"`);
    console.log("TO:", `"${to}"`);

    if (!from || !to) {
      return res.status(400).json({ message: "Please provide both from and to locations" });
    }

    const buses = await busService.searchBusesService({
      startingLocation: { $regex: `^${from}$`, $options: "i" },
      destination:      { $regex: `^${to}$`,   $options: "i" },
    });

    console.log("RESULT count:", buses.length);
    res.json(buses);
  } catch (error) {
    console.error("[Search] Error:", error.message);
    res.status(500).json({ message: "Error searching buses", error: error.message });
  }
};



// GET BUS BY ID
export const getBusById = async (req, res) => {

  try {

    const id = req.params.id;

    const bus = await busService.getBusById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);

  } catch (error) {

    res.status(500).json({ message: "Error getting bus", error: error.message });

  }

};



// UPDATE BUS
export const updateBus = async (req, res) => {

  try {

    const id = req.params.id;

    const data = req.body;

    const updatedBus = await busService.updateBus(id, data);

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(updatedBus);

  } catch (error) {

    res.status(500).json({ message: "Error updating bus", error: error.message });

  }

};



// DELETE BUS
export const deleteBus = async (req, res) => {

  try {

    const id = req.params.id;

    const deletedBus = await busService.deleteBus(id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Error deleting bus", error: error.message });

  }

};