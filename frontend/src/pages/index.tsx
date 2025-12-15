import Link from 'next/link';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const featureCards = [
  {
    title: 'Exam Builder',
    body: 'Upload PDFs, mix question banks, randomize sections, and lock navigation per cohort.',
    href: '/exams/builder'
  },
  {
    title: 'AI-Assisted Proctoring',
    body: 'Webcam, mic, and screen telemetry streamed from the secure Electron client with instant flags.',
    href: '/dashboard/admin'
  },
  {
    title: 'Evaluation & Reports',
    body: 'Anonymous grading, rubric alignment, and exportable CSV/PDF performance reports.',
    href: '/dashboard/admin'
  }
];

const adminFlow = [
  'Register as admin/teacher and invite evaluators.',
  'Build exams with PDF import, question pools, and section timers.',
  'Distribute exam keys and publish the secure-client download.',
  'Monitor live tiles, chat with students, and triage AI flags.',
  'Close exams, auto-mark objective items, and export insights.'
];

const studentFlow = [
  'Create a student account or use the delivered exam key.',
  'Download the locked-down Electron client from the exam page.',
  'Run device checks (camera/mic/screen) and enable offline sync.',
  'Launch the exam via aegisexam:// deep link and stay in kiosk mode.',
  'Submit responses; offline work resyncs automatically on reconnect.'
];

export default function Landing() {
  return (
    <Layout>
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Secure · Insightful · Exam ready
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Deliver high-stakes exams with an AI-supervised, secure client
          </h1>
          <p className="text-lg text-slate-600">
            AegisExam pairs a responsive Next.js portal with a kiosked Electron app so admins, evaluators, and students each get
            the right experience—without compromising security or insight.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/register">Create account</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/exams/launch">Launch secure exam</Link>
            </Button>
            <Link className="text-sm font-semibold text-brand-700 underline" href="/exams/builder">
              Explore exam builder
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            <span className="rounded-full bg-white px-3 py-1 shadow-card">25+ question formats</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card">Offline-safe client</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card">Real-time proctoring</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card">Exports: CSV · PDF</span>
          </div>
        </div>

        <Card className="border-none bg-brand-900 text-slate-100 shadow-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-100">Live command center</p>
              <p className="text-lg font-semibold">Proctoring signals</p>
            </div>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Healthy</span>
          </div>
          <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-brand-100">Active sessions</p>
              <p className="text-3xl font-bold">42</p>
              <p className="text-xs text-brand-100">12 flagged · 3 escalated</p>
            </div>
            <div>
              <p className="text-sm text-brand-100">Telemetry</p>
              <ul className="mt-1 space-y-1 text-sm">
                <li>✔️ Focus locked · shortcuts blocked</li>
                <li>✔️ Webcam + mic streaming</li>
                <li>✔️ Offline queue empty</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 px-5 py-4 text-sm text-brand-100">
            Uses NestJS WebSockets for live proctoring and a dedicated /logs endpoint for immediate violation reports from the
            Electron client.
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <Card key={card.title} className="flex h-full flex-col gap-3 p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{card.title}</p>
            <p className="text-sm text-slate-600">{card.body}</p>
            <Link className="mt-auto text-sm font-semibold text-brand-700" href={card.href}>
              View details
            </Link>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-2">
        <Card className="p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Admin / Teacher flow</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Design, deliver, monitor</h3>
            </div>
            <Button asChild variant="ghost">
              <Link href="/dashboard/admin">Open dashboard</Link>
            </Button>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            {adminFlow.map((step, idx) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Student flow</p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Secure, offline-ready</h3>
            </div>
            <Button asChild variant="ghost">
              <Link href="/dashboard/student">Open portal</Link>
            </Button>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            {studentFlow.map((step, idx) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mx-auto mt-12 max-w-6xl rounded-2xl bg-gradient-to-r from-brand-900 via-brand-600 to-brand-500 px-6 py-7 text-slate-50 shadow-card">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">Secure exam client</p>
            <h3 className="text-2xl font-bold">Electron-only delivery for high-stakes exams</h3>
            <p className="text-sm text-brand-50">
              Students must download the AegisExam secure app. When the exam page appears, they can trigger the launch button
              to open <code className="rounded bg-black/30 px-1.5 py-0.5">aegisexam://</code> links that hand control to the
              locked-down client.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/exams/launch">Download & launch</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://downloads.aegisexam.local/guide" target="_blank" rel="noreferrer">
                  View install guide
                </a>
              </Button>
            </div>
          </div>
          <Card className="bg-white/10 p-4 text-sm text-brand-50">
            <p className="font-semibold text-white">What gets enforced</p>
            <ul className="mt-2 space-y-1">
              <li>• Fullscreen kiosk window with shortcut blocking</li>
              <li>• RDP/VM heuristics with logged violations</li>
              <li>• Webcam, mic, and screen telemetry streaming</li>
              <li>• Offline log queue flushed to NestJS on reconnect</li>
            </ul>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
