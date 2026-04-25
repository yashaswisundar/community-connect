import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Food', 'Health', 'Education', 'Shelter', 'Employment', 'Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', area: '', skills: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => {
    setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await register({ ...form, role: 'volunteer' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 440 }}>
        <div className="auth-brand">
          <div className="auth-brand-name">Community<span>Connect</span></div>
          <div className="auth-brand-tag">Join as a Volunteer</div>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Help your community where it needs you most</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Your Area / Location</label>
            <input className="form-input" placeholder="e.g. North District" value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills / Expertise (select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {CATEGORIES.map(s => (
                <button
                  key={s} type="button"
                  className="btn btn-sm"
                  style={{ background: form.skills.includes(s) ? 'var(--green)' : 'var(--bg)', color: form.skills.includes(s) ? '#fff' : 'var(--ink)', border: '1px solid var(--border)' }}
                  onClick={() => toggleSkill(s)}
                >{s}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating...' : 'Register as Volunteer'}
          </button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
