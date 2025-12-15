import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { getAuth } from '../../lib/api';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function AdminDashboard() {
  const [authRole, setAuthRole] = useState<string | null>(null);

  useEffect(() => {
    setAuthRole(getAuth()?.role ?? null);
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Admin & Teacher Control</p>
          <h1 className="text-3xl font-bold text-slate-900">Orchestrate secure exams</h1>
          <p className="text-slate-600">
            Build exams, manage proctoring, and monitor live sessions with AI-assisted insights and real-time alerts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/exams/builder">Go to builder</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/auth/login">Switch Account</Link>
            </Button>
          </div>
          {authRole && (
            <div className="inline-flex items-center rounded-lg bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              Signed in as {authRole}
            </div>
          )}
        </div>
        <Card className="p-5 bg-brand-900 text-slate-100">
          <CardHeader className="text-slate-100">Live Monitoring</CardHeader>
          <CardContent className="text-slate-200">
            <ul className="list-disc space-y-1 pl-4">
              <li>12 active sessions · 3 on watchlist</li>
              <li>Flags: eye-off (4), mic-muted (2), suspected RDP (1)</li>
              <li>Last sync: 32s ago</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Exam Builder</h3>
          <p className="text-sm text-slate-600">Create exams with question banks, PDF import, and section timers.</p>
          <div className="mt-3 flex justify-between text-sm text-slate-700">
            <span>Drafts</span>
            <strong>4</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Scheduled</span>
            <strong>2</strong>
          </div>
          <Link href="/exams/builder" className="mt-3 inline-flex text-sm font-semibold text-brand-600">
            Go to builder
          </Link>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">AI Proctoring</h3>
          <p className="text-sm text-slate-600">Configure webcam, mic, and screen telemetry with instant flags.</p>
          <div className="mt-3 flex justify-between text-sm text-slate-700">
            <span>Active</span>
            <strong>12</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Flags today</span>
            <strong>9</strong>
          </div>
          <Link href="/" className="mt-3 inline-flex text-sm font-semibold text-brand-600">
            Open monitor
          </Link>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Reports & Grading</h3>
          <p className="text-sm text-slate-600">Anonymous grading, rubric alignment, and exportable analytics.</p>
          <div className="mt-3 flex justify-between text-sm text-slate-700">
            <span>Pending reviews</span>
            <strong>6</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Exports</span>
            <strong>CSV · PDF</strong>
          </div>
          <Link href="/dashboard/admin" className="mt-3 inline-flex text-sm font-semibold text-brand-600">
            View reports
          </Link>
        </Card>
      </section>
    </Layout>
  );
}
