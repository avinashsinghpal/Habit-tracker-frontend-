// Set VITE_API_URL in your .env file to point at a different backend.
// Leave it empty (or unset) when the frontend and backend share the same origin.
const API_BASE = import.meta.env.VITE_API_URL || '';

const endpoints = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  me: '/api/auth/me',
  habits: '/api/habits',
  dashboard: '/api/dashboard'
};

export function getToken() {
  return localStorage.getItem('habit_jwt') || null;
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('habit_jwt', token);
  } else {
    localStorage.removeItem('habit_jwt');
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE + path, {
    ...options,
    headers
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (data && data.error) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  endpoints,
  register(body) {
    return apiRequest(endpoints.register, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  login(body) {
    return apiRequest(endpoints.login, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  me() {
    return apiRequest(endpoints.me);
  },
  getHabits() {
    return apiRequest(endpoints.habits);
  },
  createHabit(body) {
    return apiRequest(endpoints.habits, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  updateHabit(id, body) {
    return apiRequest(`${endpoints.habits}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },
  deleteHabit(id) {
    return apiRequest(`${endpoints.habits}/${id}`, {
      method: 'DELETE'
    });
  },
  completeHabit(id) {
    return apiRequest(`${endpoints.habits}/${id}/complete`, {
      method: 'POST'
    });
  },
  getDashboard() {
    return apiRequest(endpoints.dashboard);
  }
};

