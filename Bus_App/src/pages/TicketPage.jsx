import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const TicketPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await apiService.getBookingByBookingId(bookingId);
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchTicket();
        }
    }, [bookingId]);

    if (loading) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <p>Generating your ticket...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2 style={{ color: '#dc2626' }}>⚠️ Error loading ticket</h2>
                <p>{error || 'Ticket not found.'}</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Return to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Success Animation Area */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ 
                    fontSize: '60px', 
                    marginBottom: '10px',
                    animation: 'bounce 1s infinite alternate' 
                }}>✅</div>
                <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0 }}>Booking Confirmed!</h1>
                <p style={{ color: '#64748b', fontSize: '16px' }}>Your journey is ready to begin.</p>
            </div>

            {/* Ticket Card */}
            <div style={{ 
                maxWidth: '500px', 
                width: '100%',
                background: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid #e2e8f0'
            }}>
                {/* Brand Header */}
                <div style={{ background: '#0f172a', padding: '24px', color: 'white', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>🚌</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>GoBus TICKET</span>
                    </div>
                </div>

                {/* Ticket Body */}
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Booking ID</p>
                            <p style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{booking.bookingId}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Passenger</p>
                            <p style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{booking.userId?.name || 'User'}</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '2px dashed #f1f5f9', margin: '0 0 24px' }} />

                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Travel Details</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>{booking.from}</p>
                                <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600' }}>{booking.departureTime}</p>
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>{booking.to}</p>
                                <p style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>{booking.arrivalTime}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Bus Name</p>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#334155' }}>{booking.busName}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Date</p>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#334155' }}>{booking.date}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Seats</p>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#334155' }}>{booking.selectedSeats?.join(', ')}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Total Paid</p>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{booking.totalPrice}</p>
                        </div>
                    </div>

                    <div style={{ borderTop: '2px dashed #f1f5f9', margin: '0 0 24px' }} />

                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>This is a digital ticket. Please show it during boarding.</p>
                    </div>
                </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              style={{ 
                marginTop: '40px', 
                padding: '14px 40px', 
                background: '#0f172a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '700', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#1e293b'}
              onMouseOut={(e) => e.target.style.background = '#0f172a'}
            >
              Done
            </button>
        </div>
    );
};

export default TicketPage;
