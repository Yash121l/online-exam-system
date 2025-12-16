import Link from 'next/link';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const deepFeatures = [
  {
    title: 'Secure delivery',
    bullets: ['Electron secure client + aegisexam:// deep links', 'Fullscreen + shortcut suppression with audit trail', 'Offline cache with replay on reconnect']
  },
  {
    title: 'Proctoring & flags',
    bullets: ['Webcam, mic, and screen telemetry', 'AI-assisted flagging with escalation states', 'Live monitoring tiles + chat']
  },
  {
    title: 'Assessment depth',
    bullets: ['25+ question formats and randomization controls', 'Section timers, navigation rules, and accommodations', 'Media with signed S3 URLs and PDF region tagging']
  },
  {
    title: 'Evaluation & grading',
    bullets: ['Anonymous grading queues and rubrics', 'Bulk assignment to evaluators', 'Exports to CSV/PDF and audit logs']
  }
];

const wizardSteps = [
  'Basic info: title, description, type, and scheduling window',
  'Question selection: browse banks, add sections, set points',
  'Configuration: duration, navigation, allowed tools',
  'Security & proctoring: proctoring level, AI options, secure client',
  'Assignment: students/groups, access codes, accommodations',
  'Review & publish: preview exam, final checks, publish or draft'
];

export default function FeaturesPage() {
  return (
    <Layout title="Features">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Feature deep dive
          </p>
          <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">Everything teams need to deliver secure exams</h1>
          <p className="text-lg text-neutral-700">
            From blueprint to grading, AegisExam pairs a modern portal with a locked-down client, AI-assisted proctoring, and data-rich reports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/register">Start trial</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/pricing">View pricing</Link>
            </Button>
            <Link className="text-sm font-semibold text-accent underline" href="/contact">
              Schedule a walkthrough
            </Link>
          </div>
        </div>
        <Card className="border border-neutral-200 bg-white/80 p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Role-aware dashboards</p>
          <div className="mt-4 grid gap-3 text-sm text-neutral-800">
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <span>SUPER ADMIN</span>
              <span className="font-semibold text-primary">/admin/dashboard</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <span>ADMIN/TEACHER</span>
              <span className="font-semibold text-primary">/teacher/dashboard</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <span>EVALUATOR</span>
              <span className="font-semibold text-primary">/evaluator/dashboard</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <span>STUDENT</span>
              <span className="font-semibold text-primary">/student/dashboard</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Platform pillars</p>
            <h2 className="text-2xl font-bold text-primary">Security, intelligence, and insight baked in</h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/dashboard/admin">Open dashboard</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {deepFeatures.map((feature) => (
            <Card key={feature.title} className="p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{feature.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {feature.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Exam creation wizard</p>
          <h3 className="mt-1 text-xl font-bold text-primary">6-step flow with guardrails</h3>
          <ol className="mt-4 space-y-3 text-sm text-neutral-700">
            {wizardSteps.map((step, idx) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>
        <div className="space-y-4">
          <Card className="p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live monitoring</p>
            <p className="mt-1 text-sm text-neutral-700">
              Real-time WebSocket dashboard with tiles, filters, and chat. AI flags stream in with summaries for triage.
            </p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/dashboard/invigilation">
              View live monitor
            </Link>
          </Card>
          <Card className="p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Question creator</p>
            <p className="mt-1 text-sm text-neutral-700">
              Rich text, LaTeX equations, media uploads via signed S3 URLs, and preview mode for every question type.
            </p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/teacher/questions">
              Browse question bank
            </Link>
          </Card>
          <Card className="p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reports & exports</p>
            <p className="mt-1 text-sm text-neutral-700">
              Performance analytics, question difficulty analysis, and export jobs to CSV/PDF with download links.
            </p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/dashboard/admin">
              Open reports
            </Link>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
