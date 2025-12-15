import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { getAuth } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function StudentDashboard() {
  const [authRole, setAuthRole] = useState<string | null>(null);

  useEffect(() => {
    setAuthRole(getAuth()?.role ?? null);
  }, []);

  return (
    <Layout title="Student Dashboard">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Student Experience</p>
          <h1 className="text-3xl font-bold text-slate-900">Enter your secure exam space</h1>
          <p className="text-slate-600">
            Access exams with unique keys, stay within the locked-down client, and sync progress even if you go offline.
          </p>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-900 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-brand-500 hover:text-brand-700"
            >
              Create Student Account
            </Link>
          </div>
          {authRole && (
            <div className="inline-flex items-center rounded-lg bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              Signed in as {authRole}
            </div>
          )}
        </div>
        <Card className="bg-brand-900 p-5 text-slate-100">
          <div className="text-sm font-semibold">Secure Client Checklist</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-200">
            <li>Full-screen enforced, shortcuts blocked</li>
            <li>Mic & camera permissions granted</li>
            <li>Offline cache ready; auto-resync enabled</li>
          </ul>
        </Card>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Exams</h3>
          <div className="mt-2 flex justify-between text-sm text-slate-700">
            <span>Cybersecurity Fundamentals</span>
            <strong>Today · 5:00 PM</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Data Structures</span>
            <strong>Tomorrow · 11:00 AM</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Design Thinking</span>
            <strong>Dec 18 · 9:00 AM</strong>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Enter Exam Key</h3>
          <Input placeholder="e.g., AE-4F9Q-2024" className="mt-2" />
          <Button className="mt-3 w-full">Join Exam</Button>
          <p className="text-sm text-slate-600">Use the secure Electron client for high-stakes exams.</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Proctoring Status</h3>
          <div className="mt-2 flex justify-between text-sm text-slate-700">
            <span>Camera</span>
            <strong>Active</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Microphone</span>
            <strong>Active</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Screen Share</span>
            <strong>Active</strong>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>Flags</span>
            <strong>None</strong>
          </div>
        </Card>
      </section>
    </Layout>
  );
}
