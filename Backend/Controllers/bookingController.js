import Booking from '../models/Booking.js';

// SAVE NEW BOOKING TO MONGODB
// This route is protected, so req.user.userId is available
export const createBooking = async (req, res) => {
  try {
    const { busId, selectedSeats, from, to } = req.body;

    // Use the userId from the authenticated user (attached by middleware)
    const userId = req.user.userId;

    const newBooking = new Booking({
      userId, 
      busId,
      selectedSeats,
      from,
      to
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: 'Booking successfully confirmed!',
      booking: savedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// GET ALL BOOKINGS FOR THE LOGGED-IN USER
export const getUserBookings = async (req, res) => {
  try {
    // Only fetch bookings that belong to the current authenticated user
    const userId = req.user.userId;
    const bookings = await Booking.find({ userId: userId }).populate('busId');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};
