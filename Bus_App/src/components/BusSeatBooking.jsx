import React, { useState } from 'react';
import '../pages/BusSeatBooking.css';

const BusSeatBooking = ({ bus, onBookingUpdate }) => {
  // Initialize seats based on bus.totalSeats
  // Status can be: 'available', 'selected', 'booked'
  const initialSeats = Array.from({ length: parseInt(bus.totalSeats) || 20 }, (_, index) => {
    const seatNumber = index + 1;
    // Check if this seat is already booked (from bus data)
    const isBooked = bus.bookedSeats && bus.bookedSeats.includes(seatNumber);
    
    return {
      id: seatNumber,
      number: seatNumber,
      status: isBooked ? 'booked' : 'available',
    };
  });

  const [seats, setSeats] = useState(initialSeats);

  // Function to handle seat click
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

  // Function to confirm booking
  const handleConfirmBooking = () => {
    const selectedSeatNumbers = seats
      .filter((seat) => seat.status === 'selected')
      .map((seat) => seat.number);

    if (selectedSeatNumbers.length > 0) {
      // Pass the newly booked seats back to the parent component
      onBookingUpdate(selectedSeatNumbers);
      
      // Update local state to show them as booked
      setSeats(
        seats.map((seat) => {
          if (seat.status === 'selected') {
            return { ...seat, status: 'booked' };
          }
          return seat;
        })
      );
    }
  };

  // Filter selected seats to display below
  const selectedSeats = seats.filter((seat) => seat.status === 'selected');

  return (
    <div className="bus-booking-container">
      <h2>GoBus Seat Booking</h2>
      
      {/* Seat Layout Grid */}
      <div className="seat-layout">
        {seats.map((seat) => (
          <button
            key={seat.id}
            className={`seat ${seat.status}`}
            onClick={() => handleSeatClick(seat.id)}
            disabled={seat.status === 'booked'}
          >
            {seat.number}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="box available"></span> Available
        </div>
        <div className="legend-item">
          <span className="box selected"></span> Selected
        </div>
        <div className="legend-item">
          <span className="box booked"></span> Booked
        </div>
      </div>

      {/* Selected Seats Info */}
      <div className="booking-info">
        <h3>Selected Seats:</h3>
        {selectedSeats.length > 0 ? (
          <p>{selectedSeats.map((s) => s.number).join(', ')}</p>
        ) : (
          <p>No seats selected</p>
        )}
        
        <button 
          className="confirm-btn" 
          onClick={handleConfirmBooking}
          disabled={selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BusSeatBooking;
