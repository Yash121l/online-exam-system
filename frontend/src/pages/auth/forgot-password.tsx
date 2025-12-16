import { FormEvent, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('If this email exists, we sent a verification code.');
  };

  return (
    <Layout title="Forgot Password">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reset access</p>
          <h1 className="text-3xl font-bold text-primary">Forgot password</h1>
          <p className="text-neutral-700">Enter your email to receive a verification code and set a new password.</p>
        </div>
        <Card className="p-5 shadow-card">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-neutral-800">
              Email
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <Button type="submit" className="w-full">
              Send code
            </Button>
            {status && <p className="text-sm text-neutral-700">{status}</p>}
            <p className="text-sm text-neutral-700">
              Remembered it?{' '}
              <Link className="font-semibold text-accent" href="/auth/login">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
