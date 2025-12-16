import { FormEvent, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('2FA verified. Redirecting...');
  };

  return (
    <Layout title="Two-Factor Authentication">
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">2FA</p>
          <h1 className="text-3xl font-bold text-primary">Two-factor authentication</h1>
          <p className="text-neutral-700">Enter the 6-digit code from your authenticator app or email.</p>
        </div>
        <Card className="p-5 shadow-card">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-neutral-800">
              Code
              <Input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
            </label>
            <Button type="submit" className="w-full">
              Verify
            </Button>
            {status && <p className="text-sm text-neutral-700">{status}</p>}
          </form>
        </Card>
      </div>
    </Layout>
  );
}
