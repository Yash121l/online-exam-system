import Link from 'next/link';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const pillars = [
  {
    title: 'Uncompromising Security',
    icon: '🛡️',
    items: ['Secure exam client with fullscreen lockdown', 'AI-assisted proctoring with live monitoring', 'Advanced cheat detection + audit logs'],
    href: '/security'
  },
  {
    title: 'Intelligent Assessment',
    icon: '🧠',
    items: ['25+ question types with section rules', 'Auto-grading + manual review workflow', 'Advanced analytics and insights'],
    href: '/features'
  },
  {
    title: 'Seamless Experience',
    icon: '✨',
    items: ['Role-aware dashboards for every user', 'Electron client for high-stakes delivery', 'Accessibility built-in'],
    href: '/dashboard/student'
  },
  {
    title: 'Data-Driven Insights',
    icon: '📊',
    items: ['Comprehensive reporting', 'Performance + difficulty analysis', 'CSV/PDF/Excel exports'],
    href: '/dashboard/admin'
  }
];

const useCases = ['Higher Education', 'K-12 Schools', 'Corporate Training & Certification', 'Professional Licensing'];

const comparison = [
  { feature: 'Secure lockdown client', aegis: 'Electron + deep link', mettl: 'Limited', examNet: 'Browser-only' },
  { feature: 'AI proctoring flags', aegis: 'Real-time + audit log', mettl: 'Basic', examNet: 'Add-on' },
  { feature: 'Question formats', aegis: '25+', mettl: '15+', examNet: '10+' },
  { feature: 'Offline tolerance', aegis: 'Queue + replay', mettl: 'Limited', examNet: 'No' }
];

const pricing = [
  { name: 'STARTER', price: '$99/mo', bullets: ['Up to 50 students', '10 exams/mo', 'Basic proctoring', 'Standard support'] },
  { name: 'GROWTH', price: '$299/mo', bullets: ['Up to 500 students', '100 exams/mo', 'AI-assisted proctoring', 'Priority support'] },
  { name: 'ENTERPRISE', price: 'Custom', bullets: ['Unlimited students', 'Unlimited exams', 'Enterprise security', 'Dedicated success mgr'] }
];

export default function Landing() {
  return (
    <Layout>
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Secure · Intelligent · Uncompromising
          </p>
          <h1 className="text-4xl font-bold leading-tight text-primary dark:text-neutral-50 md:text-5xl">Next-Generation Exam Platform</h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-200">
            Secure. Intelligent. Fair. AI-powered proctoring meets seamless assessment for Higher Ed, K-12, and Corporate training.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/features">Watch Demo</Link>
            </Button>
            <Link className="text-sm font-semibold text-accent underline" href="/contact">
              Schedule Consultation
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            <span className="rounded-full bg-white px-3 py-1 shadow-card dark:bg-neutral-900">25+ question formats</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card dark:bg-neutral-900">AI proctoring</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card dark:bg-neutral-900">Offline resync</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-card dark:bg-neutral-900">Reports & exports</span>
          </div>
        </div>

        <Card className="relative overflow-hidden border border-white/60 bg-gradient-to-br from-primary to-brand-700 text-white shadow-glass dark:border-neutral-800">
          <div className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] bg-gradient-to-br from-white/5 via-accent/10 to-white/5" />
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-200">Live proctoring preview</p>
              <p className="text-lg font-semibold">Real-time telemetry</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">Healthy</span>
          </div>
          <div className="relative grid gap-4 px-5 py-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-neutral-200">Active sessions</p>
              <p className="text-3xl font-bold">234</p>
              <p className="text-xs text-neutral-200">42 flagged · 3 escalated</p>
            </div>
            <div>
              <p className="text-sm text-neutral-200">Telemetry</p>
              <ul className="mt-1 space-y-1 text-sm">
                <li>✔️ Focus shifts + shortcut blocks</li>
                <li>✔️ Webcam, mic, and screen streams</li>
                <li>✔️ Signed S3 uploads + offline queue</li>
              </ul>
            </div>
          </div>
          <div className="relative border-t border-white/10 px-5 py-4 text-sm text-neutral-100">
            AI-powered proctoring with live flags, secure Electron delivery, and offline cache with auto-resync.
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-12 max-w-7xl rounded-3xl border border-white/60 bg-white/80 p-8 shadow-card backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Features</p>
            <h2 className="text-2xl font-bold text-primary dark:text-neutral-50">Security, intelligence, experience, insight</h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/features">View detailed features</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((feature) => (
            <Card key={feature.title} className="flex h-full flex-col gap-3 p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-100">
                {feature.icon} {feature.title}
              </p>
              <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
                {feature.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link className="mt-auto text-sm font-semibold text-accent" href={feature.href}>
                View details
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Use cases</p>
              <h3 className="mt-1 text-xl font-bold text-primary dark:text-neutral-50">Built for every assessment team</h3>
            </div>
            <Button asChild variant="ghost">
              <Link href="/about">Why AegisExam</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {useCases.map((caseName) => (
              <div key={caseName} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                {caseName}
              </div>
            ))}
          </div>
        </Card>
          <Card className="p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Social proof</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-3xl font-bold text-primary dark:text-neutral-50">12,453</p>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Total users</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-3xl font-bold text-primary">1,289</p>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Exams today</p>
            </div>
          </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-secondary">SOC 2 Ready</span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">GDPR aligned</span>
            <span className="rounded-full bg-warning/10 px-3 py-1 text-warning">Accessibility-first</span>
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Comparison</p>
            <h3 className="text-xl font-bold text-primary dark:text-neutral-50">How AegisExam compares</h3>
          </div>
          <Link className="text-sm font-semibold text-accent" href="/pricing">
            View pricing
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <span>Feature</span>
            <span>AegisExam</span>
            <span>Mettl</span>
            <span>Exam.net</span>
          </div>
          {comparison.map((row) => (
            <div key={row.feature} className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-t border-neutral-200 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
              <span className="font-semibold text-primary dark:text-neutral-100">{row.feature}</span>
              <span>{row.aegis}</span>
              <span>{row.mettl}</span>
              <span>{row.examNet}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Pricing preview</p>
            <h3 className="text-xl font-bold text-primary">Pick the plan that fits</h3>
          </div>
          <Button asChild variant="secondary">
            <Link href="/pricing">View detailed pricing</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pricing.map((tier) => (
            <Card key={tier.name} className="flex h-full flex-col justify-between border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-800 dark:bg-neutral-900">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-100">{tier.name}</p>
                <p className="text-3xl font-bold text-primary dark:text-neutral-50">{tier.price}</p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
                  {tier.bullets.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Button asChild className="mt-6 w-full">
                <Link href="/pricing">Choose plan</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl rounded-3xl bg-gradient-to-r from-primary via-brand-700 to-accent px-8 py-10 text-white shadow-card">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-200">Secure exam client</p>
            <h3 className="text-2xl font-bold">Electron-only delivery for high-stakes exams</h3>
            <p className="text-sm text-neutral-100">
              Students launch via <code className="rounded bg-black/30 px-1.5 py-0.5">aegisexam://</code> deep links. The client enforces fullscreen, blocks shortcuts, streams telemetry, and replays logs if offline.
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
          <Card className="bg-white/10 p-4 text-sm text-neutral-100">
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
