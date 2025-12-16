import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';

const posts = [
  { title: 'Designing fair remote exams', tag: 'Product', href: '#' },
  { title: 'Secure client deep dive', tag: 'Security', href: '#' },
  { title: 'How we built AI flagging', tag: 'Engineering', href: '#' }
];

export default function BlogIndex() {
  return (
    <Layout title="Blog">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Blog
        </p>
        <h1 className="text-4xl font-bold text-primary md:text-5xl">Insights and updates</h1>
        <p className="text-lg text-neutral-700">Security, assessment design, and product updates from the AegisExam team.</p>
      </section>

      <section className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.title} className="p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{post.tag}</p>
            <p className="mt-2 text-lg font-semibold text-primary">{post.title}</p>
            <Link className="mt-3 inline-flex text-sm font-semibold text-accent" href={post.href}>
              Read more
            </Link>
          </Card>
        ))}
      </section>
    </Layout>
  );
}
