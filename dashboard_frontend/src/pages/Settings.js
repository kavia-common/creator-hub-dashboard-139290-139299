import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Settings page with environment/branding notes.
 */
export default function Settings() {
  return (
    <div className="cards">
      <div className="col-6 card">
        <h3>Brand & Theme</h3>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: '#2563EB' }}></div>
          <div>Primary: #2563EB</div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: '#F59E0B' }}></div>
          <div>Secondary: #F59E0B</div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: '#EF4444' }}></div>
          <div>Error: #EF4444</div>
        </div>
      </div>
      <div className="col-6 card">
        <h3>Environment</h3>
        <ul>
          <li>REACT_APP_INSTAGRAM_CLIENT_ID</li>
          <li>REACT_APP_INSTAGRAM_REDIRECT_URI</li>
          <li>(Optional) REACT_APP_API_BASE</li>
        </ul>
        <div className="separator" />
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          Note: Client secret must never be used in frontend code. OAuth code exchange should happen on the backend.
        </div>
      </div>
    </div>
  );
}
