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

    // States for Bus Uploader Configuration
    const [busTypes, setBusTypes] = useState([]);
    const [acType, setAcType] = useState('');
    const [seatCounts, setSeatCounts] = useState({ Sleeper: '', Seater: '' });

    const handleBusTypeToggle = (type) => {
        setBusTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleSeatCountChange = (type, value) => {
        setSeatCounts(prev => ({ ...prev, [type]: value }));
    };

    if (!bus) {
        return (
            <div className="error-container">
                <h2>No bus selected!</h2>
                <button onClick={() => navigate('/buses')}>Go back to Buses</button>
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

            const bookingPayload = {
                busId: currentBus._id || currentBus.id, 
                selectedSeats: newBookedSeats,
                from: currentBus.startingLocation,
                to: currentBus.destination
            };

            await apiService.createBooking(bookingPayload);

            // Update local state to reflect new booking safely
            const updatedBookedSeats = [...(currentBus.bookedSeats || []), ...newBookedSeats];
            setCurrentBus({ ...currentBus, bookedSeats: updatedBookedSeats });
            
            alert(`Booking confirmed for seats: ${newBookedSeats.join(', ')}`);
        } catch (err) {
            console.error("Booking Error:", err);
            alert(err.message || "There was an error processing your booking.");
        }
    };

    return (
        <div className="seat-booking-page">
            <div className="booking-header">
                <button className="back-btn" onClick={() => navigate('/buses')}>← Back to List</button>
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

            <div className="uploader-config">
                <h3>Bus Uploader Configuration</h3>
                <div className="config-group">
                    <label className="config-label">Bus Type (Multi-selection):</label>
                    <div className="checkbox-group">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={busTypes.includes('Sleeper')} 
                                onChange={() => handleBusTypeToggle('Sleeper')} 
                            /> Sleeper
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={busTypes.includes('Seater')} 
                                onChange={() => handleBusTypeToggle('Seater')} 
                            /> Seater
                        </label>
                    </div>
                </div>
                
                {busTypes.includes('Sleeper') && (
                    <div className="config-group">
                        <label className="config-label">Number of Sleeper Seats:</label>
                        <input 
                            className="config-input"
                            type="number" 
                            value={seatCounts.Sleeper} 
                            onChange={(e) => handleSeatCountChange('Sleeper', e.target.value)}
                            min="0"
                            placeholder="Enter sleeper seats count"
                        />
                    </div>
                )}

                {busTypes.includes('Seater') && (
                    <div className="config-group">
                        <label className="config-label">Number of Seater Seats:</label>
                        <input 
                            className="config-input"
                            type="number" 
                            value={seatCounts.Seater} 
                            onChange={(e) => handleSeatCountChange('Seater', e.target.value)}
                            min="0"
                            placeholder="Enter seater seats count"
                        />
                    </div>
                )}

                <div className="config-group">
                    <label className="config-label">AC Type (Single Selection):</label>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                name="acType"
                                value="AC" 
                                checked={acType === 'AC'} 
                                onChange={(e) => setAcType(e.target.value)} 
                            /> AC
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="acType"
                                value="Non-AC" 
                                checked={acType === 'Non-AC'} 
                                onChange={(e) => setAcType(e.target.value)} 
                            /> Non-AC
                        </label>
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
