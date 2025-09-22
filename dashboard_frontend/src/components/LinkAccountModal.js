import React from 'react';
import { loginWithInstagram } from '../auth/instagram';

/**
 * PUBLIC_INTERFACE
 * Modal to link social accounts; currently supports Instagram OAuth.
 */
export default function LinkAccountModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>Link Social Account</strong>
          <button className="btn icon-btn" onClick={onClose} aria-label="Close">✖</button>
        </div>
        <div className="modal-body">
          <div className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="row" style={{ gap: 10 }}>
                <span>📷</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Instagram</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Connect your Instagram account to publish and analyze content.</div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => { onClose(); loginWithInstagram(); }}>
                Connect
              </button>
            </div>
          </div>
          <div className="card" style={{ opacity: 0.5 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="row" style={{ gap: 10 }}>
                <span>🐦</span>
                <div>
                  <div style={{ fontWeight: 700 }}>X (Coming soon)</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Integration planned.</div>
                </div>
              </div>
              <button className="btn btn-outline" disabled>Unavailable</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
