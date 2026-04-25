import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Food', 'Health', 'Education', 'Shelter', 'Employment', 'Other'];
const URGENCIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

export default function Needs() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', urgency: '', status: '', area: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [showMatch, setShowMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', area: '', urgency: 'Medium', reportedBy: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchNeeds = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/needs', { params });
      setNeeds(data);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchNeeds(); }, [fetchNeeds]);

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/needs', form);
      setSuccess('Need reported successfully!');
      setShowAdd(false);
      setForm({ title: '', description: '', category: 'Other', area: '', urgency: 'Medium', reportedBy: '' });
      fetchNeeds();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add need');
    } finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/needs/${id}`, { status });
    fetchNeeds();
  };

  const deleteNeed = async (id) => {
    if (!window.confirm('Delete this need?')) return;
    await api.delete(`/needs/${id}`);
    fetchNeeds();
  };

  const openMatch = async (need) => {
    setShowMatch(need);
    setMatchLoading(true);
    try {
      const { data } = await api.get(`/needs/match/${need._id}`);
      setMatches(data);
    } finally { setMatchLoading(false); }
  };

  const assignVolunteer = async (needId, volunteerId) => {
    await api.put(`/needs/${needId}`, { assignedVolunteer: volunteerId, status: 'In Progress' });
    setShowMatch(null);
    fetchNeeds();
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Community Needs</h1>
        <p className="page-sub">Field reports and survey data from the community</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div className="filter-bar">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Urgency</label>
          <select className="form-input" value={filters.urgency} onChange={e => setFilters({ ...filters, urgency: e.target.value })}>
            <option value="">All</option>
            {URGENCIES.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Area</label>
          <input className="form-input" placeholder="Filter by area..." value={filters.area} onChange={e => setFilters({ ...filters, area: e.target.value })} />
        </div>
        {isAdmin && (
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => { setShowAdd(true); setError(''); }}>+ Report Need</button>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : needs.length === 0 ? (
        <div className="empty"><div className="empty-icon">📋</div><h3>No needs found</h3><p>Try adjusting your filters.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Area</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Reported By</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {needs.map(n => (
                <tr key={n._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{n.description.slice(0, 60)}{n.description.length > 60 ? '...' : ''}</div>
                  </td>
                  <td>{n.category}</td>
                  <td style={{ color: 'var(--ink-soft)' }}>{n.area}</td>
                  <td><span className={`badge badge-${n.urgency}`}>{n.urgency}</span></td>
                  <td>
                    {isAdmin ? (
                      <select
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: 13, minWidth: 110 }}
                        value={n.status}
                        onChange={e => updateStatus(n._id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span className={`badge badge-${n.status.replace(' ', '')}`}>{n.status}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
                    {n.assignedVolunteer ? n.assignedVolunteer.name : <span style={{ color: 'var(--ink-muted)' }}>Unassigned</span>}
                  </td>
                  <td style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{n.reportedBy || '—'}</td>
                  {isAdmin && (
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openMatch(n)} title="Match volunteer">⟳ Match</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteNeed(n._id)}>✕</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Need Modal */}
      {showAdd && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal fade-in">
            <div className="modal-head">
              <span className="modal-title">Report Community Need</span>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Brief title of the need" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} placeholder="Describe the community need in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-input" value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}>
                    {URGENCIES.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Area / Location</label>
                <input className="form-input" placeholder="e.g. North District, Ward 5" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reported By</label>
                <input className="form-input" placeholder="Field agent name" value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Report Need'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Volunteer Match Modal */}
      {showMatch && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowMatch(null)}>
          <div className="modal fade-in">
            <div className="modal-head">
              <span className="modal-title">Smart Volunteer Match</span>
              <button className="modal-close" onClick={() => setShowMatch(null)}>✕</button>
            </div>
            <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{showMatch.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{showMatch.area} · {showMatch.category} · <span className={`badge badge-${showMatch.urgency}`}>{showMatch.urgency}</span></div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 12 }}>Top matching volunteers based on area and skills:</div>
            {matchLoading ? (
              <div style={{ textAlign: 'center', padding: 24 }}><div className="spinner" /></div>
            ) : matches.length === 0 ? (
              <div className="empty"><div className="empty-icon">👤</div><h3>No available volunteers</h3><p>All volunteers may be busy or none match this area.</p></div>
            ) : (
              matches.map(v => (
                <div key={v._id} className="match-card">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                      📍 {v.area || 'No area set'} · Skills: {v.skills?.join(', ') || 'None listed'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="match-score">Score: {v.matchScore}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => assignVolunteer(showMatch._id, v._id)}>Assign</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
