import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = () => {
    // Trim values before processing
    const cleanFrom = from.trim();
    const cleanTo = to.trim();

    if (cleanFrom && cleanTo) {
      navigate(`/search-results?from=${encodeURIComponent(cleanFrom)}&to=${encodeURIComponent(cleanTo)}&date=${encodeURIComponent(date)}`);
    } else {
      alert("Please enter both 'From' and 'To' cities.");
    }
  };

  return (
    <div className="search-box-container" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 50,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      alignItems: 'flex-end',
      border: '1px solid #f1f5f9'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          From
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>📍</span>
          <input 
            type="text" 
            placeholder="Source City" 
            style={{ 
              width: '100%', 
              padding: '15px 15px 15px 45px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              fontSize: '16px',
              outline: 'none',
              background: '#f8fafc',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            value={from}
            onChange={(e) => setFrom(e.target.value.trimStart())}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          To
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🎯</span>
          <input 
            type="text" 
            placeholder="Destination" 
            style={{ 
              width: '100%', 
              padding: '15px 15px 15px 45px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              fontSize: '16px',
              outline: 'none',
              background: '#f8fafc',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            value={to}
            onChange={(e) => setTo(e.target.value.trimStart())}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Travel Date
        </label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '15px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            fontSize: '16px',
            outline: 'none',
            background: '#f8fafc'
          }}
        />
      </div>

      <button className="search-btn" 
        onClick={handleSearch}
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'transform 0.2s, background 0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        🚌 Search Buses
      </button>
    </div>
  );
}

export default SearchBox;