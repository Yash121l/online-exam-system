import Link from 'next/link';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const tiers = [
  {
    name: 'STARTER',
    price: '$99/mo',
    description: 'For small cohorts and pilots.',
    bullets: ['Up to 50 students', '10 exams/mo', 'Basic proctoring', 'Standard support']
  },
  {
    name: 'GROWTH',
    price: '$299/mo',
    description: 'For growing programs needing AI-assisted monitoring.',
    bullets: ['Up to 500 students', '100 exams/mo', 'AI-assisted proctoring', 'Priority support']
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    description: 'For scaled programs with advanced security + SLAs.',
    bullets: ['Unlimited students', 'Unlimited exams', 'Enterprise features', 'Dedicated success']
  }
];

const compareRows = [
  { label: 'Secure client', starter: 'Included', growth: 'Included', enterprise: 'Included + SSO' },
  { label: 'AI proctoring', starter: 'Basic flags', growth: 'Full AI flags', enterprise: 'Full + custom rules' },
  { label: 'Question formats', starter: '25+', growth: '25+', enterprise: '25+ with custom' },
  { label: 'Support', starter: 'Standard', growth: 'Priority', enterprise: 'Dedicated manager' },
  { label: 'Exports', starter: 'CSV/PDF', growth: 'CSV/PDF', enterprise: 'CSV/PDF/Custom' }
];

export default function PricingPage() {
  return (
    <Layout title="Pricing">
      <section className="mx-auto max-w-5xl space-y-4 text-center">
        <p className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Pricing
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Choose the right plan</h1>
        <p className="text-lg text-neutral-700">
          Simple, transparent pricing with secure delivery baked in. Every plan includes the Electron secure client and live proctoring.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/auth/register">Start free trial</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Talk to sales</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className="flex h-full flex-col justify-between border border-neutral-200 bg-white/80 p-6 shadow-card">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{tier.name}</p>
              <p className="text-3xl font-bold text-primary">{tier.price}</p>
              <p className="text-sm text-neutral-700">{tier.description}</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {tier.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href="/auth/register">Select plan</Link>
            </Button>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Compare plans</p>
            <h2 className="text-xl font-bold text-primary">What’s included</h2>
          </div>
          <Link className="text-sm font-semibold text-accent" href="/contact">
            Need custom pricing?
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
          <div className="grid grid-cols-4 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <span>Capability</span>
            <span>Starter</span>
            <span>Growth</span>
            <span>Enterprise</span>
          </div>
          {compareRows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-800">
              <span className="font-semibold text-primary">{row.label}</span>
              <span>{row.starter}</span>
              <span>{row.growth}</span>
              <span>{row.enterprise}</span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
