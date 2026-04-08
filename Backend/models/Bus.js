import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true },
  deckType: { type: String, enum: ['Single Deck', 'Double Deck'], default: 'Single Deck' },
  acType: { type: String, enum: ['AC', 'Non-AC'], required: true },
  startingLocation: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String },
  arrivalTime: { type: String },
  ticketPrice: { type: Number, required: true },
  busTypes: { type: [String], default: [] }, // e.g. ['Sleeper', 'Seater']
  sleeperSeats: { type: Number, default: 0 },
  seaterSeats: { type: Number, default: 0 },
  bookedSeats: { type: [Number], default: [] } // Array of seat numbers already booked
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
