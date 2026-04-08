import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
// import './SearchResults.css'; // Optional: Create a CSS file for styling

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse query parameters
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

  return (
    <div className="search-results-page" style={{ padding: '20px' }}>
      <h2>Available Buses</h2>
      <p>
        Showing results for <strong>{fromCity}</strong> to <strong>{toCity}</strong>
        {date && <span> on {date}</span>}
      </p>

      {loading && <p>Loading matching buses...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && buses.length === 0 && (
        <p>No buses found for this route.</p>
      )}

      <div className="bus-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {buses.map((bus) => (
          <div key={bus._id} className="bus-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="bus-details">
              <h3>{bus.busName}</h3>
              <p><strong>Number:</strong> {bus.busNumber}</p>
              <p>
                <strong>Type:</strong> {bus.acType} / {bus.deckType === 'Double Deck' ? 'Sleeper' : 'Seater'}
              </p>
              <p><strong>Price:</strong> ₹{bus.ticketPrice}</p>
            </div>
            <button 
              onClick={() => handleBookSeat(bus)}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Book Seat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
