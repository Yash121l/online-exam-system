import Link from 'next/link';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const exams = [
  { title: 'Algebra Midterm', status: 'Active', students: 50 },
  { title: 'AI Ethics Quiz', status: 'Draft', students: 30 },
  { title: 'Chemistry Final', status: 'Completed', students: 120 }
];

export default function TeacherExamsPage() {
  return (
    <DashboardLayout title="Teacher Exams" subtitle="Manage drafts, active, and completed exams">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Exams</p>
          <h1 className="text-3xl font-bold text-primary">Manage exams</h1>
        </div>
        <Button asChild>
          <Link href="/exams/builder">Create new</Link>
        </Button>
      </div>
      <section className="mx-auto mt-6 grid max-w-6xl gap-3">
        {exams.map((exam) => (
          <Card key={exam.title} className="flex items-center justify-between p-4 shadow-card">
            <div>
              <p className="text-lg font-semibold text-primary">{exam.title}</p>
              <p className="text-sm text-neutral-700">Students: {exam.students}</p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="rounded-full bg-neutral-100 px-3 py-1">{exam.status}</span>
              <Link className="text-accent" href="/dashboard/invigilation">
                Monitor
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
