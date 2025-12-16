import { FormEvent, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('Thanks for reaching out! A member of the team will reply shortly.');
  };

  return (
    <Layout title="Contact">
      <section className="mx-auto max-w-4xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Contact
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Talk with AegisExam</h1>
        <p className="text-lg text-neutral-700">Sales, support, or partnership questions—let us know how we can help.</p>
      </section>

      <section className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 shadow-card">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-neutral-800">
              Name
              <Input placeholder="Your name" />
            </label>
            <label className="text-sm font-semibold text-neutral-800">
              Email
              <Input type="email" placeholder="you@example.com" />
            </label>
            <label className="text-sm font-semibold text-neutral-800">
              Topic
              <Input placeholder="Support, sales, security, partnership..." />
            </label>
            <label className="text-sm font-semibold text-neutral-800">
              Message
              <textarea className="mt-1 w-full rounded-lg border border-neutral-300 p-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" rows={4} />
            </label>
            <Button type="submit" className="w-full">
              Send message
            </Button>
            {status && <p className="text-sm text-neutral-700">{status}</p>}
          </form>
        </Card>
        <Card className="p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Other ways</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>• Email: support@aegisexam.local</li>
            <li>• Docs: /docs</li>
            <li>• Status: /legal/status</li>
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Offices</p>
          <p className="text-sm text-neutral-700">Remote-first with teams across NA, EU, and APAC.</p>
        </Card>
      </section>
    </Layout>
  );
}
