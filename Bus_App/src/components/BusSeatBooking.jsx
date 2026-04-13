import React, { useState } from 'react';
import '../pages/BusSeatBooking.css';

const BusSeatBooking = ({ bus, onBookingUpdate }) => {
  // Use the seats array sent from the backend Bus model
  // Status: 'available' (Green), 'booked' (Red), 'selected' (Blue)
  const initialSeats = (bus.seats || []).map((seat) => ({
    id: seat.number,
    number: seat.number,
    status: seat.isBooked ? 'booked' : 'available',
  }));

  const [seats, setSeats] = useState(initialSeats);

  const handleSeatClick = (id) => {
    setSeats(
      seats.map((seat) => {
        if (seat.id === id) {
          if (seat.status === 'available') {
            return { ...seat, status: 'selected' };
          } else if (seat.status === 'selected') {
            return { ...seat, status: 'available' };
          }
        }
        return seat;
      })
    );
  };

  const handleConfirmBooking = () => {
    const selectedSeatNumbers = seats
      .filter((seat) => seat.status === 'selected')
      .map((seat) => seat.number);

    if (selectedSeatNumbers.length > 0) {
      onBookingUpdate(selectedSeatNumbers);
    }
  };

  const selectedSeats = seats.filter((seat) => seat.status === 'selected');

  return (
    <div className="bus-booking-container">
      <h2>Select Your Seats</h2>
      
      {/* Seat Layout Grid */}
      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat-box ${seat.status}`}
            onClick={() => seat.status !== 'booked' && handleSeatClick(seat.id)}
          >
            {seat.number}
          </div>
        ))}
      </div>

      {/* Legend with simple colors */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="color-box available"></div> <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="color-box selected"></div> <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="color-box booked"></div> <span>Booked</span>
        </div>
      </div>

      <div className="selection-summary">
        <p>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : 'None'}</strong></p>
        <button 
          className="book-now-btn" 
          onClick={handleConfirmBooking}
          disabled={selectedSeats.length === 0}
        >
          Book Now
        </button>
      </div>

      <style>{`
        .seat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          margin: 20px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }
        .seat-box {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
          border: 1px solid #ddd;
        }
        .available { background-color: #28a745; color: white; } /* Green */
        .selected { background-color: #007bff; color: white; } /* Blue */
        .booked { background-color: #dc3545; color: white; cursor: not-allowed; } /* Red */
        
        .seat-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .legend-item { display: flex; alignItems: center; gap: 8px; }
        .color-box { width: 20px; height: 20px; border-radius: 3px; }
        .book-now-btn {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .book-now-btn:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default BusSeatBooking;
