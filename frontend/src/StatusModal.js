import React, { useEffect } from 'react';
import './StatusModal.css';

function StatusModal({ type = 'success', message, subMessage = '', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`status-modal-overlay`}>
      <div className={`status-modal status-modal-${type}`}>
        <div className="status-modal-icon">
          {type === 'success' ? (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="32" fill="#E6F9EA"/><path d="M20 34L29 43L44 28" stroke="#4BB543" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="32" fill="#FDEDED"/><path d="M24 24L40 40M40 24L24 40" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round"/></svg>
          )}
        </div>
        <div className="status-modal-message">{message}</div>
        {subMessage && <div className="status-modal-submessage">{subMessage}</div>}
      </div>
    </div>
  );
}

export default StatusModal;
