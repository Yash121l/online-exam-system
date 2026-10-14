import { ExamSession } from './types';
import { track } from './analytics';

export function buildDeepLink(sessionToken: string, session: ExamSession) {
  const params = new URLSearchParams({ sessionId: session.id, examId: session.examId, token: sessionToken });
  return `aegisexam://launch?${params.toString()}`;
}

export function openSecureClient(sessionToken: string, session: ExamSession) {
  const url = buildDeepLink(sessionToken, session);
  if (typeof window !== 'undefined') {
    track('secure_client_launched', {});
    window.open(url, '_blank');
  }
  return url;
}
