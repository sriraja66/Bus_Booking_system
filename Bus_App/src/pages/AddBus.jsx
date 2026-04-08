import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AddBus.css';
import { apiService } from '../services/apiService';

const AddBus = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        busName: '',
        busNumber: '',
        deckType: '',
        busTypes: [],
        sleeperSeats: '',
        seaterSeats: '',
        upperSleeperSeats: '',
        lowerDeckTypes: [],
        lowerSleeperSeats: '',
        lowerSeaterSeats: '',
        acType: '',
        startingLocation: '',
        endingLocation: '',
        boardingPoints: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        busImage: null,
        imagePreview: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'busImage') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({
                        ...formData,
                        busImage: file.name, // Store filename for reference
                        imagePreview: reader.result // Base64 string for preview
                    });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleBusTypeToggle = (type) => {
        setFormData((prev) => {
            const types = prev.busTypes.includes(type)
                ? prev.busTypes.filter(t => t !== type)
                : [...prev.busTypes, type];
            return { ...prev, busTypes: types };
        });
        if (errors.busTypes) {
            setErrors(prev => ({ ...prev, busTypes: '' }));
        }
    };

    const handleLowerDeckTypeToggle = (type) => {
        setFormData((prev) => {
            const types = prev.lowerDeckTypes.includes(type)
                ? prev.lowerDeckTypes.filter(t => t !== type)
                : [...prev.lowerDeckTypes, type];
            return { ...prev, lowerDeckTypes: types };
        });
        if (errors.lowerDeckTypes) {
            setErrors(prev => ({ ...prev, lowerDeckTypes: '' }));
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.busName) newErrors.busName = 'Bus Name is required';
        if (!formData.busNumber) newErrors.busNumber = 'Bus Number is required';
        if (!formData.deckType) newErrors.deckType = 'Please select a deck type';
        
        if (formData.deckType === 'Single Deck') {
            if (!formData.busTypes || formData.busTypes.length === 0) newErrors.busTypes = 'Please select at least one bus type';
            if (formData.busTypes.includes('Sleeper') && (!formData.sleeperSeats || formData.sleeperSeats <= 0)) newErrors.sleeperSeats = 'Valid seat count required';
            if (formData.busTypes.includes('Seater') && (!formData.seaterSeats || formData.seaterSeats <= 0)) newErrors.seaterSeats = 'Valid seat count required';
        } else if (formData.deckType === 'Double Deck') {
            if (!formData.upperSleeperSeats || formData.upperSleeperSeats <= 0) newErrors.upperSleeperSeats = 'Valid seat count required';
            if (!formData.lowerDeckTypes || formData.lowerDeckTypes.length === 0) newErrors.lowerDeckTypes = 'Select at least one lower deck type';
            if (formData.lowerDeckTypes.includes('Sleeper') && (!formData.lowerSleeperSeats || formData.lowerSleeperSeats <= 0)) newErrors.lowerSleeperSeats = 'Valid seat count required';
            if (formData.lowerDeckTypes.includes('Seater') && (!formData.lowerSeaterSeats || formData.lowerSeaterSeats <= 0)) newErrors.lowerSeaterSeats = 'Valid seat count required';
        }

        if (!formData.acType) newErrors.acType = 'Please select AC type';
        if (!formData.startingLocation) newErrors.startingLocation = 'Starting location is required';
        if (!formData.endingLocation) newErrors.endingLocation = 'Destination is required';
        if (!formData.boardingPoints) newErrors.boardingPoints = 'Boarding points are required';
        if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
        if (!formData.arrivalTime) newErrors.arrivalTime = 'Arrival time is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid ticket price is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        if (validate()) {
            setLoading(true);
            try {
                // Map frontend fields to backend schema if necessary
                // The backend schema currently has: busName, busNumber, deckType, acType, startingLocation, destination, ticketPrice
                // Other fields can be added to the backend model or sent as-is if the model supports it
                
                const busData = {
                    busName: formData.busName,
                    busNumber: formData.busNumber,
                    deckType: formData.deckType,
                    acType: formData.acType,
                    startingLocation: formData.startingLocation,
                    destination: formData.endingLocation,
                    ticketPrice: Number(formData.price),
                    // Adding extra fields (backend model should be updated to support these)
                    departureTime: formData.departureTime,
                    arrivalTime: formData.arrivalTime,
                    busTypes: formData.busTypes,
                    sleeperSeats: Number(formData.sleeperSeats || 0),
                    seaterSeats: Number(formData.seaterSeats || 0)
                };

                await apiService.createBus(busData);
                
                alert('Bus Details Added Successfully!');
                navigate('/buses');
            } catch (err) {
                setSubmitError(err.message || "Failed to add bus");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="add-bus-container">
            <h2>Add New Bus Details</h2>
            <form className="bus-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="busName">Bus Name</label>
                    <input
                        type="text"
                        id="busName"
                        name="busName"
                        value={formData.busName}
                        onChange={handleChange}
                        placeholder="e.g. Express Travels"
                        className={errors.busName ? 'error' : ''}
                    />
                    {errors.busName && <span className="error-text">{errors.busName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="busNumber">Bus Number</label>
                    <input
                        type="text"
                        id="busNumber"
                        name="busNumber"
                        value={formData.busNumber}
                        onChange={handleChange}
                        placeholder="e.g. TN-01-AB-1234"
                        className={errors.busNumber ? 'error' : ''}
                    />
                    {errors.busNumber && <span className="error-text">{errors.busNumber}</span>}
                </div>

                <div className="form-group full-width">
                    <label>Deck Type</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="deckType"
                                value="Single Deck"
                                checked={formData.deckType === 'Single Deck'}
                                onChange={handleChange}
                            />
                            Single Deck
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="deckType"
                                value="Double Deck"
                                checked={formData.deckType === 'Double Deck'}
                                onChange={handleChange}
                            />
                            Double Deck
                        </label>
                    </div>
                    {errors.deckType && <span className="error-text">{errors.deckType}</span>}
                </div>

                {formData.deckType === 'Single Deck' && (
                    <>
                        <div className="form-group full-width">
                            <label>Seat Type (Multi-selection)</label>
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="busTypes"
                                        value="Sleeper"
                                        checked={formData.busTypes.includes('Sleeper')}
                                        onChange={() => handleBusTypeToggle('Sleeper')}
                                    />
                                    Sleeper
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="busTypes"
                                        value="Seater"
                                        checked={formData.busTypes.includes('Seater')}
                                        onChange={() => handleBusTypeToggle('Seater')}
                                    />
                                    Seater
                                </label>
                            </div>
                            {errors.busTypes && <span className="error-text">{errors.busTypes}</span>}
                        </div>

                        {formData.busTypes.includes('Sleeper') && (
                            <div className="form-group">
                                <label htmlFor="sleeperSeats">Number of Sleeper Seats</label>
                                <input
                                    type="number"
                                    id="sleeperSeats"
                                    name="sleeperSeats"
                                    value={formData.sleeperSeats}
                                    onChange={handleChange}
                                    placeholder="e.g. 20"
                                    className={errors.sleeperSeats ? 'error' : ''}
                                />
                                {errors.sleeperSeats && <span className="error-text">{errors.sleeperSeats}</span>}
                            </div>
                        )}

                        {formData.busTypes.includes('Seater') && (
                            <div className="form-group">
                                <label htmlFor="seaterSeats">Number of Seater Seats</label>
                                <input
                                    type="number"
                                    id="seaterSeats"
                                    name="seaterSeats"
                                    value={formData.seaterSeats}
                                    onChange={handleChange}
                                    placeholder="e.g. 40"
                                    className={errors.seaterSeats ? 'error' : ''}
                                />
                                {errors.seaterSeats && <span className="error-text">{errors.seaterSeats}</span>}
                            </div>
                        )}
                    </>
                )}

                {formData.deckType === 'Double Deck' && (
                    <>
                        <div className="form-group full-width" style={{ marginTop: '0.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#374151' }}>Upper Deck (Sleeper Only)</h3>
                            <div className="form-group">
                                <label htmlFor="upperSleeperSeats">Number of Upper Deck Sleeper Seats</label>
                                <input
                                    type="number"
                                    id="upperSleeperSeats"
                                    name="upperSleeperSeats"
                                    value={formData.upperSleeperSeats}
                                    onChange={handleChange}
                                    placeholder="e.g. 15"
                                    className={errors.upperSleeperSeats ? 'error' : ''}
                                />
                                {errors.upperSleeperSeats && <span className="error-text">{errors.upperSleeperSeats}</span>}
                            </div>
                        </div>

                        <div className="form-group full-width" style={{ marginTop: '0.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#374151' }}>Lower Deck</h3>
                            <div className="form-group full-width">
                                <label>Lower Deck Type (Multi-selection)</label>
                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.lowerDeckTypes.includes('Sleeper')}
                                            onChange={() => handleLowerDeckTypeToggle('Sleeper')}
                                        />
                                        Sleeper
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.lowerDeckTypes.includes('Seater')}
                                            onChange={() => handleLowerDeckTypeToggle('Seater')}
                                        />
                                        Seater
                                    </label>
                                </div>
                                {errors.lowerDeckTypes && <span className="error-text">{errors.lowerDeckTypes}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                {formData.lowerDeckTypes.includes('Sleeper') && (
                                    <div className="form-group">
                                        <label htmlFor="lowerSleeperSeats">Lower Deck Sleeper Seats</label>
                                        <input
                                            type="number"
                                            id="lowerSleeperSeats"
                                            name="lowerSleeperSeats"
                                            value={formData.lowerSleeperSeats}
                                            onChange={handleChange}
                                            placeholder="e.g. 10"
                                            className={errors.lowerSleeperSeats ? 'error' : ''}
                                        />
                                        {errors.lowerSleeperSeats && <span className="error-text">{errors.lowerSleeperSeats}</span>}
                                    </div>
                                )}

                                {formData.lowerDeckTypes.includes('Seater') && (
                                    <div className="form-group">
                                        <label htmlFor="lowerSeaterSeats">Lower Deck Seater Seats</label>
                                        <input
                                            type="number"
                                            id="lowerSeaterSeats"
                                            name="lowerSeaterSeats"
                                            value={formData.lowerSeaterSeats}
                                            onChange={handleChange}
                                            placeholder="e.g. 20"
                                            className={errors.lowerSeaterSeats ? 'error' : ''}
                                        />
                                        {errors.lowerSeaterSeats && <span className="error-text">{errors.lowerSeaterSeats}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="form-group full-width">
                    <label>AC Type (Single Selection)</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="acType"
                                value="AC"
                                checked={formData.acType === 'AC'}
                                onChange={handleChange}
                            />
                            AC
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="acType"
                                value="Non-AC"
                                checked={formData.acType === 'Non-AC'}
                                onChange={handleChange}
                            />
                            Non-AC
                        </label>
                    </div>
                    {errors.acType && <span className="error-text">{errors.acType}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="startingLocation">Starting Location</label>
                    <input
                        type="text"
                        id="startingLocation"
                        name="startingLocation"
                        value={formData.startingLocation}
                        onChange={handleChange}
                        placeholder="Source city"
                        className={errors.startingLocation ? 'error' : ''}
                    />
                    {errors.startingLocation && <span className="error-text">{errors.startingLocation}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <input
                        type="text"
                        id="destination"
                        name="endingLocation"
                        value={formData.endingLocation}
                        onChange={handleChange}
                        placeholder="Destination city"
                        className={errors.endingLocation ? 'error' : ''}
                    />
                    {errors.endingLocation && <span className="error-text">{errors.endingLocation}</span>}
                </div>

                <div className="form-group full-width">
                    <label htmlFor="boardingPoints">Boarding Points</label>
                    <input
                        type="text"
                        id="boardingPoints"
                        name="boardingPoints"
                        value={formData.boardingPoints}
                        onChange={handleChange}
                        placeholder="Point A, Point B, Point C"
                        className={errors.boardingPoints ? 'error' : ''}
                    />
                    {errors.boardingPoints && <span className="error-text">{errors.boardingPoints}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="departureTime">Departure Time</label>
                    <input
                        type="time"
                        id="departureTime"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleChange}
                        className={errors.departureTime ? 'error' : ''}
                    />
                    {errors.departureTime && <span className="error-text">{errors.departureTime}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="arrivalTime">Arrival Time</label>
                    <input
                        type="time"
                        id="arrivalTime"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        className={errors.arrivalTime ? 'error' : ''}
                    />
                    {errors.arrivalTime && <span className="error-text">{errors.arrivalTime}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="ticketPrice">Ticket Price (₹)</label>
                    <input
                        type="number"
                        id="ticketPrice"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price per seat"
                        className={errors.price ? 'error' : ''}
                    />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="busImage">Bus Image Upload</label>
                    <input
                        type="file"
                        id="busImage"
                        name="busImage"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-btn">Add Bus Details</button>
            </form>
        </div>
    );
};

export default AddBus;
