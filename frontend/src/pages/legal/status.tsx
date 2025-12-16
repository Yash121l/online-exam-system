import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

export default function StatusPage() {
  return (
    <Layout title="Status">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Status
        </p>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Platform Status</h1>
        <p className="text-sm text-neutral-700">Current availability across API, proctoring WebSockets, and storage.</p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <p className="text-sm text-neutral-700">
          All systems operational. For incidents, visit /legal/status or subscribe to updates via status@aegisexam.local.
        </p>
      </Card>
    </Layout>
  );
}
