import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <Layout title="About">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Our mission
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Built for secure, equitable assessments</h1>
        <p className="text-lg text-neutral-700">
          AegisExam exists to make remote and hybrid exams secure, fair, and insight-rich—without adding friction for students or educators.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/security">Read our security approach</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Vision</p>
          <p className="mt-2 text-sm text-neutral-700">
            Enterprise-grade exam delivery paired with a delightful user experience. We combine AI-assisted proctoring, secure client controls, and transparent analytics so every stakeholder trusts the outcome.
          </p>
        </Card>
        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Values</p>
          <ul className="mt-2 space-y-2 text-sm text-neutral-700">
            <li>• Trust & reliability</li>
            <li>• Security-first thinking</li>
            <li>• Accessibility and equity</li>
            <li>• Innovation with clarity</li>
          </ul>
        </Card>
      </section>

      <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Where we are going</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">AI-assisted proctoring</p>
            <p className="text-sm text-neutral-700">Continuous improvement of signal quality, summaries, and coachable alerts.</p>
          </Card>
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">Accessibility</p>
            <p className="text-sm text-neutral-700">WCAG 2.1 AA compliance and learner-centered configuration by default.</p>
          </Card>
          <Card className="p-4 shadow-card">
            <p className="text-sm font-semibold text-primary">Global delivery</p>
            <p className="text-sm text-neutral-700">Localization, timezone-aware scheduling, and resilient offline sync.</p>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
