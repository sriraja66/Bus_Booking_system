import Bus from "../models/Bus.js";


// CREATE BUS
export const createBus = async (busData) => {

  const bus = new Bus(busData);

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