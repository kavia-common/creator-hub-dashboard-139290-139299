import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { LocalStore } from '../services/localStore';

/**
 * PUBLIC_INTERFACE
 * Accounts linking and management UI.
 */
export default function Accounts({ onLinkAccount }) {
  const [accounts, setAccounts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Prefer localStore accounts for the current user; fallback to API mock else.
    const load = async () => {
      const current = LocalStore.getCurrentUser();
      if (current) {
        const accs = LocalStore.getAccountsForUser(current.id);
        if (accs.length > 0) {
          setAccounts(accs);
          return;
        }
        // If none exist, create a demo connected account for the user once
        const demo = LocalStore.addAccount({
          userId: current.id,
          provider: 'local',
          handle: `@${(user?.name || current.name || 'demo').replace(/\s+/g, '').toLowerCase()}`,
          status: 'Connected'
        });
        setAccounts([demo]);
        return;
      }
      try {
        const fromApi = await Api.getAccounts();
        setAccounts(fromApi);
      } catch {
        setAccounts([]);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cards">
      <div className="col-12 card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>Connected Accounts</h3>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-outline" onClick={onLinkAccount}>Link Account</button>
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
