import Bus from "../models/Bus.js";


// CREATE BUS
export const createBus = async (busData) => {
  // 1. Validate totalSeats to ensure it is a positive number
  const totalSeats = Number(busData.totalSeats);
  
  if (!totalSeats || totalSeats <= 0) {
    throw new Error("Invalid totalSeats. Please provide a positive number greater than 0.");
  }

  // 2. Automatically generate seats array
  const generatedSeats = [];
  for (let i = 1; i <= totalSeats; i++) {
    generatedSeats.push({
      number: i,
      isBooked: false
    });
  }

  // 3. Create and save the bus
  const bus = new Bus({
    ...busData,
    seats: generatedSeats
  });

  const savedBus = await bus.save();
  return savedBus;
};



// SEARCH BUSES
export const searchBusesService = async (filter) => {
  const buses = await Bus.find(filter);
  return buses;
};



// GET ALL BUSES
export const getAllBuses = async () => {

  const buses = await Bus.find();

  return buses;

};



// GET BUS BY ID
export const getBusById = async (id) => {

  const bus = await Bus.findById(id);

  return bus;

};



// UPDATE BUS
export const updateBus = async (id, updateData) => {

  const updatedBus = await Bus.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  return updatedBus;

};



// DELETE BUS
export const deleteBus = async (id) => {

  const deletedBus = await Bus.findByIdAndDelete(id);

  return deletedBus;

};