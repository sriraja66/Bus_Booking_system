import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiService.getUserBookings();
                setBookings(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('token') || err.message.includes('denied')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchBookings();
        }
    }, [navigate]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your bookings...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>My Bookings</h1>
            
            {error && (
                <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px' }}>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>You haven't made any bookings yet.</p>
                    <button 
                        onClick={() => navigate('/buses')}
                        style={{ 
                            padding: '10px 20px', 
                            background: '#2563eb', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Search Buses
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map((booking) => (
                        <div 
                            key={booking._id} 
                            style={{ 
                                padding: '20px', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '12px', 
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{booking.busId?.busName || 'Bus Details Unavailable'}</h3>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Bus #: {booking.busId?.busNumber || 'N/A'}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        background: '#dcfce7', 
                                        color: '#166534', 
                                        borderRadius: '20px', 
                                        fontSize: '12px', 
                                        fontWeight: '600' 
                                    }}>
                                        Confirmed
                                    </span>
                                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#2563eb' }}>
                                        ₹{(booking.busId?.ticketPrice || 0) * (booking.selectedSeats?.length || 0)}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '15px 0', borderTop: '1px dashed #e5e7eb' }}>
                                <div>
                                    <p style={{ margin: '0', fontSize: '13px', color: '#9ca3af' }}>ROUTE</p>
                                    <p style={{ margin: '5px 0', fontWeight: '600' }}>
                                        {booking.from} → {booking.to}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: '0', fontSize: '13px', color: '#9ca3af' }}>SEATS</p>
                                    <p style={{ margin: '5px 0', fontWeight: '600' }}>
                                        {booking.selectedSeats?.join(', ')}
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
                                Booked on: {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
