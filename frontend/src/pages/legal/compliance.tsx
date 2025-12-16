import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

export default function CompliancePage() {
  return (
    <Layout title="Compliance">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Compliance
        </p>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Compliance Overview</h1>
        <p className="text-sm text-neutral-700">GDPR alignment, SOC 2-ready controls, and WCAG accessibility commitments.</p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <p className="text-sm text-neutral-700">
          Data processing agreements and sub-processor listings are available upon request. We implement data minimization, breach notification processes, and configurable retention windows.
        </p>
      </Card>
    </Layout>
  );
}
