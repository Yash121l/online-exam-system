import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [counter, setCounter] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout title="Verify Email">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Verification</p>
          <h1 className="text-3xl font-bold text-primary">Check your email</h1>
          <p className="text-neutral-700">We sent a 6-digit verification code. Enter it in your secure client or here to continue.</p>
        </div>
        <Card className="p-5 shadow-card">
          <div className="space-y-2 text-sm text-neutral-700">
            <p>Status: <span className="font-semibold text-secondary">Pending verification</span></p>
            <p>Auto-redirect after verification: {counter}s</p>
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
