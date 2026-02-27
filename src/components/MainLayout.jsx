import React from 'react';
import { NavLink } from 'react-router-dom';
import { HabitColumn } from './HabitColumn.jsx';
import { DashboardColumn } from './DashboardColumn.jsx';

export function MainLayout({
  user,
  habits,
  stats,
  loading,
  page,
  onLogout,
  onRefresh,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit,
  onCompleteHabit,
}) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="app-shell">
      {/* ── Sidebar ──────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌱</div>
          HabitFlow
        </div>

        {/* Navigation */}
        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/habits"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">🎯</span>
            My Habits
          </NavLink>
        </nav>

        <div className="divider" style={{ margin: '16px 0' }} />

        <div className="sidebar-section-label">Actions</div>
        <nav className="sidebar-nav">
          <button
            className="sidebar-link"
            type="button"
            onClick={onRefresh}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            <span className="sidebar-link-icon">
              {loading ? <span className="spin">↻</span> : '↻'}
            </span>
            {loading ? 'Refreshing…' : 'Refresh data'}
          </button>
        </nav>

        {/* User section at bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button
            id="btn-logout"
            className="btn btn-ghost"
            type="button"
            onClick={onLogout}
            style={{ width: '100%' }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────── */}
      <main className="main-content">
        <div className="main-header">
          <div className="main-header-left">
            <h1>{page === 'dashboard' ? '📊 Dashboard' : '🎯 My Habits'}</h1>
            <p>{greeting}, <strong>{user?.name?.split(' ')[0]}</strong>. Here's your progress.</p>
          </div>
          <div className="main-header-right">
            <span className="badge badge-emerald" style={{ gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', display: 'inline-block' }} />
              Live
            </span>
          </div>
        </div>

        <div className="main-body">
          {page === 'dashboard' ? (
            <DashboardColumn stats={stats} hasHabits={habits.length > 0} />
          ) : (
            <HabitColumn
              habits={habits}
              onCreate={onCreateHabit}
              onUpdate={onUpdateHabit}
              onDelete={onDeleteHabit}
              onComplete={onCompleteHabit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
