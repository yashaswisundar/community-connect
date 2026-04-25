import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const urgencyColors = { Critical: 'var(--red)', High: 'var(--amber)', Medium: 'var(--blue)', Low: 'var(--green)' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/needs/stats').then(r => setStats(r.data));
    api.get('/needs?status=Open').then(r => setRecent(r.data.slice(0, 5)));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Welcome back, {user?.name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {stats && (
        <div className="stats-row">
          <div className="stat blue">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">Total Needs</div>
          </div>
          <div className="stat amber">
            <div className="stat-val">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat red">
            <div className="stat-val">{stats.critical}</div>
            <div className="stat-label">Critical</div>
          </div>
          <div className="stat green">
            <div className="stat-val">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flexWrap: 'wrap' }}>
        {/* By Category */}
        {stats?.byCategory?.length > 0 && (
          <div className="card">
            <div className="sec-title" style={{ marginBottom: 14 }}>By Category</div>
            {stats.byCategory.map(c => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 13, width: 90, color: 'var(--ink-soft)' }}>{c._id}</div>
                <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${(c.count / stats.total) * 100}%`, background: 'var(--green)', height: '100%', borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, width: 24, textAlign: 'right' }}>{c.count}</div>
              </div>
            ))}
          </div>
        )}

        {/* By Urgency */}
        {stats?.byUrgency?.length > 0 && (
          <div className="card">
            <div className="sec-title" style={{ marginBottom: 14 }}>By Urgency</div>
            {stats.byUrgency.map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 13, width: 80, color: urgencyColors[u._id] || 'var(--ink-soft)' }}>{u._id}</div>
                <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${(u.count / stats.total) * 100}%`, background: urgencyColors[u._id] || 'var(--green)', height: '100%', borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, width: 24, textAlign: 'right' }}>{u.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent open needs */}
      {recent.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sec-title" style={{ marginBottom: 14 }}>Most Recent Open Needs</div>
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>Title</th><th>Area</th><th>Category</th><th>Urgency</th></tr></thead>
              <tbody>
                {recent.map(n => (
                  <tr key={n._id}>
                    <td style={{ fontWeight: 500 }}>{n.title}</td>
                    <td style={{ color: 'var(--ink-soft)' }}>{n.area}</td>
                    <td>{n.category}</td>
                    <td><span className={`badge badge-${n.urgency}`}>{n.urgency}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
