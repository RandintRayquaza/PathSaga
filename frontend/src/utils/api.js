/**
 * api.js — Centralised HTTP client
 * All functions are stubs — replace mock delays with real fetch calls.
 * Set VITE_API_URL in .env to point at your backend.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function req(method, path, body) {
  const token = localStorage.getItem('ps_token');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `HTTP ${res.status}`);
  return res.json();
}

export const api = {
  get:    (p)    => req('GET',   p),
  post:   (p, b) => req('POST',  p, b),
  patch:  (p, b) => req('PATCH', p, b),
  delete: (p)    => req('DELETE',p),
};

export const authApi       = { login: (d) => api.post('/auth/login', d), signup: (d) => api.post('/auth/signup', d), me: () => api.get('/auth/me') };
export const assessmentApi = { submit: (a) => api.post('/assessment/submit', { answers: a }), result: () => api.get('/assessment/result') };
export const userApi       = { dashboard: () => api.get('/user/dashboard'), profile: () => api.get('/user/profile') };
