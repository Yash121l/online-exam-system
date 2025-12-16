import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';

const queue = [
  { title: 'Algebra Midterm - Attempt #234', status: 'Pending' },
  { title: 'AI Ethics Quiz - Attempt #111', status: 'In progress' }
];

export default function TeacherGradingPage() {
  return (
    <DashboardLayout title="Grading" subtitle="Anonymous grading with rubric alignment and feedback capture">
      <section className="mx-auto max-w-5xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Grading</p>
        <h1 className="text-3xl font-bold text-primary">Grading queue</h1>
        <p className="text-neutral-700">Anonymous grading with rubric alignment and feedback capture.</p>
      </section>
      <section className="mx-auto mt-6 grid max-w-5xl gap-3">
        {queue.map((item) => (
          <Card key={item.title} className="flex items-center justify-between p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">{item.title}</p>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-primary">{item.status}</span>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
