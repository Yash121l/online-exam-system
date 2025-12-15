import { useEffect, useMemo, useState } from 'react';
import {
  fetchAssignedSessions,
  fetchUpcomingSessions,
  joinExamByKey,
  createExamSession,
  getAuth
} from './api';
import { ExamSession, ProctoringStatus } from './types';
import { clientLogger } from './logger';
import { io, Socket } from 'socket.io-client';
import { config } from './config';

export function useAssignedSessions() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuth()) return;
    setLoading(true);
    fetchAssignedSessions()
      .then(setSessions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { sessions, loading, error };
}

export function useUpcomingSessions() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUpcomingSessions()
      .then(setSessions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { sessions, loading, error };
}

export function useExamKeyJoin() {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateKey = async (examKey: string, candidateName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await joinExamByKey({ examKey, candidateName });
      setSession(result.session);
      setSessionToken(result.sessionToken);
      return result;
    } catch (err: any) {
      const message = err?.message ?? 'Failed to join exam';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { session, sessionToken, error, loading, validateKey };
}

export function useProctoringStatus(examSessionId?: string | null) {
  const [status, setStatus] = useState<ProctoringStatus>({
    cameraActive: false,
    micActive: false,
    screenActive: false,
    flags: [],
    online: false
  });

  useEffect(() => {
    if (!examSessionId) return;
    const socket: Socket = io(config.wsUrl, { transports: ['websocket'] });

    const updateFromPayload = (payload: any) => {
      if (payload.examSessionId !== examSessionId) return;
      setStatus({
        cameraActive: Boolean(payload.cameraActive),
        micActive: Boolean(payload.micActive),
        screenActive: Boolean(payload.screenActive),
        flags: payload.flags ?? [],
        online: payload.online ?? false,
        lastEventAt: payload.lastEventAt
      });
    };

    socket.on('connect', () => {
      clientLogger.info('Connected to proctoring socket');
      setStatus((prev) => ({ ...prev, online: true }));
    });
    socket.on('disconnect', (reason) => {
      clientLogger.warn('Disconnected from proctoring socket', { reason });
      setStatus((prev) => ({ ...prev, online: false }));
    });
    socket.on('proctoring:status', updateFromPayload);

    return () => {
      socket.off('proctoring:status', updateFromPayload);
      socket.disconnect();
    };
  }, [examSessionId]);

  const lastUpdatedLabel = useMemo(() => {
    if (!status.lastEventAt) return 'No activity yet';
    const seconds = Math.floor((Date.now() - status.lastEventAt) / 1000);
    return seconds <= 0 ? 'Just now' : `${seconds}s ago`;
  }, [status.lastEventAt]);

  return { status, lastUpdatedLabel };
}

export async function allocateSessionForCandidate(examId: string, candidateName: string, candidateId?: string) {
  return createExamSession({ examId, candidateName, candidateId });
}
