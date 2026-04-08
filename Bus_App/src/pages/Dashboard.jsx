import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchBox from "../components/Search";
import Features from "../components/Features";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Rendering Dashboard for role:", role);

  useEffect(() => {
    // Both 'busUploader' and 'uploader' should reach here (normalized in AuthContext)
    if (role === 'busUploader' || role === 'uploader') {
        setLoading(true);
        fetch("/api/buses")
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch buses");
            return res.json();
          })
          .then((data) => {
            setBuses(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching buses:", err);
            setLoading(false);
          });
    } else {
        setLoading(false);
    }
  }, [role]);

  // Debug Bar to help identify why the screen might be blank
  const DebugBar = () => (
    <div style={{ 
        padding: '5px 10px', 
        backgroundColor: '#f1f5f9', 
        fontSize: '11px', 
        color: '#64748b', 
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center' 
    }}>
        <b>Debug Info:</b> Role detected: <code>{role || 'null'}</code> | User: <code>{user?.email || 'Guest'}</code>
    </div>
  );

  if (role === 'busUploader' || role === 'uploader') {
    return (
      <div className="dashboard-wrapper">
        <DebugBar />
        <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2>Bus Uploader Dashboard</h2>
              <button 
                  onClick={() => navigate("/uploader/add-bus")}
                  className="search-btn"
                  style={{ padding: '10px 20px' }}
              >
                  Add New Bus
              </button>
          </div>

          <h3>Your Uploaded Buses</h3>

          {loading ? (
              <p>Loading your buses...</p>
          ) : buses.length === 0 ? (
            <p>No buses uploaded yet</p>
          ) : (
            <div className="bus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {buses.map((bus) => (
                <div key={bus._id || bus.id} className="bus-card" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>{bus.busName}</h4>
                  <p style={{ margin: '5px 0', color: '#64748b' }}>
                      <strong>Route:</strong> {bus.startingLocation} → {bus.destination}
                  </p>
                  <p style={{ margin: '5px 0', color: '#64748b' }}>
                      <strong>Bus Number:</strong> {bus.busNumber}
                  </p>
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                       <button 
                          onClick={() => navigate(`/uploader/buses`)}
                          style={{ flex: 1, padding: '8px', fontSize: '12px', cursor: 'pointer' }}
                          className="booking-btn"
                      >
                          View Details
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default User Dashboard (and fallback for unknown roles)
  return (
    <div className="dashboard-wrapper">
      <DebugBar />
      <div className="user-dashboard">
        <Header />
        <SearchBox />
        <Features />
      </div>
    </div>
  );
};

export default Dashboard;
