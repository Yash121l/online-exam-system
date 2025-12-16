import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';

const controls = [
  'Electron secure client with fullscreen lockdown',
  'Shortcut suppression and focus loss detection',
  'RDP/VM heuristics and print-screen logging',
  'Signed S3 URLs for media and artifacts',
  'Role-based access control and JWT auth',
  'Structured logging + audit trails'
];

export default function SecurityPage() {
  return (
    <Layout title="Security">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Security
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Security and compliance by design</h1>
        <p className="text-lg text-neutral-700">
          AegisExam is built with security-first defaults: locked-down client delivery, rigorous proctoring signals, and audit-ready logging.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/contact">Request security brief</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/legal/security">View policies</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Controls</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {controls.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Compliance</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>• SOC 2-aligned controls</li>
            <li>• GDPR-ready data handling</li>
            <li>• WCAG 2.1 AA accessibility commitment</li>
            <li>• Audit logging for API + WebSocket events</li>
          </ul>
          <Link className="mt-3 inline-flex text-sm font-semibold text-accent" href="/legal/compliance">
            Download security overview
          </Link>
        </Card>
      </section>

      <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Monitoring</p>
        <p className="mt-2 text-sm text-neutral-700">
          Live proctoring dashboards connect over secure WebSockets. All events are streamed to the backend for correlation with request and socket logs.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">Alerts</p>
            <p className="text-sm text-neutral-700">AI flags with escalation paths for review.</p>
          </Card>
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">Resilience</p>
            <p className="text-sm text-neutral-700">Offline queueing of logs and replay on reconnect.</p>
          </Card>
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">Privacy</p>
            <p className="text-sm text-neutral-700">Data minimization and controlled retention windows.</p>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
