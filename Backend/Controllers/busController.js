import * as busService from "../services/busService.js";


// CREATE BUS
export const createBus = async (req, res) => {

  try {

    const busData = req.body;

    const newBus = await busService.createBus(busData);
    

    res.status(201).json(newBus);

  } catch (error) {

    res.status(500).json({ message: "Error creating bus", error: error.message });

  }

};



// SEARCH BUSES
export const searchBuses = async (req, res) => {
  try {
    const { startingLocation, destination } = req.query;

    // Use a case-insensitive regex for searching location string
    const filter = {};
    if (startingLocation) filter.startingLocation = new RegExp(startingLocation, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');

    const buses = await busService.searchBusesService(filter);
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Error searching buses", error: error.message });
  }
};



// GET ALL BUSES
export const getAllBuses = async (req, res) => {

  try {

    const buses = await busService.getAllBuses();

    res.json(buses);

  } catch (error) {

    res.status(500).json({ message: "Error getting buses", error: error.message });

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