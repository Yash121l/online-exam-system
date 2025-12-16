import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/ui/card';

const reports = [
  { title: 'Exam performance', description: 'Scores, time on task, item analysis.' },
  { title: 'Student performance', description: 'Trends across courses and attempts.' },
  { title: 'Proctoring summary', description: 'Flags, escalations, and review notes.' }
];

export default function TeacherReportsPage() {
  return (
    <DashboardLayout title="Reports" subtitle="Analytics and export jobs">
      <section className="mx-auto max-w-5xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reports</p>
        <h1 className="text-3xl font-bold text-primary">Analytics & exports</h1>
        <p className="text-neutral-700">Export-ready dashboards for exams, students, questions, and proctoring.</p>
      </section>
      <section className="mx-auto mt-6 grid max-w-5xl gap-3 md:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title} className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">{report.title}</p>
            <p className="text-sm text-neutral-700">{report.description}</p>
          </Card>
        ))}
      </section>
    </DashboardLayout>
  );
}
