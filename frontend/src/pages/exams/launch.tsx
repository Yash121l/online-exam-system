import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useExamKeyJoin } from '../../lib/hooks';
import { buildDeepLink, openSecureClient } from '../../lib/launch';

export default function LaunchExamPage() {
  const [examKey, setExamKey] = useState('AE-4F9Q-2024');
  const [status, setStatus] = useState<string | null>(null);
  const { session, sessionToken, loading, error, validateKey } = useExamKeyJoin();

  const launchUrl = useMemo(
    () => (session && sessionToken ? buildDeepLink(sessionToken, session) : `aegisexam://launch?examKey=${encodeURIComponent(examKey)}`),
    [examKey, session, sessionToken]
  );

  const onLaunch = async (e: FormEvent) => {
    e.preventDefault();
    if (!examKey.trim()) {
      setStatus('Enter an exam key to launch the secure client.');
      return;
    }

    try {
      const result = await validateKey(examKey.trim());
      const deepLink = openSecureClient(result.sessionToken, result.session);
      setStatus(`Secure client is launching via ${deepLink}`);
    } catch (err: any) {
      setStatus(err?.message ?? 'If the secure client is installed, it will open automatically.');
    }
  };

  return (
    <Layout title="Launch Exam">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Student launchpad</p>
          <h1 className="text-3xl font-bold text-slate-900">Download the secure client and join your exam</h1>
          <p className="text-slate-600">
            For high-stakes delivery, the Electron app enforces fullscreen mode, blocks shortcuts, and streams proctoring data.
            Use this page to fetch the installer and hand off to the <code className="rounded bg-slate-100 px-1.5 py-0.5">aegisexam://</code>
            protocol.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://downloads.aegisexam.local/secure-client/latest" target="_blank" rel="noreferrer">
                Download secure client
              </a>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard/student">Go to student dashboard</Link>
            </Button>
          </div>
          <Card className="p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">What to expect</p>
            <ul className="mt-2 space-y-1">
              <li>• Shortcut blocking (Alt+Tab, Cmd/Ctrl+R, Print Screen)</li>
              <li>• Focus loss + RDP/VM heuristics logged to NestJS</li>
              <li>• Offline cache for answers and proctoring events</li>
              <li>• Live sync to the proctoring WebSocket namespace</li>
            </ul>
          </Card>
        </div>

        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Launch exam</p>
          <h2 className="text-xl font-bold text-slate-900">Enter your exam key</h2>
          <form className="mt-4 space-y-3" onSubmit={onLaunch}>
            <label className="text-sm font-semibold text-slate-700">
              Exam key
              <Input value={examKey} onChange={(e) => setExamKey(e.target.value)} placeholder="e.g., AE-4F9Q-2024" />
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Validating...' : 'Launch in secure app'}
            </Button>
            {status && <p className="text-sm text-slate-600">{status}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {session && sessionToken && (
              <p className="text-sm text-emerald-700">Token ready for {session.accessKey}. Deep link: {launchUrl}</p>
            )}
          </form>
          <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Need to test first?</p>
            <p className="mt-1">
              If you are still downloading the client, you can continue in the web portal for dry-runs. Production exams should
              always launch via the secure Electron app.
            </p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-brand-700" href="/dashboard/student">
              Open web portal
            </Link>
          </div>
          <div className="mt-5 grid gap-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-semibold">Device readiness</p>
            <ul className="space-y-1">
              <li>• Camera & mic permissions approved</li>
              <li>• Stable network or offline cache enabled</li>
              <li>• Running on non-VM hardware</li>
            </ul>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
