import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';

const results = [
  { exam: 'Algebra Midterm', score: '85%', feedback: 'Great work on problem solving.' },
  { exam: 'AI Ethics Quiz', score: '92%', feedback: 'Clear reasoning on case study.' }
];

export default function StudentResultsPage() {
  return (
    <DashboardLayout title="Results" subtitle="Scores, feedback, and insights">
      <section className="mx-auto max-w-5xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Results</p>
        <h1 className="text-3xl font-bold text-primary">Your performance</h1>
        <p className="text-neutral-700">Scores, feedback, and performance insights.</p>
      </section>
      <section className="mx-auto mt-6 grid max-w-5xl gap-3">
        {results.map((item) => (
          <Card key={item.exam} className="p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-primary">{item.exam}</p>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">{item.score}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-700">{item.feedback}</p>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
