import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';
import { loginWithInstagram } from '../auth/instagram';

/**
 * PUBLIC_INTERFACE
 * Accounts linking and management UI.
 */
export default function Accounts({ onLinkAccount }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    Api.getAccounts().then(setAccounts).catch(() => setAccounts([]));
  }, []);

  return (
    <div className="cards">
      <div className="col-12 card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>Connected Accounts</h3>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-outline" onClick={onLinkAccount}>Link Account</button>
            <button className="btn btn-primary" onClick={loginWithInstagram}><span>📷</span>Connect Instagram</button>
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Provider</th><th>Handle</th><th>Status</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id}>
                <td style={{ textTransform: 'capitalize' }}>{a.provider}</td>
                <td>{a.handle || '—'}</td>
                <td><span className={`badge ${a.status === 'Connected' ? 'green' : 'gray'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
