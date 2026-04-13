import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';

// SAVE NEW BOOKING TO MONGODB
export const createBooking = async (req, res) => {
  try {
    const { busId, busName, selectedSeats, from, to, date, departureTime, arrivalTime, totalPrice } = req.body;
    const userId = req.user.userId;

    // 1. PREVENT DOUBLE BOOKING
    // We update the bus ONLY IF all selected seats are available (isBooked: false)
    // This is an atomic operation, meaning it happens all at once to prevent race conditions.
    const updatedBus = await Bus.findOneAndUpdate(
      {
        _id: busId,
        // Ensure ALL selected seats are currently available
        seats: {
          $all: selectedSeats.map(num => ({
            $elemMatch: { number: num, isBooked: false }
          }))
        }
      },
      {
        // Mark the selected seats as booked
        $set: { "seats.$[elem].isBooked": true }
      },
      {
        // Tell MongoDB which array elements to update
        arrayFilters: [{ "elem.number": { $in: selectedSeats } }],
        new: true
      }
    );

    // If query fails, it means one or more seats were already booked by someone else
    if (!updatedBus) {
      return res.status(400).json({ message: 'Seat already booked. Please select other seats.' });
    }

    // 2. CREATE BOOKING RECORD
    const bookingId = "GB" + Date.now();
    const newBooking = new Booking({
      userId, 
      busId,
      bookingId,
      busName,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      selectedSeats,
      totalPrice
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: 'Booking successful',
      booking: savedBooking
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// GET A SINGLE BOOKING BY BOOKING ID
export const getBookingByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Find by the unique bookingId field and populate user info
    const booking = await Booking.findOne({ bookingId }).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
};

// GET ALL BOOKINGS FOR THE LOGGED-IN USER
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ userId: userId }).populate('busId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};