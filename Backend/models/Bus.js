import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  acType: { type: String, enum: ['AC', 'Non-AC'], required: true },
  startingLocation: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String },
  arrivalTime: { type: String },
  ticketPrice: { type: Number, required: true },
  seatType: { type: String, enum: ['Sleeper', 'Seater'], required: true },
  totalSeats: { type: Number, required: true },
  seats: [{
    number: { type: Number },
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
