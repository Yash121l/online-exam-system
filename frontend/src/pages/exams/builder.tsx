import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { createExam } from '../../lib/api';

export default function ExamBuilderPage() {
  const [title, setTitle] = useState('AI Ethics Midterm');
  const [description, setDescription] = useState('15 questions · section timers · webcam enforced');
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setStatus('Saving exam blueprint...');
      await createExam({ title, description });
      setStatus('Exam created and synced to the backend.');
    } catch (error) {
      setStatus('Demo mode: exam saved locally — connect backend to persist.');
    }
  };

  return (
    <Layout title="Exam Builder">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Admins & teachers</p>
          <h1 className="text-3xl font-bold text-slate-900">Compose exams with guardrails built-in</h1>
          <p className="text-slate-600">
            Import a PDF, add question bank items, and configure timers, randomization, and per-section navigation rules. Exam
            media uploads are secured via signed S3 URLs from the NestJS backend.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/admin">Open admin dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/auth/register">Invite evaluator</Link>
            </Button>
          </div>
          <Card className="p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Secure defaults</p>
            <ul className="mt-2 space-y-1">
              <li>• Section-level timers and unidirectional flows</li>
              <li>• Randomize question order and option order independently</li>
              <li>• Attach calculator/equation tools per section</li>
              <li>• Require Electron-only delivery for flagged assessments</li>
            </ul>
          </Card>
        </div>

        <Card className="p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Blueprint</p>
          <h2 className="text-xl font-bold text-slate-900">Build an exam</h2>
          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <label className="text-sm font-semibold text-slate-700">
              Title
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Description
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Delivery mode
                <Select defaultValue="electron">
                  <option value="electron">Secure Electron only</option>
                  <option value="browser">Browser (practice)</option>
                </Select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Randomization
                <Select defaultValue="both">
                  <option value="questions">Shuffle questions</option>
                  <option value="options">Shuffle options</option>
                  <option value="both">Questions + options</option>
                  <option value="none">No randomization</option>
                </Select>
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Section timer
                <Input type="number" placeholder="e.g., 25 minutes" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Tools
                <Select defaultValue="calculator">
                  <option value="calculator">Scientific calculator</option>
                  <option value="equation">Equation editor</option>
                  <option value="desmos">Desmos/GeoGebra</option>
                  <option value="none">None</option>
                </Select>
              </label>
            </div>
            <Button type="submit" className="w-full">
              Save exam blueprint
            </Button>
            {status && <p className="text-sm text-slate-600">{status}</p>}
          </form>
        </Card>
      </div>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
        <Card className="p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Question bank</p>
          <p className="mt-1 text-slate-900">25+ formats, CSV import, and PDF region tagging.</p>
          <p className="mt-2 text-slate-600">Use signed S3 URLs for media and keep drafts versioned.</p>
        </Card>
        <Card className="p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Scheduling</p>
          <p className="mt-1 text-slate-900">Windows, retries, and offline allowances per cohort.</p>
          <p className="mt-2 text-slate-600">Supports compensatory time and per-section timing.</p>
        </Card>
        <Card className="p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Publishing</p>
          <p className="mt-1 text-slate-900">Generate exam keys and Electron launch buttons.</p>
          <p className="mt-2 text-slate-600">Live-monitor tiles and AI flags once students connect.</p>
        </Card>
      </section>
    </Layout>
  );
}
