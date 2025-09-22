import React, { useState } from 'react';
import { Api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Modal to compose and publish a post to linked platforms.
 */
export default function PublishModal({ onClose }) {
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [platforms, setPlatforms] = useState({ instagram: true });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const togglePlatform = (name) => setPlatforms(p => ({ ...p, [name]: !p[name] }));

  async function publish() {
    setLoading(true);
    try {
      const res = await Api.publishPost({
        caption, mediaUrl, platforms: Object.keys(platforms).filter(k => platforms[k]),
      });
      setResult(res);
    } catch (e) {
      alert('Failed to publish. Check backend connectivity.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>Publish Post</strong>
          <button className="btn icon-btn" onClick={onClose} aria-label="Close">✖</button>
        </div>
        <div className="modal-body">
          <label>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Caption</div>
            <textarea className="input" rows="4" placeholder="Write something inspiring..." value={caption} onChange={e => setCaption(e.target.value)} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Media URL (optional)</div>
            <input className="input" placeholder="https://..." value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
          </label>
          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Platforms</div>
            <div className="row">
              <label className="row" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={platforms.instagram} onChange={() => togglePlatform('instagram')} />
                <span>Instagram</span>
              </label>
            </div>
          </div>
          {result && (
            <div className="card" style={{ borderStyle: 'dashed', background: '#f9fafb' }}>
              <div><strong>Status:</strong> {result.status}</div>
              <div><strong>ID:</strong> {result.id}</div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-amber" disabled={loading} onClick={publish}>
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
