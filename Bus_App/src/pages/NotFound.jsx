import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '120px', margin: 0, color: '#e2e8f0' }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1e293b' }}>Page Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: '30px', maxWidth: '400px' }}>
                Oops! The page you are looking for doesn't exist or has been moved to a new destination.
            </p>
            <button 
                onClick={() => navigate('/')}
                style={{
                    padding: '12px 30px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                }}
            >
                Back to Home
            </button>
        </div>
    );
};

export default NotFound;
