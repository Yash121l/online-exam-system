import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { getAuth } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAssignedSessions, useExamKeyJoin, useProctoringStatus, useUpcomingSessions } from '../../lib/hooks';
import { openSecureClient } from '../../lib/launch';
import { ExamSession } from '../../lib/types';

export default function StudentDashboard() {
  const [authRole, setAuthRole] = useState<string | null>(null);
  const [examKey, setExamKey] = useState('');
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const { sessions: assignedSessions } = useAssignedSessions();
  const { sessions: upcomingSessions } = useUpcomingSessions();
  const { session, sessionToken, error: joinError, loading, validateKey } = useExamKeyJoin();

  const activeSessionId = useMemo(() => session?.id ?? assignedSessions[0]?.id ?? null, [session?.id, assignedSessions]);
  const { status: proctoringStatus, lastUpdatedLabel } = useProctoringStatus(activeSessionId);

  useEffect(() => {
    setAuthRole(getAuth()?.user?.role ?? null);
  }, []);

  const handleJoin = async () => {
    if (!examKey.trim()) {
      setJoinMessage('Enter an exam key to continue.');
      return;
    }
    try {
      const result = await validateKey(examKey.trim());
      const launchUrl = openSecureClient(result.sessionToken, result.session);
      setJoinMessage(`Launching secure client via ${launchUrl}`);
    } catch (err: any) {
      setJoinMessage(err?.message ?? 'Could not join exam');
    }
  };

  const formatWindow = (examSession: ExamSession) => {
    const windowStart = (examSession.exam as any)?.scheduling?.windowStart;
    if (!windowStart) return 'No time set';
    const startDate = new Date(windowStart);
    return startDate.toLocaleString();
  };

  return (
    <DashboardLayout title="Student Dashboard" subtitle="Launch secure exams, see upcoming sessions, and track proctoring status">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-200">Student Experience</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-50">Enter your secure exam space</h1>
          <p className="text-slate-600 dark:text-neutral-300">
            Access exams with unique keys, stay within the locked-down client, and sync progress even if you go offline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/exams/launch">Download secure app</Link>
            </Button>
            {!authRole && (
              <>
                <Button asChild variant="secondary">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/auth/register">Create Student Account</Link>
                </Button>
              </>
            )}
          </div>
          {authRole && (
            <div className="inline-flex items-center rounded-lg bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-200">
              Signed in as {authRole}
            </div>
          )}
        </div>
        <Card className="bg-brand-900 p-5 text-slate-100 dark:bg-neutral-900">
          <div className="text-sm font-semibold">Secure Client Checklist</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-200">
            <li>Full-screen enforced, shortcuts blocked</li>
            <li>Mic & camera permissions granted</li>
            <li>Offline cache ready; auto-resync enabled</li>
            <li>Launch exam via <code className="rounded bg-black/20 px-1">aegisexam://</code> link</li>
          </ul>
        </Card>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-neutral-50">Upcoming Exams</h3>
          <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-neutral-200">
            {upcomingSessions.length === 0 && <p className="text-slate-500 dark:text-neutral-400">No upcoming sessions yet.</p>}
            {upcomingSessions.map((ses) => (
              <div key={ses.id} className="flex justify-between rounded-md bg-slate-50 px-2 py-1 dark:bg-neutral-800">
                <span className="font-semibold text-slate-900 dark:text-neutral-100">{ses.exam?.title ?? 'Untitled exam'}</span>
                <strong>{formatWindow(ses)}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-neutral-50">Enter Exam Key</h3>
          <Input
            placeholder="e.g., AE-4F9Q-2024"
            className="mt-2"
            value={examKey}
            onChange={(e) => setExamKey(e.target.value)}
          />
          <Button className="mt-3 w-full" onClick={handleJoin} disabled={loading}>
            {loading ? 'Validating...' : 'Join & Launch'}
          </Button>
          {joinMessage && <p className="text-sm text-slate-600 dark:text-neutral-200">{joinMessage}</p>}
          {joinError && <p className="text-sm text-red-600">{joinError}</p>}
          {session && sessionToken && (
            <p className="text-sm text-emerald-600">Validated session {session.accessKey} with secure token.</p>
          )}
          <p className="text-sm text-slate-600 dark:text-neutral-300">Use the secure Electron client for high-stakes exams.</p>
          <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/exams/launch">
            Download & launch
          </Link>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-neutral-50">Proctoring Status</h3>
          <div className="mt-2 flex justify-between text-sm text-slate-700 dark:text-neutral-200">
            <span>Camera</span>
            <strong className={proctoringStatus.cameraActive ? 'text-emerald-700' : 'text-amber-700'}>
              {proctoringStatus.cameraActive ? 'Streaming' : 'Idle'}
            </strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700 dark:text-neutral-200">
            <span>Microphone</span>
            <strong className={proctoringStatus.micActive ? 'text-emerald-700' : 'text-amber-700'}>
              {proctoringStatus.micActive ? 'Streaming' : 'Idle'}
            </strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700 dark:text-neutral-200">
            <span>Screen Share</span>
            <strong className={proctoringStatus.screenActive ? 'text-emerald-700' : 'text-amber-700'}>
              {proctoringStatus.screenActive ? 'Streaming' : 'Idle'}
            </strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700 dark:text-neutral-200">
            <span>Flags</span>
            <strong className={proctoringStatus.flags.length ? 'text-red-700' : 'text-emerald-700'}>
              {proctoringStatus.flags.length ? proctoringStatus.flags.join(', ') : 'None'}
            </strong>
          </div>
          <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <strong className={proctoringStatus.online ? 'text-emerald-700' : 'text-amber-700'}>
                {proctoringStatus.online ? 'Connected' : 'Offline'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Last event</span>
              <strong>{lastUpdatedLabel}</strong>
            </div>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  );
}
