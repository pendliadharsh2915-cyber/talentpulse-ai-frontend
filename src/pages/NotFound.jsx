import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.25rem', minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: '1', marginBottom: '1rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '2rem', fontSize: '1rem' }}>
        The page you are looking for doesn't exist or has been moved. Use the navigation to find your way back.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Home size={18} />
          <span>Return Home</span>
        </Link>
        <Link to="/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Browse Jobs</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
