import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: '#fff', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 className="logo" style={{ margin: 0, color: '#2563eb' }}>🚌 GoBus</h2>
      </Link>

      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        
        {isAuthenticated ? (
          <>
            {/* User Links */}
            {role === 'user' && (
              <>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>Search Buses</Link>
                <Link to="/my-bookings" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>My Bookings</Link>
              </>
            )}

            {/* Uploader Links */}
            {role === 'busUploader' && (
              <>
                <Link to="/uploader/dashboard" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>Dashboard</Link>
                <Link to="/uploader/add-bus" style={{ textDecoration: 'none', color: '#059669', fontWeight: '600' }}>+ Add Bus</Link>
                <Link to="/uploader/buses" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '600' }}>My Buses</Link>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Hi, <strong>{user?.username}</strong> </span>
              <button 
                onClick={handleLogout}
                style={{ 
                  padding: '6px 16px', 
                  borderRadius: '6px', 
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600' }}>Login</Link>
            <Link 
              to="/signup" 
              style={{ 
                textDecoration: 'none', 
                color: '#fff', 
                background: '#2563eb', 
                padding: '0.4rem 1rem', 
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
