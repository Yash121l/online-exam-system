import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Layout } from '../../components/Layout';
import { clientLogger } from '../../lib/logger';
import { login, getAuth } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      clientLogger.info('User logged in', { email });
      const auth = getAuth();
      if (auth?.role === 'STUDENT') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/admin');
      }
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Sign In">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Secure access</p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600">Sign in as admin, evaluator, or student to continue your exam journey.</p>
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <Card className="p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Student?</p>
            <p className="mt-1">Launch via the secure Electron client for production exams.</p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-brand-700" href="/exams/launch">
              Download & launch
            </Link>
          </Card>
        </div>
        <Card className="p-5">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-slate-700">
              Email
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-slate-600">
              No account?{' '}
              <Link className="font-semibold text-brand-700" href="/auth/register">
                Register here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
