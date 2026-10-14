import { config } from './config';
import { clientLogger } from './logger';
import { loadAuth, persistAuth } from './auth';
import { ExamSession } from './types';
import { identifyUser, resetAnalytics, track } from './analytics';

let authToken: string | null = loadAuth()?.accessToken ?? null;

export function setAuthToken(
  token: string | null,
  user?: { id: string; email: string; role: string; firstName?: string | null; lastName?: string | null },
  refreshToken?: string
) {
  authToken = token;
  if (token) {
    const payload = {
      accessToken: token,
      refreshToken: refreshToken ?? loadAuth()?.refreshToken,
      user: user ?? loadAuth()?.user
    } as any;
    persistAuth(payload);
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

export async function createExam(payload: {
  title: string;
  description?: string;
  instructions?: string;
  examType: string;
  creatorId: string;
  organizationId?: string;
  duration?: number;
  requireSecureClient?: boolean;
  proctoringLevel?: string;
  config?: Record<string, unknown>;
}) {
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
  track('exam_created', {
    exam_type: payload.examType,
    proctoring_level: payload.proctoringLevel,
    require_secure_client: payload.requireSecureClient,
    duration_minutes: payload.duration
  });
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
  track('exam_scheduled', {
    navigation: payload.navigation,
    randomize_questions: payload.randomizeQuestions,
    randomize_options: payload.randomizeOptions
  });
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
  track('exam_published', { published });
  return res.json();
}

export async function fetchQuestionBank() {
  const res = await fetch(`${config.apiBaseUrl}/exams/question-banks`, { headers: jsonHeaders() });
  if (!res.ok) {
    throw new Error('Failed to load question bank');
  }
  return res.json();
}

export async function createExamSession(payload: { examId: string; candidateName: string; candidateId?: string }) {
  const res = await fetch(`${config.apiBaseUrl}/exam-sessions`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Failed to create exam session');
  }
  return res.json() as Promise<{ session: ExamSession; sessionToken: string }>;
}

export async function joinExamByKey(payload: { examKey: string; candidateName?: string }) {
  const res = await fetch(`${config.apiBaseUrl}/exam-sessions/join`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  track('exam_join_attempted', { success: res.ok });
  if (!res.ok) {
    throw new Error('Invalid or expired exam key');
  }
  return res.json() as Promise<{ session: ExamSession; sessionToken: string }>;
}

export async function fetchAssignedSessions() {
  const res = await fetch(`${config.apiBaseUrl}/exam-sessions/assigned`, { headers: jsonHeaders() });
  if (!res.ok) {
    throw new Error('Failed to load assigned sessions');
  }
  return res.json() as Promise<ExamSession[]>;
}

export async function fetchUpcomingSessions() {
  const res = await fetch(`${config.apiBaseUrl}/exam-sessions/upcoming`, { headers: jsonHeaders() });
  if (!res.ok) {
    throw new Error('Failed to load upcoming sessions');
  }
  return res.json() as Promise<ExamSession[]>;
}

export async function createQuestion(examId: string, payload: any) {
  const res = await fetch(`${config.apiBaseUrl}/exams/${examId}/questions`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create question');
  track('question_added', { source: 'exam', type: payload?.type });
  return res.json();
}

export async function createQuestionBank(payload: { name: string; description?: string }) {
  const res = await fetch(`${config.apiBaseUrl}/exams/question-banks`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create question bank');
  return res.json();
}

export async function createQuestionInBank(payload: {
  questionBankId: string;
  type: string;
  title: string;
  questionText: string;
  answerConfig: Record<string, unknown>;
  correctAnswer?: Record<string, unknown>;
  points?: number;
}) {
  const res = await fetch(`${config.apiBaseUrl}/exams/question-banks/${payload.questionBankId}/questions`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create question');
  track('question_added', { source: 'question_bank', type: payload.type });
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

export async function registerUser(payload: { email: string; firstName: string; lastName: string; role: string; password: string; username?: string; phoneNumber?: string; organizationId?: string }) {
  const res = await fetch(`${config.apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Registration failed');
  }
  const data = await res.json();
  persistAuth(data);
  setAuthToken(data.accessToken, data.user, data.refreshToken);
  identifyUser(data.user);
  track('user_signed_up', { role: data.user?.role ?? payload.role });
  return data;
}

export async function login(payload: { email: string; password: string; remember?: boolean }) {
  const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email: payload.email, password: payload.password, deviceInfo: payload.remember ? 'remembered-device' : 'browser' })
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Login failed');
  }
  const data = await res.json();
  persistAuth(data);
  setAuthToken(data.accessToken, data.user, data.refreshToken);
  identifyUser(data.user);
  track('user_logged_in', { role: data.user?.role, remembered: !!payload.remember });
  return data;
}

export function getAuth() {
  return loadAuth();
}

export function logout() {
  setAuthToken(null);
  persistAuth(null);
  resetAnalytics();
}
