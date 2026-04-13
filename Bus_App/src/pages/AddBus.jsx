import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AddBus.css';
import { apiService } from '../services/apiService';

const AddBus = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // 1. Simplified formData - NO deckType, NO separate seat counts
    const [formData, setFormData] = useState({
        busName: '',
        busNumber: '',
        seatType: '',        // 'Sleeper' or 'Seater'
        totalSeats: '',      // Just one number for all seats
        acType: '',
        startingLocation: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        price: '',           // Ticket price
        boardingPoints: ''
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error message when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validation logic
    const validate = () => {
        let newErrors = {};
        if (!formData.busName) newErrors.busName = 'Bus Name is required';
        if (!formData.busNumber) newErrors.busNumber = 'Bus Number is required';
        if (!formData.seatType) newErrors.seatType = 'Select a seat type (Sleeper or Seater)';
        if (!formData.totalSeats || Number(formData.totalSeats) <= 0) {
            newErrors.totalSeats = 'Enter a valid number of seats';
        }
        if (!formData.acType) newErrors.acType = 'Please select AC type';
        if (!formData.startingLocation) newErrors.startingLocation = 'Starting location is required';
        if (!formData.destination) newErrors.destination = 'Destination is required';
        if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
        if (!formData.arrivalTime) newErrors.arrivalTime = 'Arrival time is required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Enter a valid ticket price';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (validate()) {
            setLoading(true);
            try {
                // 2. Prepare clean data for Backend
                // We send EXACTLY what the backend schema expects
                const busData = {
                    busName: formData.busName,
                    busNumber: formData.busNumber,
                    seatType: formData.seatType,
                    totalSeats: Number(formData.totalSeats),
                    acType: formData.acType,
                    startingLocation: formData.startingLocation,
                    destination: formData.destination,
                    departureTime: formData.departureTime,
                    arrivalTime: formData.arrivalTime,
                    ticketPrice: Number(formData.price),
                    boardingPoints: formData.boardingPoints
                };

                console.log("--- Sending CLEAN Bus Data (No deckType) ---");
                console.log(busData);

                const response = await apiService.createBus(busData);
                console.log("Success:", response);

                alert('Bus Added Successfully!');
                navigate('/uploader/buses');
            } catch (err) {
                console.error("Submit Error:", err);
                setSubmitError(err.message || "Failed to add bus");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="add-bus-container">
            <h2>Add New Bus Details</h2>
            
            {submitError && (
                <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' }}>
                    ⚠️ {submitError}
                </div>
            )}

            <form className="bus-form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="form-group">
                    <label>Bus Name</label>
                    <input type="text" name="busName" value={formData.busName} onChange={handleChange} placeholder="e.g. SRS Travels" className={errors.busName ? 'error' : ''} />
                    {errors.busName && <span className="error-text">{errors.busName}</span>}
                </div>

                <div className="form-group">
                    <label>Bus Number</label>
                    <input type="text" name="busNumber" value={formData.busNumber} onChange={handleChange} placeholder="e.g. TN-01-AB-1234" className={errors.busNumber ? 'error' : ''} />
                    {errors.busNumber && <span className="error-text">{errors.busNumber}</span>}
                </div>

                {/* Seat Type - Radio Buttons */}
                <div className="form-group full-width" style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px', background: '#f9fafb' }}>
                    <label style={{ fontWeight: 'bold' }}>Seat Type</label>
                    <div className="radio-group" style={{ marginTop: '10px' }}>
                        <label>
                            <input type="radio" name="seatType" value="Sleeper" checked={formData.seatType === 'Sleeper'} onChange={handleChange} />
                            Sleeper
                        </label>
                        <label>
                            <input type="radio" name="seatType" value="Seater" checked={formData.seatType === 'Seater'} onChange={handleChange} />
                            Seater
                        </label>
                    </div>
                    {errors.seatType && <span className="error-text">{errors.seatType}</span>}

                    <div style={{ marginTop: '15px' }}>
                        <label>Total Number of Seats</label>
                        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} placeholder="e.g. 40" className={errors.totalSeats ? 'error' : ''} />
                        {errors.totalSeats && <span className="error-text">{errors.totalSeats}</span>}
                    </div>
                </div>

                {/* AC Type */}
                <div className="form-group full-width">
                    <label>AC/Non-AC</label>
                    <div className="radio-group">
                        <label>
                            <input type="radio" name="acType" value="AC" checked={formData.acType === 'AC'} onChange={handleChange} />
                            AC
                        </label>
                        <label>
                            <input type="radio" name="acType" value="Non-AC" checked={formData.acType === 'Non-AC'} onChange={handleChange} />
                            Non-AC
                        </label>
                    </div>
                    {errors.acType && <span className="error-text">{errors.acType}</span>}
                </div>

                {/* Route Info */}
                <div className="form-group">
                    <label>Starting Location</label>
                    <input type="text" name="startingLocation" value={formData.startingLocation} onChange={handleChange} placeholder="Source City" />
                    {errors.startingLocation && <span className="error-text">{errors.startingLocation}</span>}
                </div>

                <div className="form-group">
                    <label>Destination</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination City" />
                    {errors.destination && <span className="error-text">{errors.destination}</span>}
                </div>

                {/* Time & Price */}
                <div className="form-group">
                    <label>Departure Time</label>
                    <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Arrival Time</label>
                    <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Ticket Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 800" />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label>Boarding Points</label>
                    <input type="text" name="boardingPoints" value={formData.boardingPoints} onChange={handleChange} placeholder="e.g. Point A, Point B" />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Bus Details'}
                </button>
            </form>
        </div>
    );
};

export default AddBus;
