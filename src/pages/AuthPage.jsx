import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthPanel } from '../components/AuthPanel.jsx';

const PERKS = [
  { icon: '🎯', text: 'Track habits with one completion per day' },
  { icon: '🔥', text: 'Build streaks and watch consistency grow' },
  { icon: '📊', text: 'Weekly charts and progress dashboard' },
  { icon: '🔒', text: 'Secure JWT auth, your data stays private' },
  { icon: '⚡', text: 'Instant feedback on every action you take' },
];

export function AuthPage({ user, onAuthSuccess }) {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-root">
      {/* ── Left brand panel ─────────────────── */}
      <div className="auth-brand-panel">
        <div className="mesh-blob auth-brand-blob-1" />
        <div className="mesh-blob auth-brand-blob-2" />

        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon">🌱</div>
            HabitFlow
          </div>

          <div>
            <span className="label-tag" style={{ marginBottom: 18, display: 'inline-flex' }}>
              <span className="label-tag-dot" />
              Your discipline portal
            </span>
            <h2 className="auth-brand-heading">
              Daily discipline,<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--indigo-light), var(--emerald))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                beautifully tracked.
              </span>
            </h2>
          </div>

          <ul className="auth-brand-perks">
            {PERKS.map(({ icon, text }) => (
              <li className="auth-brand-perk" key={text}>
                <div className="auth-brand-perk-icon">{icon}</div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-brand-footer">
          Protected by JWT · Powered by MongoDB Atlas
        </div>
      </div>

      {/* ── Right form panel ─────────────────── */}
      <div className="auth-form-panel">
        <AuthPanel onAuthSuccess={onAuthSuccess} />
      </div>
    </div>
  );
}
