import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

export default function TermsPage() {
  return (
    <Layout title="Terms">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Terms
        </p>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Terms of Service</h1>
        <p className="text-sm text-neutral-700">Use of AegisExam is subject to these terms and your institution&apos;s agreements.</p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <p className="text-sm text-neutral-700">Service availability, acceptable use, and data handling are defined in your subscription agreement.</p>
      </Card>
    </Layout>
  );
}
