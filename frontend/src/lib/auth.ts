type AuthPayload = {
  accessToken: string;
  userId: string;
  email: string;
  role: string;
};

const STORAGE_KEY = 'aegis.auth';

export function loadAuth(): AuthPayload | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

export function persistAuth(payload: AuthPayload | null) {
  if (typeof window === 'undefined') return;
  if (!payload) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearAuth() {
  persistAuth(null);
}
