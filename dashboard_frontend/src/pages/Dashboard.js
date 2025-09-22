import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Main dashboard analytics with summary cards and top posts table.
 */
export default function Dashboard({ onQuickPublish }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    Api.getAnalytics().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="cards">
      <div className="col-8 card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>Overview</h3>
          <button className="btn btn-amber" onClick={onQuickPublish}><span>⚡</span>Quick Publish</button>
        </div>
        <div className="cards" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
          <div className="col-3 card">
            <div className="stat">{data?.summary?.engagement ?? '—'}</div>
            <div className="stat-sub">Engagement</div>
          </div>
          <div className="col-3 card">
            <div className="stat">{data?.summary?.reach ?? '—'}</div>
            <div className="stat-sub">Reach</div>
          </div>
          <div className="col-3 card">
            <div className="stat">{data?.summary?.growth ?? '—'}%</div>
            <div className="stat-sub">Growth</div>
          </div>
          <div className="col-3 card">
            <div className="stat">{data?.summary?.posts ?? '—'}</div>
            <div className="stat-sub">Posts</div>
          </div>
        </div>
        <div className="separator" />
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Monthly Trend</div>
          <div className="card" style={{ height: 160, background: 'linear-gradient(180deg, rgba(37,99,235,0.08), rgba(255,255,255,0.8))', borderStyle: 'dashed' }}>
            <div style={{ color: '#6b7280' }}>Chart placeholder</div>
          </div>
        </div>
      </div>

      <div className="col-4 card">
        <h3>Top Posts</h3>
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Engagement</th><th>Status</th></tr>
          </thead>
        <tbody>
          {(data?.topPosts || []).map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.engagement}</td>
              <td><span className={`badge ${p.status === 'Published' ? 'green' : 'gray'}`}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div className="col-12 card">
        <h3>Recommendations</h3>
        <ul>
          <li>Post when your audience is most active: 6-8 PM local time.</li>
          <li>Use 3-5 relevant hashtags to improve reach.</li>
          <li>Stories with interactive stickers gain 12% more engagement.</li>
        </ul>
      </div>
    </div>
  );
}
