import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getBookingByBookingId,
  getAllBookings 
} from '../Controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    Fetch all bookings (Global/Admin)
 * @access  Public (for verification)
 */
router.get('/', getAllBookings);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Protected
 */
router.post('/', authMiddleware, createBooking);

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the logged-in user
 * @access  Protected
 */
router.get('/my-bookings', authMiddleware, getUserBookings);

/**
 * @route   GET /api/bookings/ticket/:bookingId
 * @desc    Get a single booking by custom bookingId
 * @access  Protected
 */
router.get('/ticket/:bookingId', authMiddleware, getBookingByBookingId);

export default router;
