import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const fromCity = queryParams.get('from');
  const toCity = queryParams.get('to');
  const date = queryParams.get('date');

  useEffect(() => {
    const fetchBusesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.searchBuses(fromCity, toCity);
        setBuses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fromCity && toCity) {
      fetchBusesData();
    } else {
      setLoading(false);
    }
  }, [fromCity, toCity]);

  const handleBookSeat = (bus) => {
    navigate('/seat-booking', { state: { bus } });
  };

  // Calculate available seats
  const getAvailableSeats = (bus) => {
    if (!bus.seats || !Array.isArray(bus.seats)) return 0;
    return bus.seats.filter(seat => !seat.isBooked).length;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #e8edf5 0%, #f0f4fa 40%, #f5f7fb 100%)', padding: '0 0 60px' }}>

      {/* Header Banner */}
      <div style={{ background: '#0f172a', padding: '28px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Search Results</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
              {fromCity} → {toCity}
            </h1>
            {date && (
              <span style={{ background: '#1e293b', border: '1px solid #334155', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', color: '#94a3b8' }}>
                📅 {date}
              </span>
            )}
          </div>
          {!loading && (
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
              {buses.length} bus{buses.length !== 1 ? 'es' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚌</div>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>Finding buses for you...</p>
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '16px 20px', color: '#dc2626', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && buses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No buses found</h2>
            <p style={{ color: '#64748b', fontSize: '15px' }}>No buses available for <strong>{fromCity} → {toCity}</strong></p>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>Try a different route or date</p>
          </div>
        )}

        {/* Bus Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {buses.map((bus) => {
            const availableSeats = getAvailableSeats(bus);
            const isAlmostFull = availableSeats <= 5 && availableSeats > 0;
            const isFull = availableSeats <= 0;

            return (
              <div key={bus._id} style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                border: '1px solid #e8ecf2',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
              }}>
                {/* Top bar — Bus name + badges */}
                <div style={{
                  background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
                  padding: '14px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.2px' }}>
                      🚌 {bus.busName}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '10px' }}>
                      #{bus.busNumber}
                    </span>
                  </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* AC badge */}
                    <span style={{
                      background: bus.acType === 'AC' ? '#dbeafe' : '#fef3c7',
                      color: bus.acType === 'AC' ? '#1d4ed8' : '#92400e',
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700'
                    }}>
                      {bus.acType}
                    </span>
                    {/* Seat Type badge */}
                    <span style={{
                      background: '#ede9fe', color: '#7c3aed',
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700'
                    }}>
                      {bus.seatType}
                    </span>
                  </div>
                </div>

                {/* Main card body */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {/* FROM */}
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>From</p>
                      <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px', textTransform: 'capitalize' }}>{bus.startingLocation}</p>
                      {bus.departureTime && (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb', margin: 0 }}>🕐 {bus.departureTime}</p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#cbd5e1', fontSize: '24px' }}>→</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' }}>BUS</div>
                    </div>

                    {/* TO */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>To</p>
                      <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px', textTransform: 'capitalize' }}>{bus.destination}</p>
                      {bus.arrivalTime && (
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#059669', margin: 0 }}>🕐 {bus.arrivalTime}</p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 0 16px' }} />

                  {/* Bottom row: seats + price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>

                    {/* Seat info */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', margin: '0 0 2px', textTransform: 'uppercase' }}>Available</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', margin: 0,
                          color: isFull ? '#dc2626' : isAlmostFull ? '#d97706' : '#059669'
                        }}>
                          {isFull ? '❌ Full' : `${availableSeats} seats`}
                        </p>
                      </div>
                    </div>

                    {/* Price + Book */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', margin: '0 0 2px', textTransform: 'uppercase' }}>Price</p>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          ₹{bus.ticketPrice}
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}> /seat</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookSeat(bus)}
                        disabled={isFull}
                        style={{
                          padding: '12px 24px',
                          background: isFull ? '#e5e7eb' : '#2563eb',
                          color: isFull ? '#9ca3af' : '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.2s, transform 0.15s',
                          boxShadow: isFull ? 'none' : '0 4px 12px rgba(37,99,235,0.3)'
                        }}
                        onMouseOver={(e) => { if (!isFull) e.currentTarget.style.background = '#1d4ed8'; }}
                        onMouseOut={(e) => { if (!isFull) e.currentTarget.style.background = '#2563eb'; }}
                      >
                        {isFull ? 'Bus Full' : 'Book Seat →'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
