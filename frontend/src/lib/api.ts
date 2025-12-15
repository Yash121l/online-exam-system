import { config } from './config';
import { clientLogger } from './logger';
import { loadAuth, persistAuth } from './auth';

let authToken: string | null = loadAuth()?.accessToken ?? null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    const auth = loadAuth();
    persistAuth(auth ? { ...auth, accessToken: token } : ({ accessToken: token } as any));
  } else {
    persistAuth(null);
  }
}

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
});

export async function fetchHealth() {
  const res = await fetch(`${config.apiBaseUrl}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

export async function createExam(payload: { title: string; description?: string }) {
  const res = await fetch(`${config.apiBaseUrl}/exams`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ ...payload, sections: [] })
  });

  if (!res.ok) {
    clientLogger.error('Failed to create exam', { status: res.status });
    throw new Error(`Failed to create exam: ${res.status}`);
  }

  const data = await res.json();
  clientLogger.info('Exam created from portal', { examId: data.id });
  return data;
}

export async function scheduleExam(
  examId: string,
  payload: { windowStart?: string; windowEnd?: string; navigation?: string; randomizeQuestions?: boolean; randomizeOptions?: boolean }
) {
  const res = await fetch(`${config.apiBaseUrl}/exams/${examId}/schedule`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Failed to schedule exam');
  }
  return res.json();
}

export async function publishExam(examId: string, published: boolean) {
  const res = await fetch(`${config.apiBaseUrl}/exams/${examId}/publish`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ published })
  });
  if (!res.ok) {
    throw new Error('Failed to publish exam');
  }
  return res.json();
}

export async function fetchQuestionBank() {
  const res = await fetch(`${config.apiBaseUrl}/exams/question-bank/items`, { headers: jsonHeaders() });
  if (!res.ok) {
    throw new Error('Failed to load question bank');
  }
  return res.json();
}

export async function createQuestion(examId: string, payload: any) {
  const res = await fetch(`${config.apiBaseUrl}/exams/${examId}/questions`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function requestPdfImport(payload: { examId: string; key: string }) {
  const res = await fetch(`${config.apiBaseUrl}/exams/pdf-import/request`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to request PDF import');
  return res.json();
}

export async function requestUploadUrl(key: string, contentType: string) {
  const res = await fetch(`${config.apiBaseUrl}/storage/upload-url`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ key, contentType })
  });
  if (!res.ok) {
    throw new Error('Failed to get upload URL');
  }
  return res.json() as Promise<{ url: string; key: string }>;
}

export async function registerUser(payload: { email: string; displayName: string; role: string; password: string }) {
  const res = await fetch(`${config.apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Registration failed');
  const data = await res.json();
  persistAuth(data);
  setAuthToken(data.accessToken);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  persistAuth(data);
  setAuthToken(data.accessToken);
  return data;
}

export function getAuth() {
  return loadAuth();
}

export function logout() {
  setAuthToken(null);
  persistAuth(null);
}
