import Link from 'next/link';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const sections = [
  { title: 'Getting started', links: ['/auth/register', '/exams/builder', '/exams/launch'] },
  { title: 'Admins & teachers', links: ['/dashboard/admin', '/teacher/exams', '/teacher/reports'] },
  { title: 'Students', links: ['/dashboard/student', '/student/exams', '/student/results'] }
];

export default function DocsPage() {
  return (
    <Layout title="Docs">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Documentation
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">AegisExam documentation</h1>
        <p className="text-lg text-neutral-700">Quick links to key workflows across roles.</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Request onboarding</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.title}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-700">
              {section.links.map((href) => (
                <Link key={href} className="font-semibold text-accent" href={href}>
                  {href}
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </Layout>
  );
}
