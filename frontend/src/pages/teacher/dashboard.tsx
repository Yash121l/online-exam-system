import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Create exams, monitor sessions, and review grading">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Teacher workspace</p>
          <h1 className="text-3xl font-bold text-primary">Welcome back</h1>
          <p className="text-neutral-700">Manage exams, monitor sessions, and review grading queues in one place.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/exams/builder">Create exam</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard/invigilation">Open monitor</Link>
            </Button>
          </div>
        </div>
        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quick stats</p>
          <div className="mt-3 space-y-2 text-sm text-neutral-700">
            <div className="flex justify-between">
              <span>Active exams</span>
              <strong>5</strong>
            </div>
            <div className="flex justify-between">
              <span>Pending grades</span>
              <strong>23</strong>
            </div>
            <div className="flex justify-between">
              <span>Students</span>
              <strong>142</strong>
            </div>
          </div>
        </Card>
      </div>

      <section className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card">
          <p className="text-lg font-semibold text-primary">Exams</p>
          <p className="text-sm text-neutral-700">Draft, publish, and monitor exams with scheduling rules.</p>
          <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/teacher/exams">
            View exams
          </Link>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-lg font-semibold text-primary">Questions</p>
          <p className="text-sm text-neutral-700">Question banks, media uploads, and preview modes.</p>
          <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/teacher/questions">
            Question bank
          </Link>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-lg font-semibold text-primary">Reports</p>
          <p className="text-sm text-neutral-700">Performance analytics and export jobs.</p>
          <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/teacher/reports">
            Reports
          </Link>
        </Card>
      </section>
    </DashboardLayout>
  );
}
