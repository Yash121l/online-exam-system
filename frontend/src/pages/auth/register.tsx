import { useRouter } from 'next/router';
import { FormEvent, useMemo, useState } from 'react';
import { Layout } from '../../components/Layout';
import { clientLogger } from '../../lib/logger';
import { registerUser, getAuth } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';

const personaPresets = [
  { label: 'Admin', role: 'ADMIN', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin' },
  { label: 'Teacher', role: 'TEACHER', email: 'teacher@example.com', firstName: 'Tara', lastName: 'Teacher' },
  { label: 'Student', role: 'STUDENT', email: 'student@example.com', firstName: 'Sam', lastName: 'Student' }
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@example.com');
  const [firstName, setFirstName] = useState('Sam');
  const [lastName, setLastName] = useState('Student');
  const [role, setRole] = useState('STUDENT');
  const [password, setPassword] = useState('ChangeMe123!');
  const [organizationId, setOrganizationId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
    if (password.length >= 8) return 'Medium';
    return 'Weak';
  }, [password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await registerUser({ email, firstName, lastName, role, password, organizationId: organizationId || undefined, phoneNumber: phoneNumber || undefined });
      clientLogger.info('User registered', { email, role });
      const auth = getAuth();
      const nextRole = auth?.user?.role;
      if (nextRole === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (nextRole === 'EVALUATOR') {
        router.push('/evaluator/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Register">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-neutral-200">Create your seat</p>
          <h1 className="text-3xl font-bold text-primary dark:text-neutral-50">Join AegisExam</h1>
          <p className="text-neutral-700 dark:text-neutral-300">
            Admins and teachers design exams; evaluators grade; students launch via the secure Electron client and web portal.
          </p>
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-500/10">{error}</div>}
          <div className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-neutral-200">
            {personaPresets.map((preset) => (
              <Button
                key={preset.label}
                variant={role === preset.role ? 'primary' : 'secondary'}
                onClick={() => {
                  setRole(preset.role);
                  setEmail(preset.email);
                  setFirstName(preset.firstName);
                  setLastName(preset.lastName);
                }}
              >
                {preset.label} preset
              </Button>
            ))}
          </div>
          <Card className="p-4 text-sm text-slate-700 dark:bg-neutral-800 dark:text-neutral-200">
            <p className="font-semibold text-slate-900 dark:text-neutral-50">User flows</p>
            <ul className="mt-2 space-y-1">
              <li>• Admin/Teacher: build exams, publish keys, monitor AI flags.</li>
              <li>• Evaluator: anonymous grading and rubric alignment.</li>
              <li>• Student: launch exams via Electron and sync work offline.</li>
            </ul>
          </Card>
        </div>
        <Card className="p-5 dark:bg-neutral-800">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
                First Name
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
                Last Name
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
              Email
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
                Role
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ADMIN">Admin</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="EVALUATOR">Evaluator</option>
                  <option value="STUDENT">Student</option>
                </Select>
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
                Organization (optional)
                <Input value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} placeholder="Org ID or name" />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
              Phone (optional)
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 555 000 0000" />
            </label>
            <label className="text-sm font-semibold text-slate-700 dark:text-neutral-100">
              Password
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </label>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Strength: {passwordStrength}</p>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
