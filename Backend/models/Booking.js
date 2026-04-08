import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Optional for now as requested
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus',
    required: true 
  },
  selectedSeats: { 
    type: [Number], 
    required: true 
  },
  from: { 
    type: String, 
    required: true 
  },
  to: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
