import { DashboardLayout } from '../../../components/DashboardLayout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const checklist = [
  { label: 'Secure client installed', status: true },
  { label: 'Camera detected', status: true },
  { label: 'Microphone working', status: true },
  { label: 'Internet stable', status: true },
  { label: 'Close other applications', status: false }
];

export default function StudentExamStartPage() {
  return (
    <DashboardLayout title="Pre-exam Checklist" subtitle="Complete checks before launching the secure client">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pre-exam checklist</p>
        <h1 className="text-3xl font-bold text-primary">Confirm your system</h1>
        <p className="text-neutral-700">Complete checks before launching the secure client.</p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <ul className="space-y-2 text-sm text-neutral-700">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">
              <span>{item.label}</span>
              <span className={item.status ? 'text-secondary' : 'text-warning'}>{item.status ? '✓' : '✗'}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full">Complete checklist to continue</Button>
      </Card>
    </DashboardLayout>
  );
}
