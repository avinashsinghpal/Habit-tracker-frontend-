import React, { useState } from 'react';
import { api } from '../api.js';

export function AuthPanel({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await api.login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });
      onAuthSuccess({ user: data.user, token: data.token, isNew: false });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await api.register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      });
      onAuthSuccess({ user: data.user, token: data.token, isNew: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  return (
    <div className="auth-form-box">
      <div className="auth-form-header">
        <h1 className="auth-form-title">
          {mode === 'login' ? 'Welcome back 👋' : 'Create account 🌱'}
        </h1>
        <p className="auth-form-subtitle">
          {mode === 'login'
            ? 'Sign in to your account to continue tracking.'
            : 'Start building better habits today — it\'s free.'}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="auth-tabs">
        <button
          id="tab-login"
          type="button"
          className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => switchMode('login')}
        >
          Log In
        </button>
        <button
          id="tab-register"
          type="button"
          className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => switchMode('register')}
        >
          Sign Up
        </button>
      </div>

      {/* Error message */}
      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {mode === 'login' ? (
        <form id="login-form" className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              required
              placeholder="you@example.com"
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="auth-divider" />
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      ) : (
        <form id="register-form" className="auth-form" onSubmit={handleRegisterSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              required
              placeholder="Your name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              required
              placeholder="you@example.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="auth-divider" />
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account →'}
          </button>
        </form>
      )}

      <p className="auth-footer-text">
        {mode === 'login'
          ? <>Don&apos;t have an account? <a onClick={() => switchMode('register')}>Sign up free</a></>
          : <>Already have an account? <a onClick={() => switchMode('login')}>Sign in</a></>}
      </p>
    </div>
  );
}
