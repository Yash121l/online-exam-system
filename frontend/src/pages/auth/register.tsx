import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Layout } from '../../components/Layout';
import { clientLogger } from '../../lib/logger';
import { registerUser, getAuth } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';

const personaPresets = [
  { label: 'Admin', role: 'ADMIN', email: 'admin@example.com', name: 'Admin' },
  { label: 'Teacher', role: 'TEACHER', email: 'teacher@example.com', name: 'Teacher' },
  { label: 'Student', role: 'STUDENT', email: 'student@example.com', name: 'Student' }
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@example.com');
  const [name, setName] = useState('Student');
  const [role, setRole] = useState('STUDENT');
  const [password, setPassword] = useState('ChangeMe123!');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await registerUser({ email, displayName: name, role, password });
      clientLogger.info('User registered', { email, role });
      const auth = getAuth();
      if (auth?.role === 'STUDENT') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/admin');
      }
    } catch (err: any) {
      setError('Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Register">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Create your seat</p>
          <h1 className="text-3xl font-bold text-slate-900">Join AegisExam</h1>
          <p className="text-slate-600">Admins set up exams; students access with the secure Electron client and web portal.</p>
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
            {personaPresets.map((preset) => (
              <Button
                key={preset.label}
                variant={role === preset.role ? 'primary' : 'secondary'}
                onClick={() => {
                  setRole(preset.role);
                  setEmail(preset.email);
                  setName(preset.name);
                }}
              >
                {preset.label} preset
              </Button>
            ))}
          </div>
          <Card className="p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">User flows</p>
            <ul className="mt-2 space-y-1">
              <li>• Admin/Teacher: build exams, publish keys, monitor AI flags.</li>
              <li>• Evaluator: anonymous grading and rubric alignment.</li>
              <li>• Student: launch exams via Electron and sync work offline.</li>
            </ul>
          </Card>
        </div>
        <Card className="p-5">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-slate-700">
              Display Name
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Email
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Role
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="EVALUATOR">Evaluator</option>
                <option value="STUDENT">Student</option>
              </Select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
