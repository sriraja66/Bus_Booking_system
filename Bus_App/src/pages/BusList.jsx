import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../BusList.css';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { role } = useAuth();

    useEffect(() => {
        const fetchBusesData = async () => {
            console.log("Fetching buses...");
            try {
                const data = await apiService.getAllBuses();
                console.log("Fetched buses count:", data.length);
                setBuses(data);
            } catch (err) {
                console.error("Error fetching buses:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBusesData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this bus?")) return;
        
        try {
            await apiService.deleteBus(id);
            alert("Bus deleted successfully");
            setBuses(buses.filter(bus => (bus._id || bus.id) !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete bus: " + err.message);
        }
    };

    return (
        <div className="bus-list-container">
            <div className="list-header">
                <h2>{role === 'busUploader' ? "Your Fleet" : "Available Buses"}</h2>
                {role === 'busUploader' && (
                    <button className="add-new-btn" onClick={() => navigate('/uploader')}>
                        + Add New Bus
                    </button>
                )}
            </div>

            {loading && <p>Loading buses...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {!loading && !error && buses.length === 0 ? (
                <div className="no-buses">
                    <p>No buses added yet.</p>
                    {role === 'busUploader' && (
                         <button onClick={() => navigate('/uploader')}>Start by adding a bus</button>
                    )}
                </div>
            ) : (
                <div className="bus-grid">
                    {buses.map((bus) => (
                        <div key={bus._id || bus.id} className="bus-card">
                            <div className="bus-image-container">
                                {bus.imagePreview ? (
                                    <img src={bus.imagePreview} alt={bus.busName} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                                <span className="bus-type-badge">{bus.acType}</span>
                            </div>

                            <div className="bus-details">
                                <div className="bus-header">
                                    <h3>{bus.busName}</h3>
                                    <span className="bus-number">{bus.busNumber}</span>
                                </div>

                                <div className="route-info">
                                    <div className="location">
                                        <span className="dot source"></span>
                                        <strong>{bus.startingLocation}</strong>
                                        <span className="time">{bus.departureTime}</span>
                                    </div>
                                    <div className="location">
                                        <span className="dot destination"></span>
                                        <strong>{bus.destination}</strong>
                                        <span className="time">{bus.arrivalTime}</span>
                                    </div>
                                </div>

                                <div className="extra-info">
                                    <span>💺 {Number(bus.seaterSeats || 0) + Number(bus.sleeperSeats || 0)} Seats</span>
                                    <span className="price">₹{bus.ticketPrice}</span>
                                </div>

                                <div className="action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    {role === 'busUploader' ? (
                                        <>
                                            <button 
                                                className="edit-btn" 
                                                style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                onClick={() => alert("Edit functionality coming soon")}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                onClick={() => handleDelete(bus._id || bus.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            className="book-btn"
                                            style={{ width: '100%' }}
                                            onClick={() => navigate('/seat-booking', { state: { bus } })}
                                        >
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusList;
