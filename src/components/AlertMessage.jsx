import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} />;
      case 'info':
        return <Info size={18} />;
      case 'danger':
      default:
        return <AlertCircle size={18} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', padding: '0 0.25rem' }}
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
