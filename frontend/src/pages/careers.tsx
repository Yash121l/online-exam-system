import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';

export default function CareersPage() {
  return (
    <Layout title="Careers">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Careers
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Build the future of secure assessment</h1>
        <p className="text-lg text-neutral-700">We are remote-first and hiring across engineering, design, and customer success.</p>
      </section>
      <Card className="mx-auto mt-8 max-w-5xl p-6 shadow-card">
        <p className="text-sm text-neutral-700">No open roles listed yet. Reach out at careers@aegisexam.local.</p>
      </Card>
    </Layout>
  );
}
