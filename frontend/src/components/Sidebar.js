import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: '◈' },
  { label: 'Community Needs', path: '/needs', icon: '⊕' },
  { label: 'Volunteers', path: '/volunteers', icon: '◉' },
];

const volunteerLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: '◈' },
  { label: 'Needs Board', path: '/needs', icon: '⊕' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  if (!user) return null;

  const links = user.role === 'admin' ? adminLinks : volunteerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">Community<span>Connect</span></div>
        <div className="brand-tag">NGO Platform</div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Menu</span>
        {links.map(l => (
          <div
            key={l.path}
            className={`nav-link ${loc.pathname === l.path ? 'active' : ''}`}
            onClick={() => navigate(l.path)}
          >
            <span style={{ fontSize: 16 }}>{l.icon}</span>
            {l.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ width: '100%', color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
