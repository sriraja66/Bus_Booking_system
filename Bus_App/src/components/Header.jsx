import React from "react";

function Hero() {
  return (
    <div className="hero-container" style={{
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center',
      borderRadius: '0 0 50px 50px',
      boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
      marginBottom: '-50px'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        marginBottom: '1rem', 
        fontWeight: '800',
        letterSpacing: '-1px'
      }}>
        Journey Beyond <span style={{ color: '#fbbf24' }}>Boundaries</span>
      </h1>
      <p style={{ 
        fontSize: '1.25rem', 
        maxWidth: '700px', 
        margin: '0 auto 2rem auto',
        opacity: '0.9',
        lineHeight: '1.6'
      }}>
        Experience the most reliable, comfortable, and affordable bus travel across the nation. 
        Your destination is just a few clicks away.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
         <div style={{ padding: '10px 25px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', fontSize: '14px', backdropFilter: 'blur(5px)' }}>
           ✓ 500+ Routes
         </div>
         <div style={{ padding: '10px 25px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', fontSize: '14px', backdropFilter: 'blur(5px)' }}>
           ✓ 24/7 Support
         </div>
         <div style={{ padding: '10px 25px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', fontSize: '14px', backdropFilter: 'blur(5px)' }}>
           ✓ Instant Booking
         </div>
      </div>
    </div>
  );
}

export default Hero;