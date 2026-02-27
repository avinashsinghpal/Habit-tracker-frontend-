import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎯',
    color: 'violet',
    title: 'Daily Focus',
    desc: 'See exactly what you need to complete today. Each habit is limited to one completion per day — clean, purposeful, and hard to game.',
  },
  {
    icon: '📈',
    color: 'emerald',
    title: 'Visual Progress',
    desc: 'Streaks, completion rates, and weekly charts give you an instant read on how consistent you actually are.',
  },
  {
    icon: '⚡',
    color: 'gold',
    title: 'Streak Momentum',
    desc: 'Your current and longest streak are front and center — because showing up every day is where the magic happens.',
  },
  {
    icon: '🔒',
    color: 'violet',
    title: 'Secure & Private',
    desc: 'JWT-powered authentication with your data stored in MongoDB Atlas. Only you can see your habits.',
  },
  {
    icon: '🛠️',
    color: 'emerald',
    title: 'Full CRUD Control',
    desc: 'Create, edit, and remove habits any time. Your habit list evolves with you as your goals change.',
  },
  {
    icon: '📅',
    color: 'gold',
    title: 'Weekly Charts',
    desc: 'Interactive bar charts show how many habits you completed each day of the week at a glance.',
  },
];

export function LandingPage() {
  return (
    <div className="landing-root">
      {/* ── Navbar ──────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon">🌱</div>
          HabitFlow
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Features
          </a>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section className="landing-hero">
        {/* Background blobs */}
        <div className="mesh-blob hero-blob-1" />
        <div className="mesh-blob hero-blob-2" />
        <div className="mesh-blob hero-blob-3" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="label-tag">
              <span className="label-tag-dot" />
              Premium Habit Tracker
            </span>
          </div>

          <h1 className="hero-title">
            Build habits that<br />
            <span className="hero-title-gradient">actually compound.</span>
          </h1>

          <p className="hero-subtitle">
            Turn your daily routines into a visual story of growth. Track streaks,
            measure consistency, and watch small actions snowball into real change.
          </p>

          <div className="hero-cta-row">
            <Link to="/auth" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '15px', borderRadius: '12px' }}>
              Start for free →
            </Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: '15px', borderRadius: '12px' }}>
              See how it works
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-stats-row">
          {[
            { value: '100%', label: 'Free forever' },
            { value: '∞', label: 'Habits to track' },
            { value: '7d', label: 'Weekly insights' },
          ].map(({ value, label }) => (
            <div className="hero-stat" key={label}>
              <div className="hero-stat-value">{value}</div>
              <div className="hero-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section id="features" className="landing-features">
        <div className="section-eyebrow">
          <span className="label-tag">
            <span className="label-tag-dot" />
            Features
          </span>
        </div>
        <h2 className="section-title">Everything you need,<br />nothing you don't.</h2>
        <p className="section-subtitle">
          A focused set of tools that help you stay consistent — no fluff, no noise.
        </p>

        <div className="features-grid">
          {FEATURES.map(({ icon, color, title, desc }) => (
            <div className="feature-card glass-card" key={title}>
              <div className={`feature-icon ${color}`}>{icon}</div>
              <div className="feature-title">{title}</div>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────── */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1140, margin: '0 auto', width: '100%' }}>
        <div className="glass-card" style={{
          padding: '56px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(124,109,250,0.14) 0%, rgba(16,217,160,0.08) 100%)',
          border: '1px solid rgba(124,109,250,0.25)',
        }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 14 }}>
            Ready to build better habits?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
            Join and start tracking your habits today. Setup takes less than 30 seconds.
          </p>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '15.5px', borderRadius: '12px' }}>
            Create your free account
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="landing-footer">
        <span>HabitFlow © 2025 · Built with ♥ for consistent people.</span>
      </footer>
    </div>
  );
}
