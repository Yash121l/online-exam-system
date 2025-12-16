import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

export default function LegalSecurityPage() {
  return (
    <Layout title="Security Policy">
      <section className="mx-auto max-w-4xl space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Security
        </p>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Security Policy</h1>
        <p className="text-sm text-neutral-700">A snapshot of our operational and technical controls.</p>
      </section>
      <Card className="mx-auto mt-6 max-w-4xl p-5 shadow-card">
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>• Secure coding practices, dependency scanning, and regular penetration testing.</li>
          <li>• Access control with least privilege and audit logging.</li>
          <li>• Encryption in transit and at rest for sensitive artifacts.</li>
        </ul>
      </Card>
    </Layout>
  );
}
