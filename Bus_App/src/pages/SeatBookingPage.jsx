import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BusSeatBooking from '../components/BusSeatBooking';
import "../pages/SeatBookingPage.css";
import { apiService } from '../services/apiService';

const SeatBookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bus } = location.state || {};

    // Local state for the bus to handle immediate UI updates
    const [currentBus, setCurrentBus] = useState(bus);

    if (!bus) {
        return (
            <div className="error-container">
                <h2>No bus selected!</h2>
                <button onClick={() => navigate('/dashboard')}>Go back to Search</button>
            </div>
        );
    }

    const handleBookingUpdate = async (newBookedSeats) => {
        try {
            // Verify user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to book a seat!");
                navigate('/login');
                return;
            }

            // Get travel date from URL query params
            const queryParams = new URLSearchParams(location.search);
            const travelDate = queryParams.get('date') || new Date().toISOString().split('T')[0];

            const bookingPayload = {
                busId: currentBus._id || currentBus.id, 
                busName: currentBus.busName,
                selectedSeats: newBookedSeats,
                from: currentBus.startingLocation,
                to: currentBus.destination,
                date: travelDate,
                departureTime: currentBus.departureTime,
                arrivalTime: currentBus.arrivalTime,
                totalPrice: newBookedSeats.length * (currentBus.ticketPrice || 0)
            };

            const response = await apiService.createBooking(bookingPayload);

            // Navigate to the ticket page using the unique bookingId from backend
            navigate(`/ticket/${response.booking.bookingId}`);
        } catch (err) {
            console.error("Booking Error:", err);
            alert(err.message || "There was an error processing your booking.");
        }
    };

    return (
        <div className="seat-booking-page">
            <div className="booking-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <div className="bus-info-card">
                    <h1>{currentBus.busName}</h1>
                    <div className="info-grid">
                        <p><strong>Bus Number:</strong> {currentBus.busNumber}</p>
                        <p><strong>Route:</strong> {currentBus.startingLocation} to {currentBus.destination}</p>
                        <p><strong>Time:</strong> {currentBus.departureTime} - {currentBus.arrivalTime}</p>
                        <p><strong>Price:</strong> ₹{currentBus.ticketPrice}</p>
                    </div>
                </div>
            </div>

            <BusSeatBooking 
                bus={currentBus} 
                onBookingUpdate={handleBookingUpdate} 
            />
        </div>
    );
};

export default SeatBookingPage;
