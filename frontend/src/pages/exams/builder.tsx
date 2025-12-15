import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { createExam, createQuestion, fetchQuestionBank, publishExam, requestPdfImport, requestUploadUrl, scheduleExam } from '../../lib/api';

export default function ExamBuilderPage() {
  const [title, setTitle] = useState('AI Ethics Midterm');
  const [description, setDescription] = useState('15 questions · section timers · webcam enforced');
  const [status, setStatus] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [questionBank, setQuestionBank] = useState<any[]>([]);
  const [questionPrompt, setQuestionPrompt] = useState('What principle does GDPR emphasize?');
  const [questionType, setQuestionType] = useState('MCQ');
  const [mediaKey, setMediaKey] = useState('');
  const [windowStart, setWindowStart] = useState('');
  const [windowEnd, setWindowEnd] = useState('');
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [pdfKey, setPdfKey] = useState('exams/uploads/blueprint.pdf');
  const questionTypes = useMemo(
    () => [
      'MCQ',
      'TRUE_FALSE',
      'SHORT_ANSWER',
      'LONG_ANSWER',
      'FILL_BLANK',
      'MATCHING',
      'ORDERING',
      'NUMERIC_RANGE',
      'MATRIX_RATING',
      'LIKERT',
      'HOTSPOT',
      'DRAG_DROP',
      'CLOZE',
      'TABLE_COMPLETION',
      'GRAPH_SKETCH',
      'CHART_LABELING',
      'COMPREHENSION',
      'CASE_STUDY',
      'SIMULATION',
      'AUDIO_RESPONSE',
      'VIDEO_RESPONSE'
    ],
    []
  );

  useEffect(() => {
    fetchQuestionBank()
      .then((items) => setQuestionBank(items))
      .catch(() => setStatus('Demo mode: using cached question bank.'));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setStatus('Saving exam blueprint...');
      const created = await createExam({ title, description });
      setExamId(created.id);
      setStatus('Exam created and synced to the backend. Continue configuring.');
    } catch (error) {
      setStatus('Demo mode: exam saved locally — connect backend to persist.');
    }
  };

  const onCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!examId) {
      setStatus('Create the exam first.');
      return;
    }
    try {
      setStatus('Saving question...');
      await createQuestion(examId, {
        prompt: questionPrompt,
        type: questionType,
        options: { choices: ['Transparency', 'Surveillance', 'Bias'], shuffle: randomizeOptions },
        answerKey: { correct: 'Transparency' },
        mediaKey: mediaKey || undefined
      });
      setStatus('Question saved to exam.');
    } catch (err) {
      setStatus('Failed to save question to backend.');
    }
  };

  const onSchedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!examId) return setStatus('Create the exam first.');
    try {
      setStatus('Scheduling window...');
      await scheduleExam(examId, {
        windowStart: windowStart || undefined,
        windowEnd: windowEnd || undefined,
        navigation: 'section-lock',
        randomizeOptions,
        randomizeQuestions
      });
      setStatus('Scheduling updated.');
    } catch (err) {
      setStatus('Unable to persist schedule.');
    }
  };

  const onPublish = async () => {
    if (!examId) return setStatus('Create the exam first.');
    try {
      setStatus('Publishing exam...');
      await publishExam(examId, true);
      setStatus('Exam published with randomization + schedule.');
    } catch (err) {
      setStatus('Failed to publish exam.');
    }
  };

  const onUploadMedia = async () => {
    if (!mediaKey) return setStatus('Provide a storage key first.');
    try {
      const signed = await requestUploadUrl(mediaKey, 'image/png');
      await fetch(signed.url, { method: 'PUT', body: new Blob() });
      setStatus(`Media placeholder uploaded to ${signed.key}`);
    } catch (err) {
      setStatus('Could not upload media to S3.');
    }
  };

  const onImportPdf = async () => {
    if (!examId) return setStatus('Create the exam first.');
    try {
      const upload = await requestPdfImport({ examId, key: pdfKey });
      await fetch(upload.upload.url, { method: 'PUT', body: new Blob() });
      setStatus('PDF import registered. Tag regions after upload finishes.');
    } catch (err) {
      setStatus('Failed to request PDF import.');
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

        <Card className="p-5 shadow-card space-y-4">
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
          <div className="border-t pt-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800">Scheduling & publishing</h3>
              <Button size="sm" type="button" onClick={onPublish} disabled={!examId}>
                Publish
              </Button>
            </div>
            <form className="mt-3 grid gap-2" onSubmit={onSchedule}>
              <div className="grid gap-2 md:grid-cols-2">
                <Input type="datetime-local" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} placeholder="Window start" />
                <Input type="datetime-local" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} placeholder="Window end" />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="text-xs font-medium text-slate-700">
                  Randomize questions
                  <Select value={randomizeQuestions ? 'yes' : 'no'} onChange={(e) => setRandomizeQuestions(e.target.value === 'yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </label>
                <label className="text-xs font-medium text-slate-700">
                  Randomize options
                  <Select value={randomizeOptions ? 'yes' : 'no'} onChange={(e) => setRandomizeOptions(e.target.value === 'yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </label>
              </div>
              <Button type="submit" variant="secondary" disabled={!examId}>
                Save schedule
              </Button>
            </form>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-800">Question authoring</h3>
            <form className="mt-3 space-y-2" onSubmit={onCreateQuestion}>
              <Input value={questionPrompt} onChange={(e) => setQuestionPrompt(e.target.value)} placeholder="Question prompt" />
              <div className="grid gap-2 md:grid-cols-2">
                <Select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                <Input value={mediaKey} onChange={(e) => setMediaKey(e.target.value)} placeholder="s3:// key for media" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!examId}>
                  Save question
                </Button>
                <Button type="button" variant="secondary" onClick={onUploadMedia}>
                  Upload media
                </Button>
              </div>
            </form>
            <div className="mt-3 rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-700">Question bank</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {questionBank.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    {item.prompt} <span className="text-slate-500">({item.format})</span>
                  </li>
                ))}
                {questionBank.length === 0 && <li className="text-slate-500">No bank items yet.</li>}
              </ul>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-800">PDF import & tagging</h3>
            <div className="flex flex-col gap-2 md:flex-row">
              <Input value={pdfKey} onChange={(e) => setPdfKey(e.target.value)} />
              <Button type="button" onClick={onImportPdf} disabled={!examId}>
                Request import
              </Button>
            </div>
          </div>
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
