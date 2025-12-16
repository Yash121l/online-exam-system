import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

const queue = [
  { exam: 'Algebra Midterm', pending: 5 },
  { exam: 'AI Ethics Quiz', pending: 3 }
];

export default function EvaluatorDashboardPage() {
  return (
    <DashboardLayout title="Evaluator Dashboard" subtitle="Assigned evaluations and grading queue">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Evaluator</p>
          <h1 className="text-3xl font-bold text-primary">Grading queue</h1>
          <p className="text-neutral-700">Anonymous grading, rubric alignment, and feedback workflows.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student">Switch to student</Link>
        </Button>
      </div>
      <section className="mx-auto mt-6 grid max-w-5xl gap-3 md:grid-cols-2">
        {queue.map((item) => (
          <Card key={item.exam} className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">{item.exam}</p>
            <p className="text-sm text-neutral-700">Pending: {item.pending}</p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/teacher/grading">
              Open grading view
            </Link>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
