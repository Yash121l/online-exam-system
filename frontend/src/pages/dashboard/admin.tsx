import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { getAuth, fetchQuestionBank, fetchUpcomingSessions } from '../../lib/api';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function AdminDashboard() {
  const [authRole, setAuthRole] = useState<string | null>(null);
  const [questionBankCount, setQuestionBankCount] = useState<number>(0);
  const [upcomingSessions, setUpcomingSessions] = useState<number>(0);

  useEffect(() => {
    setAuthRole(getAuth()?.user?.role ?? null);
    fetchQuestionBank()
      .then((items) => setQuestionBankCount(items.length))
      .catch(() => setQuestionBankCount(0));
    fetchUpcomingSessions()
      .then((items) => setUpcomingSessions(items.length))
      .catch(() => setUpcomingSessions(0));
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="System overview, monitoring, and org management">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-200">Admin / Super Admin</p>
          <h1 className="text-3xl font-bold text-primary dark:text-neutral-50">Platform command center</h1>
          <p className="text-neutral-700 dark:text-neutral-300">
            Monitor system health, manage organizations, and keep exams running securely with AI-assisted proctoring.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/exams/builder">Go to builder</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard/invigilation">Live monitor</Link>
            </Button>
          </div>
          {authRole && (
            <div className="inline-flex items-center rounded-lg bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-200">
              Signed in as {authRole}
            </div>
          )}
        </div>
        <Card className="p-5 bg-brand-900 text-slate-100 dark:bg-neutral-900">
          <CardHeader className="text-slate-100">System Overview</CardHeader>
          <CardContent className="text-slate-200">
            <ul className="list-disc space-y-1 pl-4">
              <li>Live sessions: 47/50 · Watchlist: 3</li>
              <li>Flags: eye-off (4), mic-muted (2), suspected RDP (1)</li>
              <li>Last sync: 32s ago · Audit log streaming</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary dark:text-neutral-100">Question banks</p>
          <p className="text-2xl font-bold text-primary dark:text-neutral-50">{questionBankCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary dark:text-neutral-100">Upcoming sessions</p>
          <p className="text-2xl font-bold text-primary dark:text-neutral-50">{upcomingSessions}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary dark:text-neutral-100">Status</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">Connected</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary dark:text-neutral-100">Live monitor</p>
          <p className="text-2xl font-bold text-primary dark:text-neutral-50">Ready</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-primary dark:text-neutral-50">Operations</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              <p className="font-semibold text-primary dark:text-neutral-100">Organizations</p>
              <p>Manage tenants, billing plans, and access control.</p>
              <Link className="mt-1 inline-flex text-sm font-semibold text-accent" href="/admin/organizations">
                Open
              </Link>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              <p className="font-semibold text-primary dark:text-neutral-100">Audit logs</p>
              <p>Review security + proctoring events across the platform.</p>
              <Link className="mt-1 inline-flex text-sm font-semibold text-accent" href="/admin/audit-logs">
                View logs
              </Link>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-primary dark:text-neutral-50">Support & alerts</h3>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>• 5 open support tickets</li>
            <li>• 2 SLA breaches risk flagged</li>
            <li>• Health: API 99.95% · WS 99.9%</li>
          </ul>
        </Card>
      </section>
    </DashboardLayout>
  );
}
