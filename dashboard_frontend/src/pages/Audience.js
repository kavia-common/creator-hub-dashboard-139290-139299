import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Audience management view: demographics, locations, and recent followers.
 */
export default function Audience() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Api.getAudience().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="cards">
      <div className="col-6 card">
        <h3>Demographics</h3>
        <table className="table">
          <thead><tr><th>Segment</th><th>Percent</th></tr></thead>
          <tbody>
            {(data?.demographics || []).map(d => (
              <tr key={d.segment}><td>{d.segment}</td><td>{d.percent}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-6 card">
        <h3>Top Locations</h3>
        <table className="table">
          <thead><tr><th>Region</th><th>Percent</th></tr></thead>
          <tbody>
            {(data?.locations || []).map(l => (
              <tr key={l.region}><td>{l.region}</td><td>{l.percent}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-12 card">
        <h3>Recent Followers</h3>
        <div className="cards" style={{ gap: 12, gridTemplateColumns: 'repeat(12, 1fr)' }}>
          {(data?.recentFollowers || []).map(u => (
            <div key={u.id} className="col-3 card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f3f4f6', display: 'grid', placeItems: 'center' }}>👤</div>
              <div>
                <div style={{ fontWeight: 700 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{u.handle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
