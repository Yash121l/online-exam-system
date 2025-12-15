import Link from 'next/link';
import { Layout } from '../components/Layout';
import styles from '../styles/Landing.module.css';

const personas = [
  {
    title: 'Admins & Teachers',
    body: 'Build exams with PDF import, question banks, randomization, section timers, and access controls.',
    cta: 'Open admin console',
    href: '/dashboard/admin'
  },
  {
    title: 'Evaluators',
    body: 'Anonymous grading, rubric alignment, CSV/PDF exports, and difficulty/discrimination analytics.',
    cta: 'Go to reports',
    href: '/dashboard/admin'
  },
  {
    title: 'Students',
    body: 'Join via secure Electron client, enter exam keys, and keep progress synced even when offline.',
    cta: 'Open student portal',
    href: '/dashboard/student'
  }
];

const milestones = [
  { label: 'Plan', detail: 'Define blueprint, timing, randomization, and access rules.' },
  { label: 'Deliver', detail: 'Locked-down Electron client with shortcut blocking and telemetry.' },
  { label: 'Monitor', detail: 'Live tiles, chat, and AI-assisted proctoring with instant flags.' },
  { label: 'Evaluate', detail: 'Auto-marking, anonymous grading, and exportable insights.' }
];

export default function Landing() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.tag}>Secure · Insightful · Uncompromising</p>
          <h1>Deliver high-stakes exams with AI-assisted proctoring</h1>
          <p className={styles.subtitle}>
            AegisExam powers Higher Ed, K-12, and Corporate assessments with locked-down clients, live monitoring, and
            data-rich reporting.
          </p>
          <div className={styles.actions}>
            <Link href="/auth/register" className={styles.primary}>
              Get started
            </Link>
            <Link href="/auth/login" className={styles.secondary}>
              Sign in
            </Link>
          </div>
          <div className={styles.pills}>
            <span>25+ question formats</span>
            <span>AI proctoring</span>
            <span>Offline resync</span>
            <span>Reports & exports</span>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>Real-time telemetry</div>
          <ul>
            <li>Focus shifts and shortcut blocks</li>
            <li>Webcam, mic, and screen streams</li>
            <li>Signed S3 uploads for exam media</li>
            <li>Offline cache with auto-resync</li>
          </ul>
        </div>
      </section>

      <section className={styles.personas}>
        {personas.map((persona) => (
          <article className={styles.card} key={persona.title}>
            <p className={styles.kicker}>{persona.title}</p>
            <p className={styles.body}>{persona.body}</p>
            <Link href={persona.href} className={styles.link}>
              {persona.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className={styles.timeline}>
        <div>
          <p className={styles.kicker}>End-to-end journey</p>
          <h2>From blueprint to grading, covered.</h2>
          <p className={styles.subtitle}>
            Plan schedules, run locked-down delivery, monitor live proctoring, and extract insights for every cohort.
          </p>
        </div>
        <div className={styles.steps}>
          {milestones.map((step) => (
            <div className={styles.step} key={step.label}>
              <div className={styles.stepLabel}>{step.label}</div>
              <div className={styles.stepBody}>{step.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
