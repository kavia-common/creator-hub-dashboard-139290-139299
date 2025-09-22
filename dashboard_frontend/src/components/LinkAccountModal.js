import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal to describe account linking (placeholder). Social OAuth is disabled in this build.
 */
export default function LinkAccountModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>Link Account</strong>
          <button className="btn icon-btn" onClick={onClose} aria-label="Close">✖</button>
        </div>
        <div className="modal-body">
          <div className="card" style={{ background: '#fbfdff' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>External providers disabled</div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>
              This build keeps only basic email/password authentication. Linking to social accounts is currently disabled.
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
