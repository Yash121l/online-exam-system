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
  const [remember, setRemember] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password, remember });
      clientLogger.info('User logged in', { email });
      const auth = getAuth();
      const role = auth?.user?.role;
      if (role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (role === 'EVALUATOR') {
        router.push('/evaluator/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Sign In">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-200">Secure access</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-neutral-50">Welcome back</h1>
          <p className="text-slate-600 dark:text-neutral-300">Sign in as admin, evaluator, or student to continue your exam journey.</p>
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-500/10">{error}</div>}
          <Card className="p-4 text-sm text-slate-700 dark:bg-neutral-800 dark:text-neutral-200">
            <p className="font-semibold text-slate-900 dark:text-neutral-50">Student?</p>
            <p className="mt-1">Launch via the secure Electron client for production exams.</p>
            <Link className="mt-2 inline-flex text-sm font-semibold text-accent" href="/exams/launch">
              Download & launch
            </Link>
          </Card>
        </div>
        <Card className="p-5 dark:bg-neutral-800">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
              Email
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-200">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link className="font-semibold text-accent" href="/auth/forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/auth/register">Create account</Link>
              </Button>
            </div>
            <div className="grid gap-2 pt-2 text-sm text-neutral-600 dark:text-neutral-300">
              <Button variant="secondary" type="button" className="w-full">
                Continue with Google (SSO)
              </Button>
              <Button variant="secondary" type="button" className="w-full">
                Continue with Microsoft
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
