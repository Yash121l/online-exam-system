import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const bank = [
  { prompt: 'What principle does GDPR emphasize?', type: 'MCQ' },
  { prompt: 'Prove the Pythagorean theorem.', type: 'LONG_ANSWER' },
  { prompt: 'Label the parts of the cell.', type: 'DRAG_DROP' }
];

export default function TeacherQuestionsPage() {
  return (
    <DashboardLayout title="Question Bank" subtitle="Create and manage questions">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Question bank</p>
          <h1 className="text-3xl font-bold text-primary">Create and manage questions</h1>
        </div>
        <Button>Create question</Button>
      </div>
      <section className="mx-auto mt-6 grid max-w-6xl gap-3 md:grid-cols-3">
        {bank.map((item) => (
          <Card key={item.prompt} className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">{item.type}</p>
            <p className="text-sm text-neutral-700">{item.prompt}</p>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
