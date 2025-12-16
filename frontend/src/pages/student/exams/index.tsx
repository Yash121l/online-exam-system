import Link from 'next/link';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const exams = [
  { title: 'Algebra Midterm', schedule: 'Tomorrow 10:00 AM', duration: '90 minutes' },
  { title: 'AI Ethics Quiz', schedule: 'Opens Friday', duration: '30 minutes' }
];

export default function StudentExamsPage() {
  return (
    <DashboardLayout title="Student Exams" subtitle="Upcoming, completed, and practice exams">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student</p>
          <h1 className="text-3xl font-bold text-primary">Available exams</h1>
        </div>
        <Button asChild>
          <Link href="/exams/launch">Launch secure client</Link>
        </Button>
      </div>
      <section className="mx-auto mt-6 grid max-w-5xl gap-3">
        {exams.map((exam) => (
          <Card key={exam.title} className="flex items-center justify-between p-4 shadow-card">
            <div>
              <p className="text-lg font-semibold text-primary">{exam.title}</p>
              <p className="text-sm text-neutral-700">
                {exam.schedule} · {exam.duration}
              </p>
            </div>
            <Link className="text-sm font-semibold text-accent" href="/student/exams/start">
              View details
            </Link>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
