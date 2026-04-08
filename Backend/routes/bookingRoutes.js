import express from 'express';
import { createBooking, getUserBookings } from '../Controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new booking (Protected)
router.post('/', authMiddleware, createBooking);

// Route to get current user's bookings (Protected)
router.get('/my-bookings', authMiddleware, getUserBookings);

export default router;
