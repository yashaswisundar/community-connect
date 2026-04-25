import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Volunteers() {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/volunteers');
      setVolunteers(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const toggleAvailability = async (v) => {
    await api.put(`/volunteers/${v._id}`, { available: !v.available });
    fetch();
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Volunteers</h1>
        <p className="page-sub">Registered volunteers and their availability</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : volunteers.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🙋</div>
          <h3>No volunteers yet</h3>
          <p>Volunteers register themselves via the sign up page.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Area</th>
                <th>Skills</th>
                <th>Available</th>
                {user?.role === 'admin' && <th>Toggle</th>}
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => (
                <tr key={v._id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td style={{ color: 'var(--ink-soft)' }}>{v.email}</td>
                  <td style={{ color: 'var(--ink-soft)' }}>{v.area || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {v.skills?.length > 0
                        ? v.skills.map(s => (
                          <span key={s} style={{ background: 'var(--green-light)', color: 'var(--green)', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99 }}>{s}</span>
                        ))
                        : <span style={{ color: 'var(--ink-muted)', fontSize: 13 }}>None listed</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                      background: v.available ? 'var(--green-light)' : 'var(--bg)',
                      color: v.available ? 'var(--green)' : 'var(--ink-muted)',
                      border: `1px solid ${v.available ? 'var(--green-border)' : 'var(--border)'}`
                    }}>
                      {v.available ? '● Available' : '○ Busy'}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td>
                      <button
                        className={`btn btn-sm ${v.available ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => toggleAvailability(v)}
                      >
                        {v.available ? 'Mark Busy' : 'Mark Available'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
