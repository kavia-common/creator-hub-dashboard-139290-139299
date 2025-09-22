import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Posts management: list of posts (published/scheduled).
 */
export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    Api.listPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <div className="cards">
      <div className="col-12 card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>Posts</h3>
          <div className="row">
            <button className="btn btn-outline">Filter</button>
            <button className="btn btn-primary">New Post</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>Caption</th><th>Status</th><th>Date</th><th>Platform</th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td style={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.caption}</td>
                <td><span className={`badge ${p.status === 'Published' ? 'green' : 'gray'}`}>{p.status}</span></td>
                <td>{p.date}</td>
                <td>{p.platform}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
