import React, { useEffect, useState, useCallback } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { api, setToken, getToken } from './api.js';
import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { MainLayout } from './components/MainLayout.jsx';

function RequireAuth({ user, children }) {
  const hasToken = !!getToken();
  if (!user || !hasToken) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const navigate = useNavigate();

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3200);
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      const res = await api.getHabits();
      setHabits(res.habits || []);
    } catch (err) {
      if (getToken()) showToast(err.message, 'error');
    }
  }, [showToast]);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await api.getDashboard();
      const s = res.stats || null;
      setStats(s);
    } catch (err) {
      if (getToken()) showToast(err.message, 'error');
    }
  }, [showToast]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadHabits(), loadDashboard()]);
    } finally {
      setLoading(false);
    }
  }, [loadHabits, loadDashboard]);

  const handleAuthSuccess = async ({ user: u, token, isNew }) => {
    setToken(token);
    setUser(u);
    showToast(
      isNew ? `Account created. Welcome, ${u.name}!` : `Welcome back, ${u.name}!`
    );
    await refreshAll();
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setHabits([]);
    setStats(null);
    showToast('You have been logged out.');
    navigate('/', { replace: true });
  };

  const handleCreateHabit = async (payload) => {
    try {
      await api.createHabit(payload);
      await refreshAll();
      showToast('Habit created.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateHabit = async (id, payload) => {
    try {
      await api.updateHabit(id, payload);
      await loadHabits();
      showToast('Habit updated.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Delete this habit? It will be soft-deleted.')) return;
    try {
      await api.deleteHabit(id);
      await refreshAll();
      showToast('Habit deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCompleteHabit = async (id) => {
    try {
      await api.completeHabit(id);
      await refreshAll();
      showToast('Habit marked as completed for today.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRefreshClick = async () => {
    await refreshAll();
    showToast('Dashboard refreshed.');
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const data = await api.me();
        setUser(data.user);
        await refreshAll();
      } catch {
        setToken(null);
        navigate('/', { replace: true });
      }
    })();
  }, [refreshAll, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={<AuthPage user={user} onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <MainLayout
                user={user}
                habits={habits}
                stats={stats}
                loading={loading}
                page="dashboard"
                onLogout={handleLogout}
                onRefresh={handleRefreshClick}
                onCreateHabit={handleCreateHabit}
                onUpdateHabit={handleUpdateHabit}
                onDeleteHabit={handleDeleteHabit}
                onCompleteHabit={handleCompleteHabit}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/habits"
          element={
            <RequireAuth user={user}>
              <MainLayout
                user={user}
                habits={habits}
                stats={stats}
                loading={loading}
                page="habits"
                onLogout={handleLogout}
                onRefresh={handleRefreshClick}
                onCreateHabit={handleCreateHabit}
                onUpdateHabit={handleUpdateHabit}
                onDeleteHabit={handleDeleteHabit}
                onCompleteHabit={handleCompleteHabit}
              />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast.visible && (
        <div className={`toast${toast.type === 'error' ? ' error' : ''}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

