import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus',
    required: true 
  },
  bookingId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  busName: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  departureTime: { type: String },
  arrivalTime: { type: String },
  selectedSeats: { 
    type: [Number], 
    required: true 
  },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
