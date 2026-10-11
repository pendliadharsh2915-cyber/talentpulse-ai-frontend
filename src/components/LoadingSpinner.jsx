import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', light = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', gap: '0.75rem' }}>
      <div className={`spinner ${light ? 'spinner-light' : ''}`}></div>
      {text && <span style={{ color: light ? 'white' : 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
