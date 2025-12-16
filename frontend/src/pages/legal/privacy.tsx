import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

export default function PrivacyPage() {
  return (
    <Layout title="Privacy">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Privacy
        </p>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Privacy Policy</h1>
        <p className="text-sm text-neutral-700">
          AegisExam collects only the data required to deliver secure, compliant assessments. Contact privacy@aegisexam.local for questions.
        </p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <p className="text-sm text-neutral-700">
          We process account, exam, and proctoring data for security and academic integrity. Data is retained per contractual requirements and deleted upon request when permissible.
        </p>
      </Card>
    </Layout>
  );
}
