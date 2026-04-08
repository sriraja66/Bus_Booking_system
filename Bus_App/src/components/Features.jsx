import React from "react";

const FeatureCard = ({ title, description, icon, color }) => (
  <div style={{
    padding: '40px 30px',
    background: '#fff',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'default'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-10px)';
    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
  }}
  >
    <div style={{
      width: '70px',
      height: '70px',
      borderRadius: '20px',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      margin: '0 auto 25px auto',
      boxShadow: `0 10px 20px ${color}44`
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.25rem', marginBottom: '15px', color: '#1e293b', fontWeight: '700' }}>{title}</h3>
    <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>{description}</p>
  </div>
);

function Features() {
  return (
    <div style={{
      padding: '100px 20px',
      background: '#f8fafc'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ 
            color: '#2563eb', 
            fontWeight: '700', 
            fontSize: '14px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            background: '#dbeafe',
            padding: '8px 20px',
            borderRadius: '20px'
          }}>
            Why Choose Us
          </span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '20px', color: '#0f172a', fontWeight: '800' }}>
            Elevating your travel experience
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <FeatureCard
            title="Massive Network"
            description="Access 500+ bus operators across 10,000+ routes in India with just one click."
            icon="🌐"
            color="#eff6ff"
          />
          <FeatureCard
            title="Secure Payments"
            description="Your transactions are protected with industry-leading security and encryption."
            icon="🔒"
            color="#f0fdf4"
          />
          <FeatureCard
            title="Real-time Tracking"
            description="Never miss your bus with our precise GPS tracking and real-time arrival updates."
            icon="📍"
            color="#fff7ed"
          />
        </div>
      </div>
    </div>
  );
}

export default Features;